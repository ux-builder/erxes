import { __ } from 'coreui/utils';

export const BOOKING_ITEM_SHAPE = {
  RECTANGLE: 'rectangle',
  ROUND: 'round',
  CIRCLE: 'circle',
  ALL_LIST: [
    { label: 'Rectangle', value: 'rectangle' },
    { label: 'Round', value: 'round' },
    { label: 'Circle', value: 'circle' }
  ]
};

export const BOOKING_DISPLAY_BLOCK = {
  HORIZONTALLY: 'horizontally',
  VERTICALLY: 'vertically',
  ALL_LIST: [
    { label: __('Horizontally'), value: 'horizontally' },
    { label: __('Vertically'), value: 'vertically' }
  ]
};

export const EMPTY_CONTENT_BOOKINGS = {
  title: __('Getting Started with erxes Booking'),
  description: __('widgetHelp'),
  steps: [
    {
      title: __('Prepare Product Properties'),
      description: __('widgetBased'),
      url: '/settings/properties?type=products:product',
      urlText: __('Create Custom Properties')
    },
    {
      title: __('Organize Your Products'),
      description: __('widgetPage'),
      url: '/settings/product-service',
      urlText: __('Manage Products & Services')
    }
  ]
};
