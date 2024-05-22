import AvatarUpload from "@erxes/ui/src/components/AvatarUpload";
import { RichTextEditor } from "@erxes/ui/src/components/richTextEditor/TEditor";
import FormGroup from "@erxes/ui/src/components/form/Group";
import ControlLabel from "@erxes/ui/src/components/form/Label";
import { FlexContent } from "@erxes/ui/src/layout/styles";
import { ColorPick, ColorPicker } from "@erxes/ui/src/styles/main";
import React from "react";
import Popover from "@erxes/ui/src/components/Popover";
import TwitterPicker from "react-color/lib/Twitter";
import Select, { OnChangeValue } from "react-select";
import { __ } from 'coreui/utils';

import { COLORS, FONTS } from "../../constants";
import {
  Block,
  ColorChooserTile,
  ColorPickerWrap,
  FlexRow,
  LogoWrapper,
} from "../../styles";
import { Styles } from "../../types";

type Props = {
  styles?: Styles;
  icon?: string;
  logo?: string;
  headerHtml?: string;
  footerHtml?: string;
  handleFormChange: (name: string, value: string | object) => void;
};

type Item = {
  label: string;
  name: string;
  value?: string;
};

const generateOptions = () =>
  FONTS.map((item) => ({ label: item.label, value: item.value }));

function Appearance({
  styles = {},
  handleFormChange,
  icon = "",
  logo = "",
  headerHtml = "",
  footerHtml = "",
}: Props) {
  const {
    bodyColor,
    headerColor,
    footerColor,
    helpColor,
    backgroundColor,
    activeTabColor,
    linkColor,
    linkHoverColor,
    primaryBtnColor,
    secondaryBtnColor,
    dividerColor,
    baseColor,
    baseFont,
    headingColor,
    headingFont,
  } = styles || ({} as Styles);

  const handleAvatarUploader = (name: string, url: string) => {
    handleFormChange(name, url);
  };

  function renderSelect({
    value,
    label,
    name,
  }: {
    value?: string;
    label: string;
    name: string;
  }) {
    const handleSelect = (
      option: OnChangeValue<{ label: string; value: string }, false>
    ) => {
      const currentStyles = { ...styles };

      currentStyles[name] = option?.value;

      handleFormChange("styles", currentStyles);
    };

    return (
      <FormGroup>
        <ColorChooserTile>{label}</ColorChooserTile>
        <Select
          placeholder={__('Please select a font')}
          value={generateOptions().find((o) => o.value === value)}
          options={generateOptions()}
          isClearable={true}
          onChange={handleSelect}
        />
      </FormGroup>
    );
  }

  function renderColor({ label, name, value }: Item) {
    const handleChange = (e) => {
      const currentStyles = { ...styles };

      currentStyles[name] = e.hex;

      handleFormChange("styles", currentStyles);
    };

    return (
      <FormGroup>
        <ColorChooserTile>{__(label)}</ColorChooserTile>
        <div>
          <Popover
            placement="bottom"
            trigger={
              <ColorPick>
                <ColorPicker
                  style={{ backgroundColor: value ? value : COLORS[4] }}
                />
              </ColorPick>
            }
          >
            <TwitterPicker
              width="266px"
              triangle="hide"
              color={{ hex: value || COLORS[0] }}
              onChange={handleChange}
              colors={COLORS}
            />
          </Popover>
        </div>
      </FormGroup>
    );
  }

  const renderLogos = () => {
    return (
      <Block>
        <h4>{__("Logo and favicon")}</h4>
        <LogoWrapper>
          <FlexContent>
            <FormGroup>
              <ControlLabel>{__('Main Logo')}</ControlLabel>
              <p>{__('Business portal main logo PNG')}.</p>
              <AvatarUpload
                avatar={logo}
                onAvatarUpload={(logoUrl) =>
                  handleAvatarUploader("logo", logoUrl)
                }
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>{__('Favicon')}</ControlLabel>
              <p>{__('16x16px transparent PNG')}.</p>
              <AvatarUpload
                avatar={icon}
                onAvatarUpload={(iconUrl) =>
                  handleAvatarUploader("icon", iconUrl)
                }
              />
            </FormGroup>
          </FlexContent>
        </LogoWrapper>
      </Block>
    );
  };

  const renderColors = () => {
    return (
      <Block>
        <h4>{__("Main colors")}</h4>
        <FormGroup>
          <ControlLabel>{__('Background color')}</ControlLabel>
          <FlexContent>
            <ColorPickerWrap>
              {renderColor({
                label: "Body",
                name: "bodyColor",
                value: bodyColor,
              })}
              {renderColor({
                label: "Header",
                name: "headerColor",
                value: headerColor,
              })}
              {renderColor({
                label: "Footer",
                name: "footerColor",
                value: footerColor,
              })}
              {renderColor({
                label: "Help Center",
                name: "helpColor",
                value: helpColor,
              })}
              {renderColor({
                label: "Background",
                name: "backgroundColor",
                value: backgroundColor,
              })}
              {renderColor({
                label: "Active tab",
                name: "activeTabColor",
                value: activeTabColor,
              })}
            </ColorPickerWrap>
          </FlexContent>
        </FormGroup>
      </Block>
    );
  };

  const renderFonts = () => {
    return (
      <Block>
        <h4>{__("Fonts and color")}</h4>
        <FlexRow>
          <FormGroup>
            <ControlLabel>{__('Base Font')}</ControlLabel>
            <ColorPickerWrap>
              {renderSelect({
                label: __('Base font'),
                name: 'baseFont',
                value: baseFont
              })}
              {renderColor({
                label: __('Base Color'),
                name: 'baseColor',
                value: baseColor
              })}
            </ColorPickerWrap>
          </FormGroup>

          <FormGroup>
            <ControlLabel>{__('Heading Font')}</ControlLabel>
            <ColorPickerWrap>
              {renderSelect({
                label: __('Heading font'),
                name: 'headingFont',
                value: headingFont
              })}
              {renderColor({
                label: __('Heading Color'),
                name: 'headingColor',
                value: headingColor
              })}
            </ColorPickerWrap>
          </FormGroup>

          <FormGroup>
            <ControlLabel>{__('Link color')}</ControlLabel>

            <ColorPickerWrap>
              {renderColor({
                label: __('Link text'),
                name: 'linkColor',
                value: linkColor
              })}
              {renderColor({
                label: __('Link hover text'),
                name: 'linkHoverColor',
                value: linkHoverColor
              })}
            </ColorPickerWrap>
          </FormGroup>
        </FlexRow>
      </Block>
    );
  };

  const renderFormElements = () => {
    return (
      <Block>
        <h4>{__("Form elements color")}</h4>
        <FlexContent>
          <ColorPickerWrap>
            {renderColor({
              label: __('Primary action button'),
              name: 'primaryBtnColor',
              value: primaryBtnColor
            })}
            {renderColor({
              label: __('Secondary action button'),
              name: 'secondaryBtnColor',
              value: secondaryBtnColor
            })}
            {renderColor({
              label: __('Heading divider & Input focus glow'),
              name: 'dividerColor',
              value: dividerColor
            })}
          </ColorPickerWrap>
        </FlexContent>
      </Block>
    );
  };

  const onHeaderChange = (content: string) => {
    handleFormChange("headerHtml", content);
  };

  const onFooterChange = (content: string) => {
    handleFormChange("footerHtml", content);
  };

  return (
    <>
      {renderLogos()}
      {renderColors()}
      {renderFonts()}
      {renderFormElements()}

      <Block>
        <h4>{__("Advanced")}</h4>

        <FlexContent>
          <FormGroup>
            <ControlLabel>{__('Header html')}</ControlLabel>

            <RichTextEditor
              content={headerHtml}
              onChange={onHeaderChange}
              height={200}
              name="clientportal-header"
            />
          </FormGroup>
        </FlexContent>

        <FlexContent>
          <FormGroup>
            <ControlLabel>{__('Footer html')}</ControlLabel>

            <RichTextEditor
              content={footerHtml}
              onChange={onFooterChange}
              height={200}
              name="clientportal-footer"
            />
          </FormGroup>
        </FlexContent>
      </Block>
    </>
  );
}

export default Appearance;
