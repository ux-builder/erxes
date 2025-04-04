import * as _ from "underscore";
import { fetchByQuery } from "@erxes/api-utils/src/elasticsearch";
import { getEsIndexByContentType } from "@erxes/api-utils/src/segments";

export default {
  dependentServices: [{ name: "contacts", twoWay: true }],

  contentTypes: [
    {
      type: "messages",
      description: "Whatsapp Messages",
      esIndex: "conversation_messages_facebooks"
    }
  ],

  esTypesMap: async () => {
    return { data: { typesMap: {} }, status: "success" };
  },

  associationFilter: async ({
    subdomain,
    data: { mainType, propertyType, positiveQuery, negativeQuery }
  }) => {
    let ids: string[] = [];

    if (mainType.includes("contacts")) {
      ids = await fetchByQuery({
        subdomain,
        index: "conversations",
        _source: "customerId",
        positiveQuery,
        negativeQuery
      });
    }

    if (propertyType.includes("contacts")) {
      const customerIds = await fetchByQuery({
        subdomain,
        index: await getEsIndexByContentType(propertyType),
        positiveQuery,
        negativeQuery
      });

      ids = await fetchByQuery({
        subdomain,
        index: "conversations",
        _source: "_id",
        positiveQuery: {
          terms: {
            customerId: customerIds
          }
        },
        negativeQuery: undefined
      });
    }

    ids = _.uniq(ids);

    return { data: ids, status: "success" };
  }
};
