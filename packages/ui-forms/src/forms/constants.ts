import { __ } from 'coreui/utils';

const stringTypeChoices = [
  { value: '', label: '' },
  { value: 'is', label: __('is') },
  { value: 'isNot', label: __('is not') },
  { value: 'startsWith', label: __('starts with') },
  { value: 'endsWith', label: __('ends with') },
  { value: 'contains', label: __('contains') },
  { value: 'doesNotContain', label: __('does not contain') },
  { value: 'isUnknown', label: __('is unknown') },
  { value: 'hasAnyValue', label: __('has any value') }
];

const numberTypeChoices = [
  { value: '', label: '' },
  { value: 'greaterThan', label: __('greater than') },
  { value: 'lessThan', label: __('less than') },
  { value: 'is', label: __('equal') },
  { value: 'isNot', label: __('not equal') },
  { value: 'isUnknown', label: __('is unknown') },
  { value: 'hasAnyValue', label: __('has any value') }
];

const dateTypeChoices = [
  { value: '', label: '' },
  { value: 'dateGreaterThan', label: __('Greater than') },
  { value: 'dateLessThan', label: __('Less than') }
];

export { numberTypeChoices, stringTypeChoices, dateTypeChoices };
