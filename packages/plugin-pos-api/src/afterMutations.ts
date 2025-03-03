import { generateModels, IModels } from "./connectionResolver";
import {
  sendPosclientMessage,
  sendPricingMessage,
  sendCoreMessage
} from "./messageBroker";
import { IPosDocument } from "./models/definitions/pos";
import { calcProductsTaxRule, getChildCategories } from "./utils";

const handler = async (
  subdomain,
  params: any,
  action: string,
  type: string,
  pos: IPosDocument
) => {
  await sendPosclientMessage({
    subdomain,
    action: "crudData",
    data: { ...params, action, type },
    pos
  });
};

const isInProduct = async (
  subdomain: string,
  models: IModels,
  pos: IPosDocument,
  productId: string
) => {
  const groups = await models.ProductGroups.groups(pos._id);

  const followProductIds: string[] = [];

  if (pos.deliveryConfig && pos.deliveryConfig.productId) {
    followProductIds.push(pos.deliveryConfig.productId);
  }

  if (pos.catProdMappings && pos.catProdMappings.length) {
    for (const map of pos.catProdMappings) {
      if (!followProductIds.includes(map.productId)) {
        followProductIds.push(map.productId);
      }
    }
  }

  if (followProductIds.includes(productId)) {
    return true;
  }

  let allExcludedProductIds: string[] = [];
  let allCategoryIds: string[] = [];

  for (const group of groups) {
    const includeCatIds = await getChildCategories(
      subdomain,
      group.categoryIds
    );
    const excludeCatIds = await getChildCategories(
      subdomain,
      group.excludedCategoryIds
    );

    const productCategoryIds = includeCatIds.filter(
      c => !excludeCatIds.includes(c)
    );

    allExcludedProductIds = allExcludedProductIds.concat(
      group.excludedProductIds
    );
    allCategoryIds = allCategoryIds.concat(productCategoryIds);
  } // end product group for loop

  if (allExcludedProductIds.includes(productId)) {
    return false;
  }

  const products = await sendCoreMessage({
    subdomain,
    action: "products.find",
    data: {
      query: {
        status: { $ne: "deleted" },
        categoryId: { $in: allCategoryIds },
        _id: productId
      }
    },
    isRPC: true,
    defaultValue: []
  });

  if (!products.length) {
    return false;
  }

  return true;
};

const isInProductCategory = async (
  subdomain: string,
  models: IModels,
  pos: IPosDocument,
  categoryId: string
) => {
  const groups = await models.ProductGroups.groups(pos._id);

  let categoryIds: string[] = [];

  for (const group of groups) {
    const includeCatIds = await getChildCategories(
      subdomain,
      group.categoryIds
    );
    const excludeCatIds = await getChildCategories(
      subdomain,
      group.excludedCategoryIds
    );

    const productCategoryIds = includeCatIds.filter(
      c => !excludeCatIds.includes(c)
    );

    const productCategories = await sendCoreMessage({
      subdomain,
      action: "categories.find",
      data: { query: { _id: { $in: productCategoryIds } }, sort: { order: 1 } },
      isRPC: true,
      defaultValue: []
    });

    categoryIds = categoryIds.concat(productCategories.map(p => p._id));
  } // end product group for loop
  return categoryIds.includes(categoryId);
};

const isInUser = (pos: IPosDocument, userId: string) => {
  const allUserIds = (pos.adminIds || []).concat(pos.cashierIds || []);
  return allUserIds.includes(userId);
};

export default {
  "core:user": ["update", "delete"],
  "products:productCategory": ["create", "update", "delete"],
  "core:product": ["create", "update", "delete"]
};

export const afterMutationHandlers = async (subdomain, params) => {
  const { type, action } = params;
  const models = await generateModels(subdomain);
  const poss = await models.Pos.find({});

  if (type === "core:product") {
    for (const pos of poss) {
      if (await isInProduct(subdomain, models, pos, params.object._id)) {
        const item = params.updatedDocument || params.object;
        const firstUnitPrice = params.updatedDocument
          ? params.updatedDocument.unitPrice
          : params.object.unitPrice;

        const pricing = await sendPricingMessage({
          subdomain,
          action: "checkPricing",
          data: {
            prioritizeRule: "only",
            totalAmount: 0,
            departmentId: pos.departmentId,
            branchId: pos.branchId,
            products: [
              {
                itemId: item._id,
                productId: item._id,
                quantity: 1,
                price: item.unitPrice
              }
            ]
          },
          isRPC: true,
          defaultValue: {}
        });

        const discount = pricing[item._id] || {};

        if (Object.keys(discount).length) {
          let unitPrice = (item.unitPrice -= discount.value);
          if (unitPrice < 0) {
            unitPrice = 0;
          }

          let isCheckRem = false;
          if (pos.isCheckRemainder) {
            const excludeCategoryIds = await getChildCategories(
              subdomain,
              pos.checkExcludeCategoryIds
            );

            if (!excludeCategoryIds.includes(item.categoryId)) {
              isCheckRem = true;
            }
          }

          if (params.updatedDocument) {
            params.updatedDocument.unitPrice = unitPrice;
            params.updatedDocument.isCheckRem = isCheckRem;
          } else {
            params.object.unitPrice = unitPrice;
            params.object.isCheckRem = isCheckRem;
          }
        }

        const productById = await calcProductsTaxRule(subdomain, pos.ebarimtConfig, [item]);
        if (productById[item._id]?.taxRule) {
          if (params.updatedDocument) {
            params.updatedDocument.taxRule = productById[item._id].taxRule;
          } else {
            params.object.taxRule = productById[item._id].taxRule;
          }
        }

        await handler(subdomain, { ...params }, action, "product", pos);

        if (params.updatedDocument) {
          params.updatedDocument.unitPrice = firstUnitPrice;
        } else {
          params.object.unitPrice = firstUnitPrice;
        }
      }
    }
    return;
  }

  if (type === "products:productCategory") {
    for (const pos of poss) {
      if (
        await isInProductCategory(subdomain, models, pos, params.object._id)
      ) {
        await handler(subdomain, params, action, "productCategory", pos);
      }
    }
    return;
  }

  if (type === "core:user") {
    for (const pos of poss) {
      if (await isInUser(pos, params.object._id)) {
        await handler(subdomain, params, action, "user", pos);
      }
    }
    return;
  }
};
