import { IContext } from "../../../connectionResolver";
import { sendCoreMessage } from "../../../messageBroker";
import { IReserveRemDocument } from "../../../models/definitions/reserveRems";

export default {
  async __resolveReference({ _id }, { models }: IContext) {
    return models.ReserveRems.findOne({ _id });
  },

  async branch(
    reserveRem: IReserveRemDocument,
    _,
    { dataLoaders, subdomain }: IContext
  ) {
    return await sendCoreMessage({
      subdomain,
      action: "branches.findOne",
      data: { _id: reserveRem.branchId },
      isRPC: true
    });
  },

  async department(
    reserveRem: IReserveRemDocument,
    _,
    { dataLoaders, subdomain }: IContext
  ) {
    return await sendCoreMessage({
      subdomain,
      action: "departments.findOne",
      data: { _id: reserveRem.departmentId },
      isRPC: true
    });
  },

  async product(
    reserveRem: IReserveRemDocument,
    _,
    { dataLoaders, subdomain }: IContext
  ) {
    return await sendCoreMessage({
      subdomain,
      action: "products.findOne",
      data: { _id: reserveRem.productId },
      isRPC: true
    });
  }
};
