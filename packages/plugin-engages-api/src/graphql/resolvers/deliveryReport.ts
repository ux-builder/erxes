import { IContext } from "../../connectionResolver";
import { IDeliveryReportsDocument } from "../../models/DeliveryReports";

export default {
  async __resolveReference({ _id }: IDeliveryReportsDocument, _args, { models }: IContext) {
    return models.DeliveryReports.findOne({ _id });
  },
  async engage({ engageMessageId }: IDeliveryReportsDocument, _args, { models }: IContext) {
    return models.EngageMessages.findOne({ _id: engageMessageId }, { title: 1 });
  }
};
