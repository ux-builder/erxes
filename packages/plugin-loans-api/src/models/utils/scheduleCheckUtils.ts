import { IModels } from '../../connectionResolver';
import { IConfig } from '../../interfaces/config';
import { SCHEDULE_STATUS } from '../definitions/constants';
import { IContractDocument } from '../definitions/contracts';
import { IScheduleDocument } from '../definitions/schedules';
import { getDiffDay } from './utils';

export async function checkCurrentDateSchedule(
  contract: IContractDocument,
  currentDate: Date,
  models: IModels,
  config: IConfig
): Promise<IScheduleDocument | null | undefined> {

  const lastSchedule = await models.Schedules.findOne({
    contractId: contract._id,
    payDate: { $lt: currentDate }
  })
    .sort({ payDate: -1 })
    .lean<IScheduleDocument>();

  if (!lastSchedule) return;

  const diff = getDiffDay(lastSchedule.payDate, currentDate);

  if (
    diff > 0 &&
    lastSchedule.isDefault === true &&
    lastSchedule.status === SCHEDULE_STATUS.PENDING
  ) {
    await models.Schedules.updateOne(
      { _id: lastSchedule._id },
      // { $set: { status: SCHEDULE_STATUS.EXPIRED, balance: contract.loanBalanceAmount } }
      { $set: { status: SCHEDULE_STATUS.EXPIRED, balance: 0 } }
    );
  }

  return lastSchedule;
}
