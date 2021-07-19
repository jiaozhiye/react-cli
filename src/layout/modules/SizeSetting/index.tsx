/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-15 21:01:22
 */
import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';
import { connect } from 'react-redux';
import { createComponentSize } from '@/store/actions';
import { t } from '@/locale';

import './index.less';

class SizeSetting extends Component<any> {
  sizeChangeHandle(size) {
    this.props.createComponentSize(size);
    localStorage.setItem('size', size);
    this.props.iframeMenus.forEach((x) => {
      const $iframe: HTMLIFrameElement = document.getElementById(x.key) as HTMLIFrameElement;
      if (!$iframe) return;
      $iframe.contentWindow?.postMessage({ type: 'size', data: size }, '*');
    });
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
      <div className="app-size-setting">
        <Dropdown overlay={this.renderMenus()} placement="bottomRight" trigger={['click']}>
          <span>
            <i className="iconfont icon-font-size" />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default connect(
  (state: any) => ({
    size: state.app.size,
    iframeMenus: state.app.iframeMenus,
  }),
  {
    createComponentSize,
  }
)(SizeSetting);
