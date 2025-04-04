import { IOption, IQueryParams } from '@erxes/ui/src/types';

import { IAccountCategory } from '../types';
import React from 'react';
import SelectWithSearch from '@erxes/ui/src/components/SelectWithSearch';
import { queries } from '../graphql';

// get config options for react-select
export function generateAccountOptions(
  array: IAccountCategory[] = []
): IOption[] {
  return array.map(item => {
    const category = item || ({} as IAccountCategory);

    const foundedString = category.order.match(/[/]/gi);

    let space = '';

    if (foundedString) {
      space = '\u00A0 \u00A0'.repeat(foundedString.length);
    }

    return {
      value: category._id,
      label: `${space}${category.code} - ${category.name}`
    };
  });
}

export default ({
  queryParams,
  onSelect,
  initialValue,
  multi = false,
  customOption,
  label,
  name
}: {
  queryParams?: IQueryParams;
  label: string;
  onSelect: (values: string[] | string, name: string) => void;
  multi?: boolean;
  customOption?: IOption;
  initialValue?: string | string[];
  name: string;
}) => {
  const defaultValue = queryParams ? queryParams[name] : initialValue;

  return (
    <SelectWithSearch
      showAvatar={false}
      label={label}
      queryName="accountCategories"
      name={name}
      customQuery={queries.accountCategories}
      initialValue={defaultValue}
      generateOptions={generateAccountOptions}
      onSelect={onSelect}
      multi={multi}
      customOption={customOption}
    />
  );
};
