const genericFields = `
  _id
  description
  code
  order
  isVisible
  isVisibleInDetail
  contentType
  isDefinedByErxes

  logicAction
  logics {
    fieldId
    logicOperator
    logicValue
  }
`;

const commonFields = `
  type
  text
  
  canHide
  validation
  regexValidation
  options
  isVisibleToCreate
  locationOptions{
    lat
    lng
    description
  }
  objectListConfigs{
    key
    label
    type
  }
  groupId
  searchable
  showInCard
  isRequired

  ${genericFields}

  lastUpdatedUser {
    details {
      fullName
    }
  }
  logicAction
  logics {
    fieldId
    logicOperator
    logicValue
  }

  relationType
  isDisabled
`;

const commonFieldsGroups = `
  name
  ${genericFields}
  isMultiple
  alwaysOpen
  parentId
  config

  lastUpdatedUser {
    details {
      fullName
    }
  }
  fields  {
    ${commonFields}
  }
}
`;

const fieldsGetTypes = `
  query fieldsGetTypes {
    fieldsGetTypes
  }
`;

const getFieldsInputTypes = `
  query getFieldsInputTypes {
    getFieldsInputTypes
  }  
`;

const fieldsGroups = `
  query fieldsGroups($contentType: String!, $isDefinedByErxes: Boolean, $config: JSON) {
    fieldsGroups(contentType: $contentType, isDefinedByErxes: $isDefinedByErxes, config: $config) {
      ${commonFieldsGroups}
  }
`;

const getSystemFieldsGroup = `
  query getSystemFieldsGroup($contentType: String!) {
    getSystemFieldsGroup(contentType: $contentType) {
      ${commonFieldsGroups}
  }
`;

const fields = `
  query fields($contentType: String!, $contentTypeId: String, $isVisible: Boolean) {
    fields(contentType: $contentType, contentTypeId: $contentTypeId, isVisible: $isVisible) {
      _id
      type
      validation
      text
      description
      options
      isRequired
      isDefinedByErxes
      order
      associatedFieldId
      logicAction
      column
      associatedField {
        _id
        text
        contentType
      }
      logics {
        fieldId
        logicOperator
        logicValue
      }
      
      objectListConfigs{
        key
        label
        type
      }
    }
  }
`;

const inboxFields = `
  query inboxFields {
    inboxFields {
      customer { ${commonFields} }
      device { ${commonFields} }
      conversation { ${commonFields} }
    }
  }
`;

const salesCardsFields = `
  query salesCardsFields {
    salesCardsFields
  }
`;

const ticketsCardsFields = `
  query ticketsCardsFields {
    ticketsCardsFields
  }
`;

const tasksCardsFields = `
  query tasksCardsFields {
    tasksCardsFields
  }
`;

const purchasesCardsFields = `
  query purchasesCardsFields {
    purchasesCardsFields
  }
`;

const configs = `
  query configs {
    configs {
      _id
      code
      value
    }
  }
`;

const productCategories = `
  query productCategories($status: String) {
    productCategories(status: $status) {
      _id
      code
      name
    }
  }
`;

const fieldsCombinedByContentType = `
query fieldsCombinedByContentType($contentType: String!) {
  fieldsCombinedByContentType(contentType: $contentType)
}
`;

export default {
  fieldsGroups,
  fieldsGetTypes,
  getFieldsInputTypes,
  fields,
  getSystemFieldsGroup,
  inboxFields,
  salesCardsFields,
  ticketsCardsFields,
  tasksCardsFields,
  purchasesCardsFields,
  configs,
  productCategories,
  fieldsCombinedByContentType
};
