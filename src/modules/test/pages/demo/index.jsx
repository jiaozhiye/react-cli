/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 15:05:14
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-04 15:10:29
 */
import React from 'react';
import classNames from 'classnames';
import { useLocale } from '@/hooks';
import { QmForm, QmTable, QmButton } from '@jiaozhiye/qm-design-react';
import css from './index.module.less';
import './lang';

import tableData from '@/mock/tableData';

import {
  getTableData,
  getTableData2,
  getSummationData,
  removeRecord,
  getSelectData,
  getTreeData,
  getRegionData,
  getTableKeys,
} from '@test/api/demo';

const Demo = (props) => {
  const tableRef = React.useRef(null);
  const { t } = useLocale();
  const createFilterList = () => {
    return [
      {
        type: 'INPUT',
        label: t('demo.label1'),
        tooltip: 'Label 描述信息',
        fieldName: 'a',
      },
      {
        type: 'SEARCH_HELPER',
        label: '条件2',
        fieldName: 'b',
        searchHelper: {
          uniqueKey: 'SPA1001_SH_01',
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
            rowKey: (record) => record.id,
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
            return { b: 'date', code: 'id', c: 'date' };
          },
          extraAliasMap: () => {
            return { b: 'date', c: 'date' };
          },
        },
        extra: {
          labelWidth: 80,
        },
      },
      {
        type: 'INPUT',
        label: '条件3',
        fieldName: 'c',
        extra: {
          labelWidth: 80,
        },
      },
      {
        type: 'SELECT',
        label: '条件4',
        fieldName: 'd',
        request: {
          fetchApi: getSelectData,
          params: {},
          dataKey: 'records',
          valueKey: 'value',
          textKey: 'text',
        },
      },
      {
        type: 'MULTIPLE_TREE_SELECT',
        label: '条件5',
        fieldName: 'e',
        request: {
          fetchApi: getTreeData,
          params: {},
          dataKey: 'records',
        },
      },
      {
        type: 'REGION_SELECT',
        label: '条件6',
        fieldName: 'f',
        request: {
          fetchApi: getSelectData,
          params: {},
          dataKey: 'records',
          valueKey: 'value',
          textKey: 'text',
        },
      },
      {
        type: 'CITY_SELECT',
        label: '条件7',
        fieldName: 'g',
      },
      {
        type: 'IMMEDIATE',
        label: '条件8',
        fieldName: 'h',
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
            return { h: 'date', c: 'date', id: 'id' };
          },
        },
      },
      {
        type: 'MULTIPLE_CASCADER',
        label: '条件9',
        fieldName: 'j',
        options: {
          itemList: [
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
          ],
        },
      },
    ];
  };
  const createTableColumns = () => {
    return [
      {
        title: '操作',
        dataIndex: '__action__', // 操作列的 dataIndex 的值不能改
        fixed: 'left',
        width: 100,
        render: (text, row) => {
          return (
            <div>
              <QmButton type="text">编辑</QmButton>
              <QmButton type="text">查看</QmButton>
            </div>
          );
        },
      },
      {
        title: '序号',
        description: '数据索引',
        dataIndex: 'pageIndex',
        printFixed: true,
        width: 80,
        render: (text) => {
          return text + 1;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'date',
        width: 220,
        sorter: true,
        filter: {
          type: 'date',
        },
        editRender: (row) => {
          return {
            type: 'datetime',
          };
        },
      },
      {
        title: '个人信息',
        dataIndex: 'person',
        children: [
          {
            title: '姓名',
            dataIndex: 'person.name',
            width: 200,
            required: true,
            sorter: true,
            filter: {
              type: 'text',
            },
            editRender: (row) => {
              const obj = {
                type: 'search-helper',
                // editable: true,
                extra: {
                  readonly: false,
                  maxlength: 10,
                  disabled: row.id === 3,
                },
                helper: {
                  filters: [
                    {
                      type: 'INPUT',
                      label: '条件1',
                      fieldName: 'a1',
                    },
                  ],
                  table: {
                    columns: [
                      {
                        title: '创建时间',
                        dataIndex: 'date',
                        filter: {
                          type: 'date',
                        },
                      },
                      {
                        title: '姓名',
                        dataIndex: 'person.name',
                      },
                    ],
                    rowKey: (record) => record.id,
                    fetch: {
                      api: getTableData,
                      params: {},
                      dataKey: 'records',
                    },
                  },
                  fieldAliasMap: () => {
                    return { 'person.name': 'date', 'person.age': 'date' };
                  },
                  filterAliasMap: () => {
                    return ['a1'];
                  },
                },
                rules: [{ required: true, message: '姓名不能为空' }],
              };
              return obj;
            },
          },
          {
            title: '性别',
            dataIndex: 'person.sex',
            width: 100,
            dictItems: [
              { text: '男', value: '1' },
              { text: '女', value: '0' },
            ],
          },
          {
            title: '年龄',
            dataIndex: 'person.age',
            width: 100,
            sorter: true,
            filter: {
              type: 'number',
            },
          },
        ],
      },
      {
        title: '价格',
        dataIndex: 'price',
        width: 150,
        precision: 2,
        required: true,
        sorter: true,
        groupSummary: {},
        filter: {
          type: 'number',
        },
        editRender: (row) => {
          return {
            type: 'number',
            extra: {
              max: 1000,
            },
            rules: [{ required: true, message: '价格不能为空' }],
          };
        },
      },
      {
        title: '数量',
        dataIndex: 'num',
        width: 150,
        required: true,
        sorter: true,
        summation: {
          dataKey: 'num',
          unit: '个',
        },
        groupSummary: {},
        filter: {
          type: 'number',
        },
        editRender: (row) => {
          return {
            type: 'number',
            extra: {
              max: 1000,
            },
            rules: [{ required: true, message: '数量不能为空' }],
          };
        },
      },
      {
        title: '总价',
        dataIndex: 'total',
        width: 150,
        precision: 2,
        align: 'right',
        sorter: true,
        groupSummary: {},
        filter: {
          type: 'number',
        },
        summation: {
          sumBySelection: true,
          unit: '元',
        },
        render: (text, row) => {
          row.total = row.price * row.num;
          return <span>{row.total.toFixed(2)}</span>;
        },
      },
      {
        title: '是否选择',
        dataIndex: 'choice',
        align: 'center',
        width: 150,
        editRender: (row) => {
          return {
            type: 'checkbox',
            editable: true,
            extra: {
              trueValue: 1,
              falseValue: 0,
              disabled: true,
            },
          };
        },
        dictItems: [
          { text: '选中', value: 1 },
          { text: '非选中', value: 0 },
        ],
      },
      {
        title: '状态',
        dataIndex: 'state',
        colSpan: 2,
        width: 150,
        filter: {
          type: 'radio',
        },
        editRender: (row) => {
          return {
            type: 'select',
          };
        },
        dictItems: [
          { text: '已完成', value: 1 },
          { text: '进行中', value: 2 },
          { text: '未完成', value: 3 },
        ],
      },
      {
        title: '业余爱好',
        dataIndex: 'hobby',
        colSpan: 0,
        width: 150,
        filter: {
          type: 'checkbox',
        },
        editRender: (row) => {
          return {
            type: 'select-multiple',
          };
        },
        dictItems: [
          { text: '篮球', value: 1 },
          { text: '足球', value: 2 },
          { text: '乒乓球', value: 3 },
          { text: '游泳', value: 4 },
        ],
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: 200,
        filter: {
          type: 'textarea',
        },
        editRender: (row) => {
          return {
            type: 'text',
          };
        },
      },
      // {
      //   title: '备注说明',
      //   dataIndex: 'remark',
      //   with: 200,
      //   sorter: true,
      //   filter: {
      //     type: 'text',
      //   },
      // },
      // {
      //   title: 'CPU利用率',
      //   dataIndex: 'cpuUsed',
      //   with: 200,
      //   sorter: true,
      //   summation: {
      //     dataKey: 'cpuUsed',
      //   },
      //   groupSummary: {},
      //   filter: {
      //     type: 'number',
      //   },
      // },
      // {
      //   title: 'MEM利用率',
      //   dataIndex: 'memUsed',
      //   with: 200,
      //   sorter: true,
      //   filter: {
      //     type: 'number',
      //   },
      //   groupSummary: {},
      //   summation: {
      //     dataKey: 'memUsed',
      //   },
      // },
      // {
      //   title: '状态',
      //   dataIndex: 'status',
      //   with: 200,
      //   sorter: true,
      //   filter: {
      //     type: 'radio',
      //   },
      //   dictItems: [
      //     { text: '已完成', value: 1 },
      //     { text: '进行中', value: 2 },
      //   ],
      // },
    ];
  };
  const [filterList, setFilterList] = React.useState(createFilterList());
  const [columns, setColumns] = React.useState(createTableColumns());
  const [fetchParams, setFetchParams] = React.useState({});

  return (
    <>
      <QmForm
        uniqueKey="SPA1001"
        formType="search"
        items={filterList}
        fieldsChange={(items) => setFilterList(items)}
        onFinish={(values) => setFetchParams(values)}
        onCollapse={() => tableRef.current.CALCULATE_HEIGHT()}
      />
      <QmTable
        ref={tableRef}
        uniqueKey="SPA1001"
        height={'auto'}
        rowKey={(row) => row.id}
        columns={columns}
        fetch={{
          api: getTableData,
          params: fetchParams,
          dataKey: 'records',
        }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: [],
          fetchAllRowKeys: {
            api: getTableKeys,
            dataKey: 'recordKeys',
          },
          onChange: (val, rows) => {
            // ...
          },
        }}
        exportExcel={{ fileName: '导出文件.xlsx' }}
        tablePrint={{}}
        columnsChange={(columns) => setColumns(columns)}
      />
    </>
  );
};

export default Demo;
