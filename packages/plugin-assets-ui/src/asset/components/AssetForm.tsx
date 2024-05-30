import {
  Button,
  Form as CommonForm,
  ControlLabel,
  FlexItem,
  FormControl,
  FormGroup,
  ModalTrigger,
  TabTitle,
  Tabs,
  Uploader,
  extractAttachment,
} from "@erxes/ui/src";
import {
  SelectWithAssetCategory,
  SelectWithAssets,
} from "../../common/utils";
import { FormColumn, ModalFooter } from "@erxes/ui/src/styles/main";
import {
  FormWrapper,
  TabContainer,
  TabContent,
  TriggerTabs,
} from "../../style";
import { IAsset, IAssetCategoryTypes } from "../../common/types";
import {
  IAttachment,
  IButtonMutateProps,
  IFormProps,
} from "@erxes/ui/src/types";
import React, { useEffect, useState } from "react";

import CategoryForm from "../containers/CategoryForm";
import { RichTextEditor } from "@erxes/ui/src/components/richTextEditor/TEditor";
import SelectCompanies from "@erxes/ui-contacts/src/companies/containers/SelectCompanies";
import { __ } from 'coreui/utils';

type Props = {
  asset?: IAsset;
  assets: IAsset[];
  categories: IAssetCategoryTypes[];
  queryParams: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  loading: boolean;
};

function AssetForm({
  asset,
  categories,
  queryParams,
  renderButton,
  closeModal,
}: Props) {
  const [assetCount, setAssetCount] = React.useState<number>(0);
  const [minimiumCount, setMinimiumCount] = React.useState<number>(0);
  const [attachment, setAttachment] = React.useState<IAttachment | undefined>(
    undefined
  );
  const [attachmentMore, setAttachmentMore] = useState<
    IAttachment[] | undefined
  >(undefined);
  const [vendorId, setVendorId] = useState<string>("");
  const [parentId, setParentId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("Category");

  useEffect(() => {
    if (asset) {
      setAssetCount(asset ? asset.assetCount : 0);
      setMinimiumCount(asset ? asset.minimiumCount : 0);
      setAttachment(asset ? asset.attachment : undefined);
      setAttachmentMore(asset ? asset.attachmentMore : undefined);
      setVendorId(asset ? asset.vendorId! : "");
      setParentId(asset ? asset.parentId : "");
      setCategoryId(asset ? asset.categoryId : "");
      setDescription(asset ? asset.description : "");
      setCurrentTab(asset ? (asset.parentId ? "Parent" : "Category") : "");
    }
  }, []);

  const generateDoc = (values: {
    _id?: string;
    assetCount: number;
    minimiumCount: number;
    vendorId: string;
    description: string;
  }) => {
    const finalValues = values;

    if (asset) {
      finalValues._id = asset._id;
    }

    return {
      ...finalValues,
      attachment,
      attachmentMore,
      assetCount,
      minimiumCount,
      vendorId,
      description,
      parentId,
      categoryId,
    };
  };

  const renderFormTrigger = (trigger: React.ReactNode) => {
    const content = (props) => (
      <CategoryForm {...props} categories={categories} />
    );

    return (
      <ModalTrigger
        title="Add Asset Category"
        trigger={trigger}
        content={content}
      />
    );
  };

  const onChangeDescription = (content: string) => {
    setDescription(content);
  };

  const onComboEvent = (variable: string, e) => {
    setVendorId(e);
  };

  const onChangeAttachment = (files: IAttachment[]) => {
    setAttachment(files.length ? files[0] : undefined);
  };

  const onChangeAttachmentMore = (files: IAttachment[]) => {
    setAttachmentMore(files);
  };

  const onChangeCurrentTab = (selecteTab) => {
    switch (selecteTab) {
      case "Parent":
        setCategoryId("");
        setCurrentTab(selecteTab);
        break;
      case "Category":
        setParentId("");
        setCurrentTab(selecteTab);
        break;
    }
  };

  const renderContent = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;

    const object = asset || ({} as IAsset);

    const attachments =
      (object.attachment && extractAttachment([object.attachment])) || [];

    const attachmentsMore =
      (object.attachmentMore && extractAttachment(object.attachmentMore)) || [];

    const addCategoryTrigger = (
      <Button btnStyle="primary" uppercase={false} icon="plus-circle">
        Add category
      </Button>
    );

    const currentTabItem = () => {
      const handleSelect = (value, name) => {
        switch (name) {
          case "parentId":
            setParentId(value);
            break;
          case "categoryId":
            setCategoryId(value);
            break;
        }
      };

      if (currentTab === "Parent") {
        return (
          <FormGroup>
            <ControlLabel required={true}>Parent</ControlLabel>
            <SelectWithAssets
              label="Choose Asset"
              name="parentId"
              multi={false}
              initialValue={object.parentId}
              onSelect={handleSelect}
              customOption={{ value: "", label: "Choose Asset" }}
            />
          </FormGroup>
        );
      }

      const categoryDefaultValue = () => {
        if (object?.categoryId) {
          return object.categoryId;
        }
        if (queryParams?.categoryId) {
          return queryParams.categoryId;
        }
        return undefined;
      };

      return (
        <FormGroup>
          <ControlLabel required={true}>{__('Category')}</ControlLabel>
          <FormWrapper>
            <SelectWithAssetCategory
              label={__('Choose Asset Category')}
              name="categoryId"
              multi={false}
              initialValue={categoryDefaultValue()}
              onSelect={handleSelect}
              customOption={{ value: '', label: __('Choose Asset Category') }}
            />
            {renderFormTrigger(addCategoryTrigger)}
          </FormWrapper>
        </FormGroup>
      );
    };

    return (
      <>
        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel required={true}>{__('Name')}</ControlLabel>
              <FormControl
                {...formProps}
                name="name"
                defaultValue={object.name}
                autoFocus={true}
                required={true}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel required={true}>{__('Code')}</ControlLabel>
              <p>
                {__(
                  "Depending on your business type, you may type in a barcode or any other UPC (Universal Asset Code). If you don't use UPC, type in any numeric value to differentiate your assets."
                )}
              </p>
              <FormControl
                {...formProps}
                name="code"
                defaultValue={object.code}
                required={true}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel>{__('Vendor')}</ControlLabel>
              <SelectCompanies
                label={__('Choose an vendor')}
                name="vendorId"
                customOption={{ value: '', label: __('No vendor chosen') }}
                initialValue={object.vendorId}
                onSelect={onComboEvent.bind(this, "vendorId")}
                multi={false}
              />
            </FormGroup>

            <FormGroup>
              <div>
                <ControlLabel required={true}>{__('Unit price')}</ControlLabel>
                <p>
                  {__('Please ensure you have set the default currency in the')}{' '}
                  <a href="/settings/general"> {'General Settings'}</a>{' '}
                  {__('of the System Configuration.')}
                </p>
              </div>
              <FormControl
                {...formProps}
                type="number"
                name="unitPrice"
                defaultValue={object.unitPrice}
                min={0}
              />
            </FormGroup>
          </FormColumn>
        </FormWrapper>

        <TabContainer>
          <TriggerTabs>
            <Tabs full={true}>
              {["Category", "Parent"].map((item) => (
                <TabTitle
                  className={currentTab === item ? "active" : ""}
                  key={item}
                  onClick={onChangeCurrentTab.bind(this, item)}
                >
                  {item}
                </TabTitle>
              ))}
            </Tabs>
          </TriggerTabs>
          <TabContent>{currentTabItem()}</TabContent>
        </TabContainer>

        <FormGroup>
          <ControlLabel>{__('Description')}</ControlLabel>
          <FlexItem>
            <RichTextEditor
              content={description}
              onChange={onChangeDescription}
              height={150}
              isSubmitted={formProps.isSaved}
              name={`asset_description_${description}`}
              toolbar={[
                "bold",
                "italic",
                "orderedList",
                "bulletList",
                "link",
                "unlink",
                "|",
                "image",
              ]}
            />
          </FlexItem>
        </FormGroup>

        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel>{__('Featured image')}</ControlLabel>

              <Uploader
                defaultFileList={attachments}
                onChange={onChangeAttachment}
                multiple={false}
                single={true}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel>{__('Secondary Images')}</ControlLabel>

              <Uploader
                defaultFileList={attachmentsMore}
                onChange={onChangeAttachmentMore}
                multiple={true}
                single={false}
              />
            </FormGroup>
          </FormColumn>
        </FormWrapper>

        <ModalFooter>
          <Button
            btnStyle="simple"
            onClick={closeModal}
            icon="times-circle"
            uppercase={false}
          >
            {__('Close')}
          </Button>

          {renderButton({
            text: "asset and movements",
            values: generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: asset,
          })}
        </ModalFooter>
      </>
    );
  };

  return <CommonForm renderContent={renderContent} />;
}

export default AssetForm;
