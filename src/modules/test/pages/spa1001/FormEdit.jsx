/*
 * @Author: 焦质晔
 * @Date: 2022-03-13 17:06:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-13 20:15:16
 */
import React from 'react';
import classNames from 'classnames';
import { dict } from '@/hoc';
import { Message } from '@/utils';
import { getRecordById, getTableData, addRecord, saveRecord } from '@test/api/spa1001';

import { QmForm, QmAnchor, QmButton, QmSpace } from '@jiaozhiye/qm-design-react';

import css from './index.module.less';

@dict
class FormEdit extends React.Component {
  state = {
    formList: this.createFormList(),
  };

  anchorLabelList = [
    { label: '标题1', id: '_a1' },
    { label: '标题2', id: '_a2' },
    { label: '标题3', id: '_a3' },
  ];

  componentDidMount() {
    if (this.props.type !== 'add') {
      this.setFormInitValue();
    }
  }

  createFormList() {
    return [
      {
        type: 'DIVIDER',
        label: '标题1',
        fieldName: '_a1',
      },
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
        type: 'DIVIDER',
        label: '标题2',
        fieldName: '_a2',
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
      {
        type: 'CHECKBOX',
        fieldName: 'g',
        label: '条件6',
        options: {
          trueValue: '1',
          falseValue: '0',
        },
        onChange: (val) => {
          this.setState((prev) => {
            prev.formList.find((x) => x.fieldName === 'f').disabled = val === '1';
            return { formList: prev.formList };
          });
        },
      },
      {
        type: 'DIVIDER',
        label: '标题3',
        fieldName: '_a3',
      },
      {
        type: 'INPUT',
        label: '条件7',
        fieldName: 'h',
      },
      {
        type: 'INPUT',
        label: '条件8',
        fieldName: 'i',
      },
      {
        type: 'INPUT',
        label: '条件9',
        fieldName: 'j',
      },
      {
        type: 'INPUT',
        label: '条件10',
        fieldName: 'k',
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
    return this.formChanged;
  };

  cancelHandle = (reload) => {
    this.props.onClose(reload);
  };

  saveHandle = async () => {
    const [err, data] = await this.formRef.GET_FORM_DATA();
    if (err) return;
    const { type, recordId } = this.props;
    if (type === 'add') {
      const res = await addRecord(data);
      Message('新增成功！', 'success');
    }
    if (type === 'edit') {
      const res = await saveRecord({ id: recordId, ...data });
      Message('编辑成功！', 'success');
    }
    this.formChanged = false;
    this.cancelHandle(true);
  };

  render() {
    const { type } = this.props;
    const { formList } = this.state;
    const formType = type !== 'show' ? 'default' : 'onlyShow';
    return (
      <>
        <QmAnchor labelList={this.anchorLabelList} style={{ height: `calc(100% - 10px)` }}>
          <QmForm
            ref={(ref) => (this.formRef = ref)}
            uniqueKey="SPA1001_FormEdit"
            items={formList}
            labelWidth={90}
            formType={formType}
            fieldsChange={(items) => this.setState({ formList: items })}
            onValuesChange={this.valuesChangeHandle}
          />
        </QmAnchor>
        <QmSpace className={`fixed-footer`}>
          <QmButton onClick={() => this.cancelHandle()}>关闭</QmButton>
          {formType !== 'onlyShow' && (
            <QmButton type="primary" click={() => this.saveHandle()}>
              确定
            </QmButton>
          )}
        </QmSpace>
      </>
    );
  }
}

export default FormEdit;
