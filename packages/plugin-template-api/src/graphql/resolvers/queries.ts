import { IContext } from '@erxes/api-utils/src/types';
import { Accounts, Messages } from '../../models';

const queries = {
  async templateConversationDetail(
    _root: any,
    { conversationId }: { conversationId: string },
    _context: IContext
  ) {
    const messages = await Messages.find({
      inboxConversationId: conversationId
    });

    const convertEmails = (emails: any) =>
      (emails || []).map((item: any) => ({ name: item.name, email: item.address }));

    return messages.map((message: any) => {
      return {
        _id: message._id,
        mailData: {
          messageId: message.messageId,
          from: convertEmails(message.from),
          to: convertEmails(message.to),
          cc: convertEmails(message.cc),
          bcc: convertEmails(message.bcc),
          subject: message.subject,
          body: message.body,
        }
      };
    });
  },

  async templateAccounts(_root: any, _args: any, _context: IContext) {
    return Accounts.getAccounts();
  }
};

export default queries;