export const groupBySameMasksAggregator = (isCount = false) => {
  const sameArr = [
    {
      $addFields: {
        sameMasksLen: {
          $cond: {
            if: { $isArray: '$sameMasks' },
            then: { $size: '$sameMasks' },
            else: 0
          }
        }
      }
    },
    {
      $addFields: {
        sameMasks: {
          $cond: {
            if: { $gt: ['$sameMasksLen', 0] },
            then: '$sameMasks',
            else: ['$_id']
          }
        }
      }
    },
    {
      $unwind: '$sameMasks'
    },
    {
      $addFields: {
        sameSort: {
          $cond: {
            if: { $and: [{ $isArray: '$sameDefault' }, { $in: ['$sameMasks', '$sameDefault'] }] },
            then: '1',
            else: ''
          }
        }
      }
    },
  ];

  if (isCount) {
    return [
      ...sameArr,
      {
        $group: {
          _id: { sameMasks: '$sameMasks' },
          product: { $first: '$code' }
        }
      },
      {
        $group: {
          _id: { code: '$product' }
        }
      }
    ];
  }

  return [
    ...sameArr,
    { $sort: { 'sameSort': -1 } },
    {
      $group: {
        _id: { sameMasks: '$sameMasks' },
        count: { $sum: 1 },
        product: { $first: '$$ROOT' }
      }
    }
  ];
};

export const groupByCategoryAggregator = (isCount = false) => {
  const sameArr = [
    {
      $lookup: {
        from: 'product_categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $addFields: {
        same: {
          $cond: {
            if: {
              $and: [
                { $eq: ['$category.isSimilarity', true] },
                {
                  $setIsSubset: [
                    '$category.similarities.fieldId',
                    '$customFieldsData.field'
                  ]
                }
              ]
            },
            then: '$categoryId',
            else: '$_id'
          }
        }
      }
    }
  ];

  if (isCount) {
    return [
      ...sameArr,
      {
        $group: {
          _id: { same: '$same' }
        }
      }
    ];
  }

  return [
    ...sameArr,
    {
      $group: {
        _id: { same: '$same' },
        count: { $sum: 1 },
        product: { $first: '$$ROOT' }
      }
    },
  ];
};

export const aggregatePaginator = params => {
  const { perPage = 20, page = 1 } = params;
  return [{ $skip: perPage * (page - 1) }, { $limit: perPage }];
};

export const getSimilaritiesProducts = async (models, filter, sortParams, params) => {
  const sortKey: string = Object.keys(sortParams)[0] || 'code';
  const productSort = {
    [`product.${sortKey}`]: sortParams[sortKey] || 1
  };

  const aggregates =
    params.groupedSimilarity === 'config'
      ? groupBySameMasksAggregator()
      : groupByCategoryAggregator();

  const groupedData = await models.Products.aggregate([
    { $match: filter },
    { $sort: sortParams },
    ...aggregates,
    { $sort: productSort },
    ...aggregatePaginator(params),
  ]);

  return groupedData.map(gd => ({
    ...gd.product,
    hasSimilarity: gd.count > 1
  }));
};

export const getSimilaritiesProductsCount = async (models, filter, params) => {
  const aggregates =
    params.groupedSimilarity === 'config'
      ? groupBySameMasksAggregator(true)
      : groupByCategoryAggregator(true);
  const groupedData = await models.Products.aggregate([
    { $match: filter },
    ...aggregates,
    { $group: { _id: {}, count: { $sum: 1 } } }
  ]);

  return ((groupedData || [])[0] || {}).count || 0;
};
