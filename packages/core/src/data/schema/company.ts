export const conformityQueryFields = `
  conformityMainType: String
  conformityMainTypeId: String
  conformityRelType: String
  conformityIsRelated: Boolean
  conformityIsSaved: Boolean
`;

export const types = `
  type Company @key(fields: "_id") @cacheControl(maxAge: 3) {
    createdAt: Date
    modifiedAt: Date
    avatar: String

    size: Int
    website: String
    industry: String
    plan: String
    parentCompanyId: String
    ownerId: String
    mergedIds: [String]

    names: [String]
    primaryName: String
    emails: [String]
    primaryEmail: String
    phones: [String]
    primaryPhone: String
    primaryAddress: JSON
    addresses: [JSON]

    businessType: String
    description: String
    isSubscribed: String
    links: JSON
    owner: User
    parentCompany: Company

    tagIds: [String]

    customFieldsData: JSON
    customFieldsDataByFieldCode: JSON
    trackedData: JSON

    customers: [Customer]
    getTags: [Tag]
    code: String
    location: String
    score: Float
  }

  type CompaniesListResponse {
    list: [Company],
    totalCount: Float,
  }
`;

const queryParams = `
  page: Int
  perPage: Int
  segment: String
  tag: String
  tags: [String]
  excludeTags: [String]
  tagWithRelated: Boolean
  ids: [String]
  excludeIds: Boolean
  searchValue: String
  autoCompletion: Boolean
  autoCompletionType: String
  sortField: String
  sortDirection: Int
  brand: String
  dateFilters: String
  segmentData: String
  ${conformityQueryFields}
`;

export const queries = `
  companiesMain(${queryParams}): CompaniesListResponse
  companies(${queryParams}): [Company]
  companyCounts(${queryParams}, only: String): JSON
  companyDetail(_id: String!): Company
`;

const commonFields = `
  avatar: String,

  primaryName: String,
  names: [String]

  primaryPhone: String,
  phones: [String],

  primaryEmail: String,
  emails: [String],

  primaryAddress: JSON,
  addresses: [JSON],

  size: Int,
  website: String,
  industry: String,

  parentCompanyId: String,
  email: String,
  ownerId: String,
  businessType: String,
  description: String,
  isSubscribed: String,
  links: JSON,

  tagIds: [String]
  customFieldsData: JSON
  code: String
  location: String
`;

export const mutations = `
  companiesAdd(${commonFields}): Company
  companiesEdit(_id: String!, ${commonFields}): Company
  companiesEditByField(selector: JSON, doc: JSON): Company
  companiesRemove(companyIds: [String]): [String]
  companiesMerge(companyIds: [String], companyFields: JSON) : Company
`;
