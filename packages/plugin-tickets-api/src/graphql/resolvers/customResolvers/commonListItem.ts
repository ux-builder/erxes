import { IContext } from '../../../connectionResolver';
import { sendCoreMessage } from '../../../messageBroker';
import { IItemCommonFields } from '../../../models/definitions/boards';
import { ITicketDocument } from '../../../models/definitions/tickets';

export default {
  async branches(item: IItemCommonFields, args, { subdomain }: IContext) {
    return sendCoreMessage({
      subdomain,
      action: 'branches.find',
      data: {
        query: { _id: { $in: item.branchIds } },
      },
      isRPC: true,
      defaultValue: [],
    });
  },
  async departments(item: IItemCommonFields, args, { subdomain }: IContext) {
    return sendCoreMessage({
      subdomain,
      action: 'departments.find',
      data: {
        _id: { $in: item.departmentIds },
      },
      isRPC: true,
      defaultValue: [],
    });
  },
  async customPropertiesData(
    item: IItemCommonFields,
    _args,
    { user, subdomain }
  ) {
    const customFieldsData = (item?.customFieldsData as any[]) || [];

    const fieldIds = customFieldsData.map((customField) => customField.field);

    if (!fieldIds?.length) {
      return customFieldsData;
    }

    const fields = await sendCoreMessage({
      subdomain,
      action: 'fields.find',
      data: {
        query: { _id: { $in: fieldIds } },
      },
      isRPC: true,
      defaultValue: [],
    });

    for (const customFieldData of customFieldsData) {
      const field = fields.find((field) => field._id === customFieldData.field);
      if (field) {
        customFieldData.type = field.type;
      }
    }

    return customFieldsData;
  },
  createdUserId(item: { _id: string } & IItemCommonFields) {
    return item?.userId ? item.userId : null;
  },
  async tags(ticket: ITicketDocument) {
    return (ticket.tagIds || []).map((_id) => ({ __typename: 'Tag', _id }));
  },
};
