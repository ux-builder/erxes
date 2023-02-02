export const PRELIMINARY_REPORT_COLUMNS = [
  '№',
  'Ажилтаны код',
  'Овог',
  'Нэр',
  'Албан тушаал',
  'Ажиллавал зохих хоног',
  'Ажилласан хоног',
  'Тайлбар'
];
export const FINAL_REPORT_COLUMNS = [
  [
    ['Хүнтэй холбоотой мэдээлэл'],
    ['№', 'Ажилтаны код', 'Овог', 'Нэр', 'Албан тушаал']
  ],
  [['Ажиллах ёстой цаг'], ['Хоног', 'Цаг']],
  [
    ['Цалин бодох мэдээлэл'],
    [
      'Ажилласан хоног',
      'Ажилласан цаг',
      'Илүү цаг 1.5',
      'Шөнийн цаг 1.2',
      'Нийт ажилласан цаг',
      'Хоцролт тооцох'
    ]
  ],
  [
    ['Олговор олгох цаг'],
    ['Аавын 10 хоног', 'Буяны ажилтай байсан цаг', 'School police Цаг']
  ]
];

export const PIVOT_REPORT_COLUMNS = [
  [
    ['Хүнтэй холбоотой мэдээлэл'],
    ['№', 'Ажилтаны код', 'Овог', 'Нэр', 'Албан тушаал']
  ],
  [['Хугацаа'], ['Өдөр']],
  [['Төлөвлөгөө'], ['Эхлэх', 'Дуусах', 'Нийт төлөвлөсөн']],
  [
    ['Performance'],
    [
      'Device',
      'Check In',
      'Check Out',
      'Байршил',
      'Нийт ажилласан',
      'Илүү цаг',
      'Шөнийн цаг',
      'Хоцролт'
    ]
  ]
];
