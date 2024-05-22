import { __ } from '@erxes/ui/src/utils/core';
import LeftSidebar from '@erxes/ui/src/layout/components/Sidebar';
import { SidebarList } from '@erxes/ui/src/layout/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import { IType } from '../types';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import TypeForm from './TypeForm';
import Button from '@erxes/ui/src/components/Button';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import { Header, SidebarListItem } from '@erxes/ui-settings/src/styles';
import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import Tip from '@erxes/ui/src/components/Tip';
import Icon from '@erxes/ui/src/components/Icon';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal?: () => void;
  afterSave?: () => void;
  remove: (type: IType) => void;
  types: IType[];
  currentTypeId?: string;
};

export default function Sidebar({ queryParams, contentTypes }: Props) {
  return (
    <LeftSidebar header={<SidebarHeader />} hasBorder={true}>
      <SidebarList
        $noTextColor={true}
        $noBackground={true}
        id={'DocumentsSidebar'}
      >
        {contentTypes.map(({ label, contentType }) => (
          <SidebarListItem
            key={contentType}
            $isActive={queryParams?.contentType === contentType}
          >
            <Link to={`/settings/documents/?contentType=${contentType}`}>
              {__(label)}
            </Link>
          </SidebarListItem>
        ))}
      </SidebarList>
    </LeftSidebar>
  );
}

export default SideBar;
