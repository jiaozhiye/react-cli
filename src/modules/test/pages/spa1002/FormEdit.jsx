/*
 * @Author: 焦质晔
 * @Date: 2022-03-13 17:06:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-14 21:03:48
 */
import React from 'react';
import classNames from 'classnames';
import { dictTool } from '@/hoc';
import { Message, createUidKey } from '@/utils';
import { getRecordById, getTableData, addRecord, saveRecord } from '@test/api/spa1002';

import { QmForm, QmTable, QmButton, QmAnchor, QmSpace } from '@jiaozhiye/qm-design-react';
import { PlusOutlined } from '@/icons';

import css from './index.module.less';

@dictTool
class FormEdit extends React.Component {
  state = {
    formList: this.createFormList(),
    columns: this.createTableColumns(),
    tableList: [], // 表格数据
  };

  // 仅用于保存编辑后的表格数据
  tableListTemp = [];

  componentDidMount() {
    if (this.props.type !== 'add') {
      this.setFormInitValue();
    }
  }

  createFormList() {
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
            return { b: 'date', code: 'id' };
          },
        },
      },
      {
        type: 'INPUT_NUMBER',
        label: '条件2',
        fieldName: 'c',
        options: {
          formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
        },
      },
      {
        type: 'DATE',
        label: '条件2',
        fieldName: 'd',
      },
      {
        type: 'RANGE_DATE',
        label: '条件4',
        fieldName: 'e1|e2',
      },
      {
        type: 'CITY_SELECT',
        label: '条件5',
        fieldName: 'f',
      },
    ];
  }

  createTableColumns() {
    return [
      {
        title: '操作',
        dataIndex: '__action__', // 操作列的 dataIndex 的值不能改
        fixed: 'left',
        width: 80,
        render: (text, row) => {
          return (
            <div>
              <QmButton type="text" onClick={() => this.tableRef.REMOVE_RECORDS(row.id)}>
                移除
              </QmButton>
            </div>
          );
        },
      },
      {
        title: '序号',
        dataIndex: 'index',
        width: 80,
        render: (text) => {
          return text + 1;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'date',
        width: 200,
        sorter: true,
        filter: {
          type: 'date',
        },
        editRender: (row) => {
          return {
            type: 'datetime',
            editable: true,
          };
        },
      },
      {
        title: '姓名',
        dataIndex: 'name',
        width: 200,
        required: true,
        sorter: true,
        filter: {
          type: 'text',
        },
        editRender: (row) => {
          const obj = {
            type: 'search-helper',
            editable: true,
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
                fetch: {
                  api: getTableData,
                  params: {},
                  dataKey: 'records',
                },
              },
              fieldAliasMap: () => {
                return { name: 'date', age: 'date' };
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
        dataIndex: 'sex',
        width: 100,
        dictItems: this.props.createDictList('sex'),
      },
      {
        title: '年龄',
        dataIndex: 'age',
        width: 100,
        sorter: true,
        filter: {
          type: 'number',
        },
      },
      {
        title: '数量',
        dataIndex: 'num',
        width: 150,
        align: 'right',
        required: true,
        sorter: true,
        filter: {
          type: 'number',
        },
        editRender: (row) => {
          return {
            type: 'number',
            editable: true,
            extra: {
              max: 1000,
            },
            rules: [{ required: true, message: '数量不能为空' }],
          };
        },
      },
      {
        title: '是否选择',
        dataIndex: 'choice',
        align: 'center',
        width: 100,
        editRender: (row) => {
          return {
            type: 'checkbox',
            editable: true,
            extra: {
              trueValue: 1,
              falseValue: 0,
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
        width: 150,
        filter: {
          type: 'radio',
        },
        editRender: (row) => {
          return {
            type: 'select',
            editable: true,
          };
        },
        dictItems: [
          { text: '已完成', value: 1 },
          { text: '进行中', value: 2 },
          { text: '未完成', value: 3 },
        ],
      },
    ];
  }

  // 表单数据的回显
  setFormInitValue = async () => {
    const { drawerRef, recordId } = this.props;
    drawerRef.START_LOADING();
    try {
      const res = await getRecordById({ id: recordId });
      if (res.code === 200) {
        this.formRef.SET_FIELDS_VALUE({ a: 'hello' });
        this.setState({ tableList: [{ id: '1' }] });
      }
    } catch (err) {
      // ...
    }
    drawerRef.STOP_LOADING();
  };

  valuesChangeHandle = () => {
    this.formChanged = true; // 标记表单的变化
  };

  getValueChange = () => {
    const { inserted, updated, removed } = this.tableRef.GET_LOG(); // 标记表格的变化
    return this.formChanged || inserted.length || updated.length || removed.length;
  };

  cancelHandle = (reload) => {
    this.props.onClose(reload);
  };

  saveHandle = async () => {
    const [err, data] = await this.formRef.GET_FORM_DATA();
    if (err) return;
    const { required } = this.tableRef.FIELD_VALIDATE();
    if (required.length) {
      return Message('表格必填字段不能为空！', 'warning');
    }
    console.log('表格数据:', this.tableListTemp);
    const { type, recordId } = this.props;
    if (type === 'add') {
      const res = await addRecord(data);
      Message('新增成功！', 'success');
    }
    if (type === 'edit') {
      const res = await saveRecord({ id: recordId, ...data });
      Message('编辑成功！', 'success');
    }
    // 重置 表单、表格 变更状态
    this.formChanged = false;
    this.tableRef.CLEAR_LOG();
    this.cancelHandle(true);
  };

  insertHandle = () => {
    this.tableRef.INSERT_RECORDS({ id: createUidKey() });
  };

  render() {
    const { type } = this.props;
    const { formList, tableList, columns } = this.state;
    const formType = type !== 'show' ? 'default' : 'onlyShow';
    return (
      <>
        <QmAnchor style={{ height: `calc(100% - 10px)` }}>
          <QmAnchor.Item label="基础信息" showDivider>
            <QmForm
              ref={(ref) => (this.formRef = ref)}
              uniqueKey="SPA1002_FormEdit"
              items={formList}
              labelWidth={80}
              formType={formType}
              fieldsChange={(items) => this.setState({ formList: items })}
              onValuesChange={this.valuesChangeHandle}
            />
          </QmAnchor.Item>
          <QmAnchor.Item label="数据列表" showDivider>
            <QmTable
              ref={(ref) => (this.tableRef = ref)}
              height={300}
              rowKey={(row) => row.id}
              columns={columns}
              dataSource={tableList}
              columnsChange={(columns) => this.setState({ columns })}
              onDataChange={(list) => {
                this.tableListTemp = list;
              }}
            >
              <QmButton type="primary" icon={<PlusOutlined />} onClick={() => this.insertHandle()}>
                新建
              </QmButton>
            </QmTable>
          </QmAnchor.Item>
        </QmAnchor>
        <QmSpace className={`fixed-footer`}>
          <QmButton onClick={() => this.cancelHandle()}>关闭</QmButton>
          {formType !== 'onlyShow' && (
            <QmButton type="primary" onClick={() => this.saveHandle()}>
              确定
            </QmButton>
          )}
        </QmSpace>
      </>
    );
  }
}

export default FormEdit;
