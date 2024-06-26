import { generateModels } from './connectionResolver';
import { sendPosclientMessage } from './messageBroker';

export default {
  transactionCallback: async ({ subdomain, data }) => {
    // TODO: implement transaction callback if necessary
  },
  callback: async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    if (data.contentType !== 'pos:orders' || data.status !== 'paid') {
      return;
    }

    const { posToken } = data.data;
    const pos = await models.Pos.getPos({ token: posToken });

    await sendPosclientMessage({
      subdomain,
      action: 'paymentCallbackClient',
      data,
      pos,
      isRPC: false,
    });
  }
};
