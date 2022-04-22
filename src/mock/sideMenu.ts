/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-04-22 16:53:12
 */
const menus = [
  {
    id: '100',
    appCode: 'dms', // 子应用 code
    caseCode: null,
    title: '业务', // 子应用名称
    icon: '', // 图标
    children: [
      {
        id: '1',
        appCode: 'dms',
        caseCode: null,
        icon: 'icon-flag-fill',
        title: '备件管理', // 菜单名称
        children: [
          {
            id: '2',
            appCode: 'dms',
            caseCode: null,
            icon: '',
            title: '采购管理',
            children: [
              {
                id: '3',
                appCode: 'dms',
                caseCode: 'spa1001', // 用例号
                icon: '',
                title: '备件采购订单',
              },
              {
                id: '4',
                appCode: 'dms',
                caseCode: 'spa1002',
                icon: '',
                title: '备件采购入库',
              },
              {
                id: '5',
                appCode: 'dms',
                caseCode: 'spa1003',
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
        icon: 'icon-flag-fill',
        title: '销售管理',
        children: [
          {
            id: '7',
            appCode: 'dms',
            caseCode: null,
            icon: '',
            title: '线索管理',
            children: [
              {
                id: '8',
                appCode: 'dms',
                caseCode: 'sal1001',
                icon: '',
                title: '线索分配',
              },
              {
                id: '9',
                appCode: 'dms',
                caseCode: 'sal1002',
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
    title: '标准',
    icon: '',
    children: [
      {
        id: '10',
        appCode: 'tds',
        caseCode: null,
        icon: 'icon-flag-fill',
        title: '客服管理',
        children: [
          {
            id: '11',
            appCode: 'tds',
            caseCode: null,
            icon: '',
            title: '回访管理',
            children: [
              {
                id: '12',
                appCode: 'tds',
                caseCode: 'car1001',
                icon: '',
                title: '销售回访',
              },
              {
                id: '13',
                appCode: 'tds',
                caseCode: 'car1002',
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

export default menus[0].children;
