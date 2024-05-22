import { ColorPick, ColorPicker } from "@erxes/ui/src/styles/main";
import Select from "react-select";
import { SubHeading, WidgetBackgrounds } from "@erxes/ui-settings/src/styles";

import { BOOKING_ITEM_SHAPE } from "../../constants";
import { COLORS } from "@erxes/ui/src/constants/colors";
import ControlLabel from "@erxes/ui/src/components/form/Label";
import { FONTS } from "@erxes/ui-settings/src/constants";
import { Flex } from "@erxes/ui/src/styles/main";
import { FlexItem } from "@erxes/ui/src/layout/styles";
import { FlexHeight as FlexItemContainer } from "@erxes/ui/src/styles/main";
import FormGroup from "@erxes/ui/src/components/form/Group";
import { LeftItem } from "@erxes/ui/src/components/step/styles";
import Popover from "@erxes/ui/src/components/Popover";
import React from "react";
import TwitterPicker from "react-color/lib/Twitter";
import { __ } from 'coreui/utils';

type Name = "itemShape" | "widgetColor" | "productAvailable" | "baseFont";

type Props = {
  onChangeBooking: (name: Name, value: any) => void;
  itemShape: string;
  widgetColor: string;
  productAvailable: string;
  baseFont: string;
};

function Style({
  onChangeBooking,
  itemShape,
  widgetColor,
  productAvailable,
  baseFont,
}: Props) {
  const renderColorSelect = (item, color) => {
    return (
      <Popover
        trigger={
          <ColorPick>
            <ColorPicker style={{ backgroundColor: color }} />
          </ColorPick>
        }
        placement="bottom-start"
      >
        <TwitterPicker
          width="266px"
          triangle="hide"
          color={color}
          onChange={(e) => onChangeBooking(item, e.hex)}
          colors={COLORS}
        />
      </Popover>
    );
  };

  const itemOptions = BOOKING_ITEM_SHAPE.ALL_LIST.map((e) => ({
    value: e.value,
    label: e.label,
  }));

  const fontOptions = FONTS.map((item) => ({
    label: item.label,
    value: item.value,
  }));

  return (
    <FlexItemContainer>
      <LeftItem>
        <Flex>
          <FlexItem>
            <FormGroup>
              <ControlLabel required={true}>{__('Item Shape')}</ControlLabel>
              <Select
                isClearable={false}
                value={itemOptions.find((option) => option.value === itemShape)}
                onChange={(e: any) => onChangeBooking("itemShape", e.value)}
                options={itemOptions}
              />
            </FormGroup>
          </FlexItem>
        </Flex>

        <Flex>
          <FlexItem>
            <FormGroup>
              <ControlLabel>{__('Base Font')}</ControlLabel>
              <Select
                placeholder={__('Please select a font')}
                value={fontOptions.find((option) => option.value === baseFont)}
                options={fontOptions}
                isClearable={true}
                onChange={(e: any) =>
                  onChangeBooking("baseFont", e ? e.value : null)
                }
              />
            </FormGroup>
          </FlexItem>
        </Flex>

        <SubHeading>
          {__('Colors')}
          <span>{__('Choose a widget main and navigation colors')}</span>
        </SubHeading>

        <Flex>
          <FlexItem>
            <FormGroup>
              <ControlLabel>{__('Main Widget Color')}</ControlLabel>
              <WidgetBackgrounds>
                {renderColorSelect("widgetColor", widgetColor)}
              </WidgetBackgrounds>
            </FormGroup>
          </FlexItem>

          <FlexItem>
            <ControlLabel>{__('Available Product Color')}</ControlLabel>
            <WidgetBackgrounds>
              {renderColorSelect("productAvailable", productAvailable)}
            </WidgetBackgrounds>
          </FlexItem>
        </Flex>
      </LeftItem>
    </FlexItemContainer>
  );
}

export default Style;
