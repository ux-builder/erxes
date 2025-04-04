import { IContext } from "../../connectionResolver";
import { ISyncLogDocument } from "../../models/definitions/syncLog";

export default {
  async __resolveReference({ _id }, { models }: IContext) {
    return models.SyncLogs.findOne({ _id });
  },

  async content(syncLog: ISyncLogDocument, _) {
    const { contentType, contentId } = syncLog;

    if (contentType === "core:customer") {
      const info = syncLog.consumeData.object;
      return (
        info.code ||
        info.primaryEmail ||
        info.primaryPhone ||
        `${info.firstName ?? ""}${info.lastName ?? ""}` ||
        contentId
      );
    }

    if (['loans:transaction', 'loans:contract', 'savings:contract'].includes(contentType || '')) {
      const info = syncLog.consumeData?.updateDocument || syncLog.consumeData?.object || syncLog.consumeData;
      return info.number || contentId;
    }

    if (contentType === "core:user") {
      const info = syncLog.consumeData.object;
      return info.email || contentId;
    }

    return contentId;
  }
};
