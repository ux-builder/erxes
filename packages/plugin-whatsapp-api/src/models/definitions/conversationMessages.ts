import { Document, Schema } from "mongoose";

import { attachmentSchema } from "@erxes/api-utils/src/definitions/common";
import { field } from "./utils";

export interface IConversationMessage {
  mid: string;
  conversationId: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  attachments?: any;
  customerId?: string;
  visitorId?: string;
  userId?: string;
  fromBot?: boolean;
  isCustomerRead?: boolean;
  internal?: boolean;
  botId?: string;
  botData?: any;
}

export interface IConversationMessageDocument
  extends IConversationMessage,
    Document {
  _id: string;
}

export const conversationMessageSchema = new Schema({
  _id: field({ pkey: true }),
  mid: { type: String, label: "INSTAGRAM message id" },
  content: { type: String },
  attachments: [attachmentSchema],
  conversationId: field({ type: String, index: true }),
  customerId: field({ type: String, index: true }),
  visitorId: field({
    type: String,
    index: true,
    label: "unique visitor id on logger database"
  }),
  fromBot: field({ type: Boolean }),
  userId: field({ type: String, index: true }),
  createdAt: field({ type: Date, index: true }),
  updatedAt: field({ type: Date, index: true }),
  isCustomerRead: field({ type: Boolean }),
  internal: field({ type: Boolean }),
  botId: field({ type: String, label: "Bot", optional: true }),
  botData: field({ type: Object, optional: true })
});
