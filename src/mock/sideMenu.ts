/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-06-30 22:44:24
 */
const menus = [
  {
    id: '100',
    appCode: 'dms', // 子应用 code
    caseCode: null,
    microHost: null,
    title: '业务', // 子应用名称
    icon: '', // 图标
    children: [
      {
        id: '1',
        appCode: 'dms',
        caseCode: null,
        microHost: null,
        icon: 'http://127.0.0.1:3000/menu-icon.svg',
        title: '备件管理', // 菜单名称
        children: [
          {
            id: '2',
            appCode: 'dms',
            caseCode: null,
            microHost: null,
            icon: '',
            title: '采购管理',
            children: [
              {
                id: '3',
                appCode: 'dms',
                caseCode: 'spa1001', // 用例号
                microHost: 'http://localhost:9021/', // 子应用地址
                icon: '',
                title: '备件采购订单',
              },
              {
                id: '4',
                appCode: 'dms',
                caseCode: 'spa1002?a=1',
                microHost: 'http://localhost:9021/',
                icon: '',
                title: '备件采购入库',
              },
              {
                id: '5',
                appCode: 'dms',
                caseCode: 'spa1002?a=2',
                microHost: 'http://localhost:9021/',
                icon: '',
                title: '备件采购退库',
              },
            ],
          },
        ],
      },
      {
        id: '6',
        appCode: 'dms',
        caseCode: null,
        microHost: null,
        icon: 'http://127.0.0.1:3000/menu-icon.svg',
        title: '销售管理',
        children: [
          {
            id: '7',
            appCode: 'dms',
            caseCode: null,
            microHost: null,
            icon: '',
            title: '线索管理',
            children: [
              {
                id: '8',
                appCode: 'dms',
                caseCode: 'sal1001',
                microHost: 'http://localhost:9021/',
                icon: '',
                title: '线索分配',
                caseHref: 'https://sit-mdata.faw.cn/iframe/mdata-fe/sys027',
              },
              {
                id: '9',
                appCode: 'dms',
                caseCode: 'sal1002',
                microHost: 'http://localhost:9021/',
                icon: '',
                title: '线索记录',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '200',
    appCode: 'tds',
    caseCode: null,
    microHost: null,
    title: '标准',
    icon: '',
    children: [
      {
        id: '10',
        appCode: 'tds',
        caseCode: null,
        microHost: null,
        icon: 'http://127.0.0.1:3000/menu-icon.svg',
        title: '客服管理',
        children: [
          {
            id: '11',
            appCode: 'tds',
            caseCode: null,
            microHost: null,
            icon: '',
            title: '回访管理',
            children: [
              {
                id: '12',
                appCode: 'tds',
                caseCode: 'car1001',
                microHost: 'http://localhost:9022/',
                icon: '',
                title: '销售回访',
              },
              {
                id: '13',
                appCode: 'tds',
                caseCode: 'car1002',
                microHost: 'http://localhost:9022/',
                icon: '',
                title: '回访分配',
              },
            ],
          },
        ],
      },
    ],
  },
];

const menus2 = [
  {
    id: '1',
    appCode: 'dms',
    caseCode: null,
    microHost: null,
    icon: 'http://127.0.0.1:3000/menu-icon.svg',
    title: 'bjgl', // 菜单名称
    children: [
      {
        id: '2',
        appCode: 'dms',
        caseCode: null,
        microHost: null,
        icon: '',
        title: 'cggl',
        children: [
          {
            id: '3',
            appCode: 'dms',
            caseCode: 'spa1001', // 用例号
            microHost: 'http://localhost:9021/', // 子应用地址
            icon: '',
            title: 'bjcgdd',
          },
          {
            id: '4',
            appCode: 'dms',
            caseCode: 'spa1002?a=1',
            microHost: 'http://localhost:9021/',
            icon: '',
            title: 'bjcgrk',
          },
          {
            id: '5',
            appCode: 'dms',
            caseCode: 'spa1002?a=2',
            microHost: 'http://localhost:9021/',
            icon: '',
            title: 'bjcgtk',
          },
        ],
      },
    ],
  },
  {
    id: '6',
    appCode: 'dms',
    caseCode: null,
    microHost: null,
    icon: 'http://127.0.0.1:3000/menu-icon.svg',
    title: 'xsgl',
    children: [
      {
        id: '7',
        appCode: 'dms',
        caseCode: null,
        microHost: null,
        icon: '',
        title: 'xsgl',
        children: [
          {
            id: '8',
            appCode: 'dms',
            caseCode: 'sal1001',
            microHost: 'http://localhost:9021/',
            icon: '',
            title: 'xsfp',
            caseHref: 'https://sit-mdata.faw.cn/iframe/mdata-fe/sys027',
          },
          {
            id: '9',
            appCode: 'dms',
            caseCode: 'sal1002',
            microHost: 'http://localhost:9021/',
            icon: '',
            title: 'xsjl',
          },
        ],
      },
    ],
  },
];

export default { ['zh-cn']: menus[0].children, ['en']: menus2 };
