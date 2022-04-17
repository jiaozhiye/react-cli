/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-04-17 09:48:15
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Menu, Dropdown } from '@jiaozhiye/qm-design-react';
import { connect } from 'react-redux';
import { createComponentSize } from '@/store/actions';
import { emitter } from '@/utils/mitt';
import { t } from '@/locale';
import { application } from '@/hoc';
import { COMP_SIZE } from '@/store/types';
import type { AppState } from '@/store/reducers/app';

import { FontSizeOutlined } from '@/icons';

import './index.less';

@application
class SizeSetting extends Component<any> {
  sizeChangeHandle(size) {
    this.props.createComponentSize(size);
    localStorage.setItem('size', size);
    this.props.iframeMenus.forEach((x) => {
      const $iframe = document.getElementById(x.key) as HTMLIFrameElement;
      if (!$iframe) return;
      $iframe.contentWindow?.postMessage({ type: COMP_SIZE, data: size }, '*');
    });
    emitter.$emit(COMP_SIZE, size);
    // 刷新页面
    setTimeout(() => this.props.refreshView(this.props.location.pathname));
  }

  renderMenus() {
    const { size } = this.props;
    return (
      <Menu>
        <Menu.Item
          key="large"
          disabled={size === 'large'}
          onClick={() => this.sizeChangeHandle('large')}
        >
          {t('app.sizeSelect.large')}
        </Menu.Item>
        <Menu.Item
          key="middle"
          disabled={size === 'middle'}
          onClick={() => this.sizeChangeHandle('middle')}
        >
          {t('app.sizeSelect.middle')}
        </Menu.Item>
        <Menu.Item
          key="small"
          disabled={size === 'small'}
          onClick={() => this.sizeChangeHandle('small')}
        >
          {t('app.sizeSelect.small')}
        </Menu.Item>
      </Menu>
    );
  }

  render(): React.ReactElement {
    return (
      <div className={classNames('app-size-setting')}>
        <Dropdown overlay={this.renderMenus()} placement="bottomRight" trigger={['click']}>
          <span>
            <FontSizeOutlined className={`icon`} />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default connect(
  (state: AppState) => ({
    size: state.app.size,
    iframeMenus: state.app.iframeMenus,
  }),
  {
    createComponentSize,
  }
)(SizeSetting);
