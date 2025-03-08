import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface ICallHistory {
  customerPhone: string;
  callDuration: number;
  callStartTime: Date;
  callEndTime: Date;
  callStatus: string;
  customerAudioTrack: string;
  operatorAudioTrack: string;
  modifiedAt: Date;
  createdAt: Date;
  createdBy: string;
  modifiedBy: string;
  conversationId: string;
  acceptedUserId: string;
  recordUrl: string;
  endedBy: string;
}

export interface ICallHistoryDocument extends ICallHistory, Document {
  _id: string;
}

export const callHistorySchema = new Schema({
  customerPhone: field({ type: String, label: 'customer number' }),
  callDuration: field({ type: Number, label: 'duration' }),
  callStartTime: field({ type: Date, label: 'call start time' }),
  callEndTime: field({ type: Date, label: 'call end time' }),
  callStatus: field({
    type: String,
    label: 'status',
    enum: [
      'ringing',
      'missed',
      'connected',
      'rejected',
      'cancelled',
      'active',
      'transfered',
    ],
    default: 'missed',
  }),
  acceptedUserId: field({
    type: String,
    label: 'call accepted operator id',
  }),
  customerAudioTrack: field({
    type: String,
    label: 'customer audio tracks its includes track name and session id',
  }),
  operatorAudioTrack: field({
    type: String,
    label: 'operator audio tracks its includes track name and session id',
  }),
  modifiedAt: field({ type: Date, label: 'modified date' }),
  createdAt: field({ type: Date, label: 'created date', default: new Date() }),
  createdBy: field({ type: String, label: 'created By' }),
  modifiedBy: field({ type: String, label: 'updated By' }),
  conversationId: field({ type: String, label: 'erxes conversation id' }),
  inboxIntegrationId: field({ type: String, label: 'erxes integration id' }),
  recordUrl: field({ type: String, label: 'record url' }),
  endedBy: field({
    type: String,
    label: `'operator' indicates the call was ended by Erxes, while 'customer' indicates the call was ended by the customer`,
  }),
});
