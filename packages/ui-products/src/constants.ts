import { __ } from 'coreui/utils';
export const TYPES = {
  PRODUCT: 'product',
  SERVICE: 'service',
  UNIQUE: 'unique',
  ALL: ['product', 'service', 'unique']
};

export const PRODUCT_CATEGORY_STATUSES = [
  { label: __('Active'), value: 'active' },
  { label: __('Disabled'), value: 'disabled' },
  { label: __('Archived'), value: 'archived' }
];

export const PRODUCT_INFO = {
  code: 'Code',
  name: 'Name',
  shortName: 'Short name',
  type: 'Type',
  category: 'Category',
  vendor: 'Vendor',
  description: 'Description',
  barcodes: 'Barcodes',
  barcodeDescription: 'Barcode description',
  unitPrice: 'Unit price',
  tags: 'Tags',
  status: 'Status',
  uom: 'Unit of measurement',
  subUoms: 'Sub unit of measurements',
  taxType: 'Tax type',
  taxCode: 'Tax code',

  ALL: [
    { field: 'code', label: 'Code' },
    { field: 'name', label: 'Name' },
    { field: 'shortName', label: 'Short name' },
    { field: 'type', label: 'Type' },
    { field: 'category', label: 'Category' },
    { field: 'vendor', label: 'Vendor' },
    { field: 'description', label: 'Description' },
    { field: 'barcodes', label: 'Barcodes' },
    { field: 'barcodeDescription', label: 'Barcode description' },
    { field: 'unitPrice', label: 'Unit price' },
    { field: 'tags', label: 'Tags' },
    { field: 'status', label: 'Status' },
    { field: 'uom', label: 'Unit of measurement' },
    { field: 'subUoms', label: 'Sub unit of measurements' },
    { field: 'taxType', label: 'Tax type' },
    { field: 'taxCode', label: 'Tax code' }
  ]
};

export const TAX_TYPES = {
  2: {
    label: __('Free'),
    options: [
      {
        value: '301',
        label: __('301')
      },
      {
        value: '302',
        label: __('302')
      },
      {
        value: '304',
        label: __('304')
      },
      {
        value: '305',
        label: __('305')
      },
      {
        value: '306',
        label: __('306')
      },
      {
        value: '307',
        label: __('307')
      },
      {
        value: '308',
        label: __('308')
      },
      {
        value: '310',
        label: __('310')
      },
      {
        value: '311',
        label: __('311')
      },
      {
        value: '312',
        label: __('312')
      },
      {
        value: '313',
        label: __('313')
      },
      {
        value: '315',
        label: __('315')
      },
      {
        value: '421',
        label: __('421')
      },
      {
        value: '407',
        label: __('407')
      },
      {
        value: '318',
        label: __('318')
      },
      {
        value: '319',
        label: __('319')
      },
      {
        value: '320',
        label: __('320')
      },
      {
        value: '419',
        label: __('419')
      },
      {
        value: '423',
        label: __('423')
      },
      {
        value: '424',
        label: __('424')
      },
      {
        value: '425',
        label: __('425')
      },
      {
        value: '426',
        label: __('426')
      },
      {
        value: '303',
        label: __('303')
      },
      {
        value: '427',
        label: __('427')
      },
      {
        value: '309',
        label: __('309')
      },
      {
        value: '428',
        label: __('428')
      },
      {
        value: '429',
        label: __('429')
      },
      {
        value: '401',
        label: __('401')
      },
      {
        value: '402',
        label: __('402')
      },
      {
        value: '403',
        label: __('403')
      },
      {
        value: '404',
        label: __('404')
      },
      {
        value: '405',
        label: __('405')
      },
      {
        value: '406',
        label: __('406')
      },
      {
        value: '407',
        label: __('407')
      },
      {
        value: '408',
        label: __('408')
      },
      {
        value: '409',
        label: __('409')
      },
      {
        value: '410',
        label: __('410')
      },
      {
        value: '411',
        label: __('411')
      },
      {
        value: '412',
        label: __('412')
      },
      {
        value: '413',
        label: __('413')
      },
      {
        value: '414',
        label: __('414')
      },
      {
        value: '430',
        label: __('430')
      },
      {
        value: '431',
        label: __('431')
      },
      {
        value: '432',
        label: __('432')
      }
    ]
  },
  3: {
    label: __('0 percent'),
    options: [
      {
        value: '501',
        label: __(
          '501 - Монгол Улсын нутаг дэвсгэрээс экспортод гаргасан, гаалийн байгууллагад мэдүүлсэн бараа'
        )
      },
      {
        value: '502',
        label: __(
          '502 - Монгол Улсын Олон улсын гэрээнд заасны дагуу Монгол Улсаас гадаад улсад, гадаад улсаас Монгол Улс хүртэл, түүнчлэн гадаад улсаас Монгол Улсын хилээр дамжуулан бусад улсад гаргасан олон улсын зорчигч болон ачаа тээврийн үйлчилгээ'
        )
      },
      {
        value: '503',
        label: __(
          '503 - Монгол Улсын нутаг дэвсгэрээс гадна үзүүлсэн /албан татвараас чөлөөлсөн үйлчилгээг оролцуулан/ үйлчилгээ'
        )
      },
      {
        value: '504',
        label: __(
          '504 - Монгол Улсад оршин суугч бус этгээдэд үзүүлсэн үйлчилгээ /түүний дотор албан татвараас чөлөөлсөн үйлчилгээг оролцуулан/'
        )
      },
      {
        value: '505',
        label: __(
          '505 - олон улсын нислэг үйлдэж байгаа дотоодын болон гадаадын агаарын тээврийн хөлөгт үзүүлэх нислэгийн хөдөлгөөний удирдлага, техникийн болон шатахууны үйлчилгээ, цэвэрлэгээ, нислэгийн явцад нисэх бүрэлдэхүүн, болон зорчигчдод худалдаа, хоол, ундаагаар үйлчилсэн үйлчилгээ'
        )
      },
      {
        value: '506',
        label: __(
          '506 - Засгийн газар, Монголбанкны захиалгаар дотоодод үйлдвэрлэсэн төрийн одон медаль, мөнгөн тэмдэгт, зоос'
        )
      },
      {
        value: '507',
        label: __('507 - ашигт малтмалын эцсийн бүтээгдэхүүн')
      }
    ]
  },
  5: {
    label: __('Inner'),
    options: []
  }
};
