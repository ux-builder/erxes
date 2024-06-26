import { escapeRegExp, paginate } from '@erxes/api-utils/src/core';
import { IContext } from '../../../connectionResolver';

interface IParam {
  categoryId: string;
  searchValue?: string;
  types?: string[];
  ids: string[];
  excludeIds: boolean;
}

const generateFilter = (params: IParam, commonQuerySelector) => {
  const { categoryId, searchValue, ids, excludeIds, types } = params;
  const selector: any = { ...commonQuerySelector };

  if (categoryId) {
    selector.categoryId = categoryId;
  }

  if (searchValue) {
    const fields = [
      {
        name: { $in: [new RegExp(`.*${escapeRegExp(searchValue)}.*`, 'i')] }
      },
      {
        code: { $in: [new RegExp(`.*${escapeRegExp(searchValue)}.*`, 'i')] }
      }
    ];

    selector.$or = fields;
  }

  if (types) {
    selector.type = { $in: types };
  }

  if (ids && ids.length > 0) {
    selector._id = { [excludeIds ? '$nin' : '$in']: ids };
  }

  return selector;
};

const jobReferQueries = {
  async jobRefers(
    _root,
    params: IParam & {
      page: number;
      perPage: number;
    },
    { models, commonQuerySelector }: IContext
  ) {
    const selector = generateFilter(params, commonQuerySelector);

    return paginate(
      models.JobRefers.find(selector)
        .sort({
          code: 1
        })
        .lean(),
      { ...params }
    );
  },

  async jobReferTotalCount(
    _root,
    params: IParam,
    { commonQuerySelector, models }: IContext
  ) {
    const selector = generateFilter(params, commonQuerySelector);

    return models.JobRefers.find(selector).countDocuments();
  },

  /**
   * Get one jobRefer
   */
  async jobReferDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.JobRefers.findOne({ _id }).lean();
  }
};

// requireLogin(jobReferQueries, 'jobReferDetail');
// checkPermission(jobReferQueries, 'jobReferDetail', 'showJobs');

export default jobReferQueries;
