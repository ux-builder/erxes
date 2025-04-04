import * as dotenv from 'dotenv';

import { removeAccount, removeCustomers, removeIntegration } from './helpers';

import { userIds } from './userMiddleware';
import { getConfig } from './utils';
import {
  callproCreateIntegration,
  callproGetAudio,
} from './callpro/controller';
import { sendMessage as sendCommonMessage } from '@erxes/api-utils/src/core';
import type { MessageArgsOmitService } from '@erxes/api-utils/src/core';

import { generateModels } from './connectionResolver';
import {
  RPResult,
  consumeQueue,
  consumeRPCQueue,
} from '@erxes/api-utils/src/messageBroker';

dotenv.config();

export const setupMessageConsumers = async () => {
  consumeRPCQueue(
    'integrations:getAccounts',
    async ({ subdomain, data: { kind } }) => {
      const models = await generateModels(subdomain);

      const selector = { kind };

      return {
        data: await models.Accounts.find(selector).lean(),
        status: 'success',
      };
    },
  );

  // listen for rpc queue =========
  consumeRPCQueue(
    'integrations:api_to_integrations',
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);

      const { action } = data;

      let response: RPResult = {
        status: 'success',
      };

      try {
        if (action === 'remove-account') {
          response.data = await removeAccount(models, data._id);
        }

        if (action === 'getTelnyxInfo') {
          response.data = {
            telnyxApiKey: await getConfig(models, 'TELNYX_API_KEY'),
            integrations: await models.Integrations.find({ kind: 'telnyx' }),
          };
        }

        if (action === 'getConfigs') {
          response.data = await models.Configs.find({});
        }

        if (action === 'getDetails') {
          const integration = await models.Integrations.findOne({
            erxesApiId: data.inboxId,
          }).select(['-_id', '-kind', '-erxesApiId']);

          response.data = integration;
        }
      } catch (e) {
        response = {
          status: 'error',
          errorMessage: e.message,
        };
      }

      return response;
    },
  );

  // '/callpro/get-audio',
  consumeRPCQueue(
    'integrations:getCallproAudio',
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);

      return {
        data: await callproGetAudio(models, data),
        status: 'success',
      };
    },
  );

  consumeRPCQueue(
    'integrations:createIntegration',
    async ({ subdomain, data: { doc, kind } }) => {
      const models = await generateModels(subdomain);

      if (kind === 'callpro') {
        return callproCreateIntegration(models, doc);
      } else {
        return {
          status: 'error',
          errorMessage: `Unsupported kind: ${kind}`,
        };
      }
    },
  );

  consumeRPCQueue(
    'integrations:updateIntegration',
    async ({ subdomain, data: { integrationId, doc } }) => {
      const models = await generateModels(subdomain);
      const details = JSON.parse(doc.data);

      const integration = await models.Integrations.findOne({
        erxesApiId: integrationId,
      });

      if (!integration) {
        return {
          status: 'error',
          errorMessage: 'Integration not found.',
        };
      }

      await models.Integrations.updateOne(
        { erxesApiId: integrationId },
        { $set: details },
      );

      return {
        status: 'success',
      };
    },
  );

  // '/integrations/remove',
  consumeRPCQueue(
    'integrations:removeIntegrations',
    async ({ subdomain, data: { integrationId } }) => {
      const models = await generateModels(subdomain);

      await removeIntegration(models, integrationId);

      return { status: 'success' };
    },
  );

  consumeRPCQueue(
    'integrations:configs.findOne',
    async ({ subdomain, data: { code } }) => {
      const models = await generateModels(subdomain);

      return {
        data: await models.Configs.findOne({ code }),
        status: 'success',
      };
    },
  );

  consumeRPCQueue(
    'integrations:configs.find',
    async ({ subdomain, data: { selector } }) => {
      const models = await generateModels(subdomain);

      return {
        data: await models.Configs.find(selector).lean(),
        status: 'success',
      };
    },
  );

  consumeQueue('integrations:notification', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    const { payload, type } = data;

    switch (type) {
      case 'removeCustomers':
        await removeCustomers(models, data);
        break;
      case 'addUserId':
        userIds.push(payload._id);
        break;
      default:
        break;
    }
  });
};

export const sendInboxMessage = (args: MessageArgsOmitService) => {
  return sendCommonMessage({
    serviceName: 'inbox',
    ...args,
  });
};
