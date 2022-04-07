/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 15:05:14
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-04-07 21:21:38
 */
import React from 'react';

import { QmForm, QmButton } from '@jiaozhiye/qm-design-react';

import {
  getTableData,
  getSummationData,
  removeRecord,
  getSelectData,
  getTreeData,
  getRegionData,
} from '@test/api/demo';

const CASCADER_DATE = [
  {
    text: '浙江省',
    value: '330000',
    children: [
      {
        text: '杭州市',
        value: '330100',
        children: [
          { text: '清河区', value: '330201' },
          { text: '银河区', value: '330202' },
        ],
      },
    ],
  },
  {
    text: '江苏省',
    value: '320000',
    children: [
      {
        text: '苏州市',
        value: '320101',
        children: [
          { text: '沧浪区', value: '320502' },
          { text: '和平区', value: '330203' },
        ],
      },
    ],
  },
];

const FormDemo = (props) => {
  const createFormList = () => {
    return [
      {
        type: 'DIVIDER',
        fieldName: '_d1',
        label: '分隔符标题',
        collapse: {
          defaultExpand: true,
          showLimit: 20,
          remarkItems: [
            { fieldName: 'v', showLabel: true },
            { fieldName: 'w', showLabel: true },
          ],
        },
      },
      {
        type: 'INPUT',
        label: '输入框',
        tooltip: 'Label 描述信息',
        fieldName: 'a',
        extra: {
          labelWidth: 80,
        },
      },
      {
        type: 'RANGE_INPUT',
        label: '输入框区间',
        fieldName: 'b|b1',
      },
      {
        type: 'SEARCH_HELPER',
        label: '搜索帮助',
        fieldName: 'c',
        searchHelper: {
          filters: [
            {
              type: 'INPUT',
              label: '条件1',
              fieldName: 'a1',
            },
            {
              type: 'INPUT',
              label: '条件2',
              fieldName: 'a2',
            },
            {
              type: 'INPUT',
              label: '条件3',
              fieldName: 'a3',
            },
            {
              type: 'INPUT',
              label: '条件4',
              fieldName: 'a4',
            },
          ],
          table: {
            columns: [
              {
                title: '创建时间',
                dataIndex: 'date',
              },
              {
                title: '姓名',
                dataIndex: 'person.name',
              },
            ],
            fetch: {
              api: getTableData,
              params: {},
              dataKey: 'records',
            },
          },
          filterAliasMap: () => {
            return ['a1'];
          },
          fieldAliasMap: () => {
            return { c: 'date', code: 'id', a: 'date' };
          },
          extraAliasMap: () => {
            return { a: 'date', c: 'date' };
          },
        },
        extra: {
          labelWidth: 80,
        },
      },
      {
        type: 'MULTIPLE_SEARCH_HELPER',
        label: '多选搜索帮助',
        fieldName: 'd',
        searchHelper: {
          filters: [
            {
              type: 'INPUT',
              label: '条件1',
              fieldName: 'a1',
            },
            {
              type: 'INPUT',
              label: '条件2',
              fieldName: 'a2',
            },
          ],
          table: {
            columns: [
              {
                title: '创建时间',
                dataIndex: 'date',
              },
              {
                title: '姓名',
                dataIndex: 'person.name',
              },
            ],
            fetch: {
              api: getTableData,
              params: {},
              dataKey: 'records',
            },
          },
          fieldAliasMap: () => {
            return { valueKey: 'id', textKey: 'date' };
          },
        },
      },
      {
        type: 'TREE_TABLE_HELPER',
        label: '左树右表',
        fieldName: 'd1',
        searchHelper: {
          filters: [
            {
              type: 'INPUT',
              label: '条件1',
              fieldName: 'a1',
            },
            {
              type: 'INPUT',
              label: '条件2',
              fieldName: 'a2',
            },
          ],
          table: {
            columns: [
              {
                title: '创建时间',
                dataIndex: 'date',
              },
              {
                title: '姓名',
                dataIndex: 'person.name',
              },
            ],
            fetch: {
              api: getTableData,
              params: {},
              dataKey: 'records',
            },
          },
          tree: {
            tableParamsMap: () => {
              return { a1: 'text', a2: 'value' };
            },
            fetch: {
              api: getTreeData,
              params: {},
              dataKey: 'records',
              valueKey: 'value',
              textKey: 'text',
            },
          },
          fieldAliasMap: () => {
            return { d1: 'date', d1code: 'id' };
          },
        },
      },
      {
        type: 'MULTIPLE_TREE_TABLE_HELPER',
        label: '左树右表多选',
        fieldName: 'd2',
        searchHelper: {
          filters: [
            {
              type: 'INPUT',
              label: '条件1',
              fieldName: 'a1',
            },
            {
              type: 'INPUT',
              label: '条件2',
              fieldName: 'a2',
            },
          ],
          table: {
            columns: [
              {
                title: '创建时间',
                dataIndex: 'date',
              },
              {
                title: '姓名',
                dataIndex: 'person.name',
              },
            ],
            fetch: {
              api: getTableData,
              params: {},
              dataKey: 'records',
            },
          },
          tree: {
            tableParamsMap: () => {
              return { a1: 'text', a2: 'value' };
            },
            fetch: {
              api: getTreeData,
              params: {},
              dataKey: 'records',
              valueKey: 'value',
              textKey: 'text',
            },
          },
          fieldAliasMap: () => {
            return { valueKey: 'date', textKey: 'date' };
          },
        },
      },
      {
        type: 'IMMEDIATE',
        label: '及时反馈',
        fieldName: 'qwe',
        request: {
          fetchApi: getTableData,
          params: {
            currentPage: 1,
            pageSize: 10,
          },
          dataKey: 'records',
        },
        options: {
          columns: [
            { dataIndex: 'person.name', title: '姓名' },
            { dataIndex: 'price', title: '价格' },
          ],
          fieldAliasMap: () => {
            return { qwe: 'date', id: 'id' };
          },
        },
      },
      {
        type: 'INPUT_NUMBER',
        label: '数值输入框',
        fieldName: 'e',
        options: {
          formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
        },
      },
      {
        type: 'RANGE_INPUT_NUMBER',
        label: '数值区间',
        fieldName: 'f|f1',
      },
      {
        type: 'SELECT',
        label: '下拉框',
        fieldName: 'g',
        request: {
          fetchApi: getSelectData,
          params: {},
          dataKey: 'records',
          valueKey: 'value',
          textKey: 'text',
        },
      },
      {
        type: 'MULTIPLE_SELECT',
        label: '多选下拉框',
        fieldName: 'h',
        request: {
          fetchApi: getSelectData,
          params: {},
          dataKey: 'records',
          valueKey: 'value',
          textKey: 'text',
        },
      },
      {
        type: 'TREE_SELECT',
        label: '下拉树',
        fieldName: 'i',
        request: {
          fetchApi: getTreeData,
          params: {},
          dataKey: 'records',
        },
      },
      {
        type: 'MULTIPLE_TREE_SELECT',
        label: '多选下拉树',
        fieldName: 'j',
        request: {
          fetchApi: getTreeData,
          params: {},
          dataKey: 'records',
        },
      },
      {
        type: 'CASCADER',
        label: '级联选择',
        fieldName: 'k',
        options: {
          itemList: CASCADER_DATE,
        },
      },
      {
        type: 'MULTIPLE_CASCADER',
        label: '多选级联选择',
        fieldName: 'l',
        options: {
          itemList: CASCADER_DATE,
        },
      },
      {
        type: 'CITY_SELECT',
        label: '城市选择',
        fieldName: 'm',
      },
      {
        type: 'REGION_SELECT',
        label: '省市区县',
        fieldName: 'n',
        request: {
          fetchApi: getSelectData,
          params: {},
          dataKey: 'records',
          valueKey: 'value',
          textKey: 'text',
        },
      },
      {
        type: 'DATE',
        label: '日期选择',
        fieldName: 'o',
      },
      {
        type: 'RANGE_DATE',
        label: '日期选择区间',
        fieldName: 'q|q1',
      },
      {
        type: 'TIME',
        label: '时间选择',
        fieldName: 'r',
      },
      {
        type: 'RANGE_TIME',
        label: '时间选择区间',
        fieldName: 's|s1',
      },
      {
        type: 'RADIO',
        label: '单选按钮',
        fieldName: 't',
        options: {
          itemList: [
            { value: '0', text: '选项1' },
            { value: '1', text: '选项2' },
          ],
        },
      },
      {
        type: 'SWITCH',
        fieldName: 'asd',
        label: 'swich切换',
        options: {
          trueValue: '1',
          falseValue: '0',
        },
      },
      {
        type: 'CHECKBOX',
        fieldName: 'u',
        label: '复选框',
        options: {
          trueValue: '1',
          falseValue: '0',
        },
      },
      {
        type: 'MULTIPLE_CHECKBOX',
        fieldName: 'v',
        label: '复选框组',
        options: {
          itemList: [
            { value: '0', text: '选项1' },
            { value: '1', text: '选项2' },
          ],
        },
      },
      {
        type: 'TEXT_AREA',
        fieldName: 'w',
        label: '文本域',
      },
      {
        type: 'UPLOAD_FILE',
        fieldName: 'x',
        label: '附件上传',
        options: {
          maxCount: 2,
        },
        upload: {
          action: 'http://127.0.0.1:3000/api/design/upload',
          dataKey: '',
        },
      },
      {
        type: 'UPLOAD_IMG',
        fieldName: 'y',
        label: '图片上传',
        options: {
          maxCount: 2,
        },
        upload: {
          action: 'http://127.0.0.1:3000/api/design/upload',
          dataKey: '',
        },
      },
      {
        type: 'TINYMCE',
        fieldName: 'z',
        label: '富文本编辑器',
      },
    ];
  };

  const [formList, setFormList] = React.useState(createFormList());

  return (
    <>
      <QmForm items={formList} labelWidth={90} />
    </>
  );
};

export default FormDemo;
