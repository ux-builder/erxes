import { paginate, regexSearchText } from "erxes-api-utils";
import { getFullDate, getTomorrow } from "../../../utils";

const generateFilter = async (models, params, commonQuerySelector) => {
  const filter: any = commonQuerySelector;

  if (params.search) {
    filter.$or = [
      { billId: { $in: [new RegExp(`.*${params.search}.*`, "i")] } },
      { returnBillId: { $in: [new RegExp(`.*${params.search}.*`, "i")] } },
    ];
  }

  if (params.billIdRule) {
    if (params.billIdRule === "00") {
      filter.billId = { $in: ["", null] };
      filter.returnBillId = { $in: ["", null] };
    }
    if (params.billIdRule === "01") {
      filter.billId = { $in: ["", null] };
      filter.returnBillId = { $nin: ["", null] };
    }
    if (params.billIdRule === "10") {
      filter.billId = { $nin: ["", null] };
      filter.returnBillId = { $in: ["", null] };
    }
    if (params.billIdRule === "11") {
      filter.billId = { $nin: ["", null] };
      filter.returnBillId = { $nin: ["", null] };
    }
  }

  if (params.contentType) {
    filter.contentType = params.contentType;

    if (params.contentType === "pos" && params.orderNumber) {
      const posOrders = await models.PosOrders.find(
        { number: { $regex: new RegExp(params.orderNumber) } },
        { _id: 1 }
      ).lean();
      filter.contentId = { $in: (posOrders || []).map((p) => p._id) };
    }

    if (params.contentType === "deal") {
      const dealsFilter: any = {};
      if (params.pipelineId) {
        if (params.stageId) {
          dealsFilter.stageId = params.stageId;
        } else {
          const stages = await models.Stages.find(
            { pipelineId: params.pipelineId },
            { _id: 1 }
          ).lean();
          dealsFilter.stageId = { $in: (stages || []).map((s) => s._id) };
        }
      }
      if (params.dealName) {
        Object.assign(dealsFilter, regexSearchText(params.dealName));
      }

      if (Object.keys(dealsFilter).length) {
        const deals = await models.Deals.find(dealsFilter, { _id: 1 }).lean();
        filter.contentId = { $in: (deals || []).map((p) => p._id) };
      }
    }
  }

  if (params.success) {
    filter.success = params.success;
  }

  if (params.billType) {
    filter.billType = params.billType;
  }

  const createdQry: any = {};
  if (params.createdStartDate) {
    createdQry.$gte = new Date(params.createdStartDate);
  }
  if (params.createdEndDate) {
    createdQry.$lte = new Date(params.createdEndDate);
  }
  if (Object.keys(createdQry).length) {
    filter.createdAt = createdQry;
  }

  if (params.paidDate === "today") {
    const now = new Date();

    const startDate = getFullDate(now);
    const endDate = getTomorrow(now);
    filter.createdAt = { $gte: startDate, $lte: endDate };
  }

  return filter;
};

export const sortBuilder = (params) => {
  const sortField = params.sortField;
  const sortDirection = params.sortDirection || 0;

  if (sortField) {
    return { [sortField]: sortDirection };
  }

  return {};
};

const queries = {
  putResponses: async (_root, params, { commonQuerySelector, models }) => {
    return paginate(
      models.PutResponses.find(
        await generateFilter(models, params, commonQuerySelector)
      ).sort(sortBuilder(params)),
      {
        page: params.page,
        perPage: params.perPage,
      }
    );
  },

  putResponsesCount: async (_root, params, { commonQuerySelector, models }) => {
    return models.PutResponses.find(
      await generateFilter(models, params, commonQuerySelector)
    ).countDocuments();
  },

  getDealLink: async (_root, param, { models }) => {
    const deal = await models.Deals.getDeal(param._id);
    const stage = await models.Stages.getStage(deal.stageId);
    const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);
    const board = await models.Boards.getBoard(pipeline.boardId);

    return `/${stage.type}/board?id=${board._id}&pipelineId=${pipeline._id}&itemId=${param._id}`;
  },
};

export default queries;
