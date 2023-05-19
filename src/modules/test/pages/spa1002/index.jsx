/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 15:05:14
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-04-01 12:57:44
 */
import React from 'react';
import classNames from 'classnames';
import { confirmBeforeClose, Notification, Message } from '@/utils';
import { SizeHeight } from '@/utils/types';
import { dict, tool } from '@/hoc';

import { QmForm, QmTable, QmButton, QmDrawer, QmSplit } from '@jiaozhiye/qm-design-react';
import { PlusOutlined, DeleteOutlined } from '@/icons';

import FormEdit from './FormEdit';

import css from './index.module.less';

import {
  getTableData,
  getSelectData,
  getTreeData,
  getStreetData,
  getTableKeys,
  removeRecord,
  getSubTableData,
} from '@test/api/spa1002';

@tool
@dict
class Spa1002 extends React.Component {
  static displayName = 'Spa1002'; // 用例号 - 用于页面缓存

  state = {
    filters: this.createFilterList(), // 表单项
    columns: this.createTableColumns(), // 表格列
    fetchParams: {}, // 查询接口的参数
    tableHeight: 316, // 主表格高度
    subList: [], // 子表数据
    subColumns: this.createSubTableColumns(), // 子表格列
    subLoading: false, // 子表 loading 效果
    visible: false, // 抽屉的显隐状态
    actions: {
      type: '',
      title: '',
      recordId: '',
    },
  };

  selectedKeys = []; // 选中数据 rowKey 列表

  // 创建筛选器列表
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
          uniqueKey: 'SPA1002_SH_01',
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

  // 创建表格列
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
              <QmButton type="text" onClick={() => this.clickHandle('edit', row.id)}>
                编辑
              </QmButton>
              <QmButton type="text" onClick={() => this.clickHandle('show', row.id)}>
                查看
              </QmButton>
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
        groupSummary: {},
        filter: {
          type: 'number',
        },
      },
      {
        title: '是否选择',
        dataIndex: 'choice',
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

  // 创建子表格列
  createSubTableColumns() {
    return [
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
        groupSummary: {},
        filter: {
          type: 'number',
        },
      },
      {
        title: '是否选择',
        dataIndex: 'choice',
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

  // 执行表格查询
  fetchHandle = (params) => {
    this.setState({ fetchParams: params });
  };

  // 新增、编辑、查看 方法
  clickHandle = (type, recordId) => {
    const conf = {
      add: '新增',
      edit: '编辑',
      show: '查看',
    };
    this.setState({
      actions: Object.assign({}, { title: conf[type], recordId, type }),
    });
    this.setState({ visible: true });
  };

  // 删除表格数据
  removeHandle = async () => {
    if (!this.selectedKeys.length) {
      return Notification(`请选择数据！`, 'warning');
    }
    const res = await removeRecord({ ids: this.selectedKeys.join(',') });
    if (res.code === 200) {
      Message('删除成功', 'success');
      this.tableRef.SET_SELECTION([]);
      this.tableRef.DO_REFRESH();
    }
  };

  // 表单数据变更，关闭抽屉时的提示
  doCloseHandle = async () => {
    const allowClose = !this.formEditRef.getValueChange();
    try {
      await confirmBeforeClose(allowClose);
      this.setState({ visible: false });
    } catch (err) {
      // ..
    }
  };

  // 动态计算主表高度
  dragHandle = (value) => {
    this.setState({ tableHeight: value - (SizeHeight[this.props.size] + 10) * 2 - 6 });
  };

  // 获取子表数据
  getSubTableList = async (id) => {
    if (!id) {
      return this.setState({ subList: [] });
    }
    this.setState({ subLoading: true });
    const res = await getSubTableData({ id });
    if (res.code === 200) {
      this.setState({ subList: res.data || [] });
    }
    this.setState({ subLoading: false });
  };

  render() {
    const {
      filters,
      columns,
      tableHeight,
      fetchParams,
      subList,
      subColumns,
      subLoading,
      visible,
      actions,
    } = this.state;
    return (
      <>
        <QmForm
          uniqueKey="SPA1002"
          formType="search"
          items={filters}
          fieldsChange={(items) => this.setState({ filters: items })}
          onFinish={(values) => this.fetchHandle(values)}
          onCollapse={() => this.tableRef.CALCULATE_HEIGHT()}
        />
        <QmSplit direction="vertical" onDrag={this.dragHandle}>
          <QmSplit.Pane>
            <QmTable
              ref={(ref) => (this.tableRef = ref)}
              uniqueKey="SPA1002"
              height={tableHeight}
              rowKey={(row) => row.id}
              columns={columns}
              fetch={{
                api: getTableData,
                params: fetchParams,
                dataKey: 'records',
              }}
              rowSelection={{
                type: 'radio',
                fetchAllRowKeys: {
                  api: getTableKeys,
                  dataKey: 'recordKeys',
                },
                onChange: (val, rows) => {
                  this.selectedKeys = val;
                  this.getSubTableList(val[0]);
                },
              }}
              exportExcel={{ fileName: '导出文件.xlsx' }}
              columnsChange={(columns) => this.setState({ columns })}
            >
              <QmButton
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => this.clickHandle('add')}
              >
                新建
              </QmButton>
              <QmButton
                type="danger"
                icon={<DeleteOutlined />}
                confirm={{}}
                click={this.removeHandle}
              >
                删除
              </QmButton>
            </QmTable>
          </QmSplit.Pane>
          <QmSplit.Pane>
            <div style={{ marginBottom: 10 }}>
              <QmTable
                uniqueKey="SPA1002_sub"
                height={300}
                rowKey={(row) => row.id}
                dataSource={subList}
                columns={subColumns}
                loading={subLoading}
                showFullScreen={false}
                columnsChange={(columns) => this.setState({ subColumns: columns })}
              />
            </div>
          </QmSplit.Pane>
        </QmSplit>
        <QmDrawer
          ref={(ref) => (this.drawerRef = ref)}
          visible={visible}
          title={actions.title}
          bodyStyle={{ paddingBottom: 52 }}
          onClose={() => this.doCloseHandle()}
        >
          <FormEdit
            ref={(ref) => (this.formEditRef = ref)}
            drawerRef={this.drawerRef}
            type={actions.type}
            recordId={actions.recordId}
            onClose={(reload) => {
              reload && this.tableRef.DO_REFRESH();
              this.doCloseHandle();
            }}
          />
        </QmDrawer>
      </>
    );
  }
}

export default Spa1002;
