/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-05-24 14:30:40
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { t } from '@/locale';
import { Menu, Dropdown } from '@jiaozhiye/qm-design-react';

import { QuestionCircleOutlined } from '@/icons';

import './index.less';

class HelperDoc extends Component<any> {
  renderMenus() {
    const items = [
      {
        key: 1,
        label: t('app.helperDoc.helpDoc'),
      },
      {
        key: 2,
        label: t('app.helperDoc.useManual'),
      },
    ];
    return <Menu items={items} />;
  }

  render() {
    return (
      <div className={classNames('app-helper-doc')}>
        <Dropdown
          dropdownRender={() => this.renderMenus()}
          placement="bottomRight"
          trigger={['click']}
        >
          <span>
            <QuestionCircleOutlined className={`icon`} />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default HelperDoc;
