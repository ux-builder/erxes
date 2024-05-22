import {
  Actions,
  IframeFullScreen,
  IframePreview,
  Template,
  TemplateBox,
  TemplateBoxInfo,
  TemplateInfo,
} from "../styles";
import { Icon, ModalTrigger } from "@erxes/ui/src";

import React from "react";
import dayjs from "dayjs";
import { __ } from 'coreui/utils';

type Props = {
  handleSelect?: (_id: string) => void;
  template: any;
  templateId: string;
  selectedTemplateId?: string;
  onlyPreview?: boolean;
};

const EmailTemplate = (props: Props) => {
  const {
    selectedTemplateId,
    template,
    handleSelect,
    templateId,
    onlyPreview,
  } = props;
  const { _id, name, createdAt, modifiedAt, createdUser, content } = template;

  renderDate(createdAt, modifiedAt) {
    const createdAtLabel = __('Created at');
    const modifiedAtLabel = __('Modified at');
    if (createdAt === modifiedAt) {
      if (createdAt === null) {
        return "-";
      }

      return `${createdAtLabel}: ${dayjs(createdAt).format('DD MMM YYYY')}`;
    }

    return `${modifiedAtLabel}: ${dayjs(modifiedAt).format('DD MMM YYYY')}`;
  }

  const renderView = (content) => {
    const trigger = (
      <div>
        <Icon icon="eye" /> {__('View')}
      </div>
    );
    const form = () => {
      return (
        <IframeFullScreen>
          <iframe title="content-iframe" srcDoc={content} />
        </IframeFullScreen>
      );
    };

    return (
      <ModalTrigger
        content={form}
        trigger={trigger}
        hideHeader={true}
        title=""
        size="lg"
      />
    );
  };

  const renderActions = () => {
    return (
      <Actions>
        {renderView(content)}
        {!onlyPreview && (
          <div onClick={handleSelect && handleSelect.bind(this, templateId)}>
            <Icon icon="clicker" /> {__('Select')}
          </div>
        )}
      </Actions>
    );
  };

  return (
    <Template key={_id} className={selectedTemplateId === _id ? "active" : ""}>
      <TemplateBox>
        {renderActions()}
        <IframePreview>
          <iframe title="content-iframe" srcDoc={content} />
        </IframePreview>
      </TemplateBox>
      <TemplateBoxInfo>
        <h5>{name}</h5>
        <div>
          <TemplateInfo>
            <p>
                {createdAt === modifiedAt
                  ? `${__('Created at')}`
                  : `${__('Modified at')}`}
            <p>{renderDate(createdAt, modifiedAt)}</p>
          </TemplateInfo>
          <TemplateInfo>
            <p>{__("Created by")}</p>
            {createdUser ? (
              createdUser.details.fullName && (
                <p>{createdUser.details.fullName}</p>
              )
            ) : (
              <p>erxes Inc</p>
            )}
          </TemplateInfo>
        </div>
      </TemplateBoxInfo>
    </Template>
  );
};

export default EmailTemplate;
