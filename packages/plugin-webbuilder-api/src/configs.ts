import typeDefs from './graphql/typeDefs';
import fetch from 'node-fetch';
import resolvers from './graphql/resolvers';

import { setupMessageConsumers } from './messageBroker';
import { getSubdomain } from '@erxes/api-utils/src/core';
import { generateModels } from './connectionResolver';
import { pageReplacer } from './utils';
const permissions = require('./permissions');
import app from '@erxes/api-utils/src/app';

const HELPERS_DOMAIN = `http://localhost:3000`; 

export default {
  name: 'webbuilder',
  permissions,
  meta: { permissions },
  graphql: async () => {
    return {
      typeDefs: await typeDefs(),
      resolvers: await resolvers(),
    };
  },
  apolloServerContext: async (context, req) => {
    const subdomain = getSubdomain(req);

    const models = await generateModels(subdomain);

    context.subdomain = subdomain;
    context.models = models;

    return context;
  },
  onServerInit: async () => {
    app.get('/:sitename', async (req, res) => {
      const { sitename } = req.params;

      const subdomain = getSubdomain(req);
      const models = await generateModels(subdomain);

      const site = await models.Sites.findOne({ name: sitename }).lean();

      if (!site) {
        return res.status(404).send('Not found');
      }

      const page = await models.Pages.findOne({
        siteId: site._id,
        name: 'home',
      });

      if (!page) {
        return res.status(404).send('Not found');
      }

      const html = await pageReplacer(models, subdomain, page, site);

      return res.send(
        `
          ${html}
          <style>
            ${page.css}
          </style>
        `,
      );
    });

    app.get('/:sitename/detail/:contenttype/:entryid', async (req, res) => {
      const subdomain = getSubdomain(req);
      const models = await generateModels(subdomain);

      const { sitename, contenttype, entryid } = req.params;

      const site = await models.Sites.findOne({ name: sitename }).lean();

      if (!site) {
        return res.status(404).send('Not found');
      }

      const ct = await models.ContentTypes.findOne({
        siteId: site._id,
        code: contenttype,
      });

      if (!ct) {
        return res.status(404).send('Not found');
      }

      const page = await models.Pages.findOne({
        siteId: site._id,
        name: `${contenttype}_detail`,
      });

      if (!page) {
        return res.status(404).send('Page not found');
      }

      const entry = await models.Entries.findOne({ _id: entryid });

      if (!entry) {
        return res.status(404).send('Entry not found');
      }

      let html = await pageReplacer(models, subdomain, page, site);

      for (const evalue of entry.values) {
        const { fieldCode, value } = evalue;
        const target = `{{entry.${fieldCode}}}`;

        html = html.replace(new RegExp(target, 'g'), value);
      }

      return res.send(
        `
          ${html}
          <style>
            ${page.css}
          </style>
        `,
      );
    });

    app.get('/:sitename/page/:name', async (req, res) => {
      const subdomain = getSubdomain(req);
      const models = await generateModels(subdomain);

      const { sitename, name } = req.params;

      const site = await models.Sites.findOne({ name: sitename }).lean();

      if (!site) {
        return res.status(404).send('Not found');
      }

      const page = await models.Pages.findOne({ siteId: site._id, name });

      if (!page) {
        return res.status(404).send('Page not found');
      }

      const html = await pageReplacer(models, subdomain, page, site);

      return res.send(
        `
          ${html}
          <style>
            ${page.css}
          </style>
        `,
      );
    });

    app.get('/:sitename/get-data', async (req, res) => {
      const subdomain = getSubdomain(req);
      const models = await generateModels(subdomain);

      const { sitename } = req.params;

      const site = await models.Sites.findOne({ name: sitename }).lean();

      if (!site) {
        return res.status(404).send('Not found');
      }

      const pages = await models.Pages.find({ siteId: site._id }).lean();

      const responses = await models.ContentTypes.find({
        siteId: site._id,
      }).lean();
      const contentTypes: any[] = [];

      for (const contentType of responses) {
        contentTypes.push({
          ...contentType,
          entries: await models.Entries.find({
            contentTypeId: contentType._id,
          }).lean(),
        });
      }

      return res.json({
        pages,
        contentTypes,
      });
    });

    app.get('/demo/:templateId', async (req, res) => {
      const { templateId } = req.params;

      const url = `${HELPERS_DOMAIN}/get-webbuilder-demo-page?templateId=${templateId}`;

      const page = await fetch(url).then((res) => res.json());

      return res.send(
        `
          ${page.html}
          <style>
            ${page.css}
          </style>
        `,
      );
    });
    app.get('/xbuilder/sites/create', async (req, res) => {
      const { searchValue } = req.query;

      // 여기에서 searchValue를 이용해 데이터를 가져옵니다
      const url = `${HELPERS_DOMAIN}/get-webbuilder-templates?searchValue=${searchValue}`;
      try {
        const response = await fetch(url);
        const templates = await response.json();

        // 데이터가 유효한지 확인
        if (!Array.isArray(templates)) {
          return res.status(500).send('Invalid response from helper service');
        }

        return res.json(templates);
      } catch (error) {
        console.error('Error fetching templates:', error);
        return res.status(500).send('Error fetching templates');
      }
    });
  },
  setupMessageConsumers,
};
