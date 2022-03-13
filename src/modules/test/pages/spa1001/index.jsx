/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 15:05:14
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-13 18:08:03
 */
import React from 'react';
import classNames from 'classnames';
import { dictTool } from '@/hoc';

import { QmForm, QmTable, QmButton, QmDrawer } from '@jiaozhiye/qm-design-react';
import { PlusOutlined, DeleteOutlined } from '@/icons';

import FormEdit from './FormEdit';

import css from './index.module.less';

import {
  getTableData,
  getSummationData,
  getSelectData,
  getTreeData,
  getStreetData,
  getTableKeys,
} from '@test/api/spa1001';

@dictTool
class Spa1001 extends React.Component {
  state = {
    filters: this.createFilterList(),
    columns: this.createTableColumns(),
    fetchParams: {},
    visible: false,
    actions: {
      type: '',
      title: '',
      recordId: '',
    },
  };

  createFilterList() {
    return [
      {
        type: 'INPUT',
        label: '条件1',
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
          fetchApi: getStreetData,
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
    ];
  }

  createTableColumns() {
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
      },
      {
        title: '个人信息',
        dataIndex: 'person',
        children: [
          {
            title: '姓名',
            dataIndex: 'person.name',
            width: 100,
            sorter: true,
            filter: {
              type: 'text',
            },
          },
          {
            title: '性别',
            dataIndex: 'person.sex',
            width: 100,
            dictItems: this.props.createDictList('sex'),
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
        groupSummary: {},
        sorter: true,
        filter: {
          type: 'number',
        },
      },
      {
        title: '数量',
        dataIndex: 'num',
        width: 150,
        sorter: true,
        summation: {
          dataKey: 'num',
          unit: '个',
        },
        groupSummary: {},
        filter: {
          type: 'number',
        },
      },
      {
        title: '是否选择',
        dataIndex: 'choice',
        align: 'center',
        width: 150,
        dictItems: [
          { text: '选中', value: 1 },
          { text: '非选中', value: 0 },
        ],
      },
      {
        title: '状态',
        dataIndex: 'state',
        width: 150,
        filter: {
          type: 'radio',
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
        width: 150,
        filter: {
          type: 'checkbox',
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
      },
    ];
  }

  setFetchParams = (params) => {
    this.setState((prev) => ({ fetchParams: Object.assign({}, prev.fetchParams, params) }));
  };

  clickHandle = (type, record) => {
    const conf = {
      add: '新增',
      edit: '编辑',
      show: '查看',
    };
    this.setState({
      actions: Object.assign({}, { title: conf[type], recordId: record?.id, type }),
    });
    this.setState({ visible: true });
  };

  render() {
    const { filters, columns, fetchParams, visible, actions } = this.state;
    return (
      <>
        <QmForm
          uniqueKey="SPA1001"
          formType="search"
          items={filters}
          fieldsChange={(items) => this.setState({ filters: items })}
          onFinish={(values) => this.setFetchParams(values)}
          onCollapse={() => this.tableRef.CALCULATE_HEIGHT()}
        />
        <QmTable
          ref={(ref) => (this.tableRef = ref)}
          uniqueKey="SPA1001"
          height={'auto'}
          rowKey={(row) => row.id}
          columns={columns}
          fetch={{
            api: getTableData,
            params: fetchParams,
            dataKey: 'records',
          }}
          summation={{
            fetch: {
              api: getSummationData,
              params: fetchParams,
              dataKey: 'summation',
            },
          }}
          rowSelection={{
            type: 'checkbox',
            fetchAllRowKeys: {
              api: getTableKeys,
              dataKey: 'recordKeys',
            },
            onChange: (val, rows) => {
              // ...
            },
          }}
          exportExcel={{ fileName: '导出文件.xlsx' }}
          columnsChange={(columns) => this.setState({ columns })}
        >
          <QmButton type="primary" icon={<PlusOutlined />} onClick={() => this.clickHandle('add')}>
            新建
          </QmButton>
          <QmButton type="danger" icon={<DeleteOutlined />}>
            删除
          </QmButton>
        </QmTable>
        <QmDrawer
          ref={(ref) => (this.drawerRef = ref)}
          visible={visible}
          title={actions.title}
          bodyStyle={{ paddingBottom: 52 }}
          onClose={() => this.setState({ visible: false })}
        >
          <FormEdit
            ref={(ref) => (this.formEditRef = ref)}
            drawerRef={this.drawerRef}
            type={actions.type}
            recordId={actions.recordId}
            onClose={(reload) => {
              if (reload) {
                this.setFetchParams();
              }
              this.setState({ visible: false });
            }}
          />
        </QmDrawer>
      </>
    );
  }
}

export default Spa1001;
