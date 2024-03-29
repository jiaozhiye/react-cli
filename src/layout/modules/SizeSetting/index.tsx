/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-01-04 08:53:58
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Menu, Dropdown } from '@jiaozhiye/qm-design-react';
import { connect } from 'react-redux';
import { createComponentSize } from '@/store/actions';
import { emitter as microEvent } from '@/utils/mitt';
import { t } from '@/locale';
import { application } from '@/hoc';
import { COMP_SIZE } from '@/store/types';
import config from '@/config';

import type { AppState } from '@/store/reducers/app';

import { FontSizeOutlined } from '@/icons';

import './index.less';

@application
class SizeSetting extends Component<any> {
  sizeChangeHandle(size) {
    this.props.createComponentSize(size);
    localStorage.setItem('size', size);
    this.props.iframeMenus.forEach((x) => {
      const $iframe = this.props.getFrameByName(x.key) as HTMLIFrameElement;
      if (!$iframe) return;
      $iframe.contentWindow?.postMessage({ type: COMP_SIZE, data: size }, config.postOrigin);
    });
    // 延迟 - 重要
    setTimeout(() => microEvent.$emit(COMP_SIZE, size));
  }

  renderMenus() {
    const { size } = this.props;
    const items = [
      {
        key: 'large',
        label: t('app.sizeSelect.large'),
        disabled: size === 'large',
        onClick: () => this.sizeChangeHandle('large'),
      },
      {
        key: 'middle',
        label: t('app.sizeSelect.middle'),
        disabled: size === 'middle',
        onClick: () => this.sizeChangeHandle('middle'),
      },
      {
        key: 'small',
        label: t('app.sizeSelect.small'),
        disabled: size === 'small',
        onClick: () => this.sizeChangeHandle('small'),
      },
    ];
    return <Menu items={items} />;
  }

  render() {
    return (
      <div className={classNames('app-size-setting')}>
        <Dropdown
          dropdownRender={() => this.renderMenus()}
          placement="bottomRight"
          trigger={['click']}
        >
          <span>
            <FontSizeOutlined className={`icon`} />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default connect<unknown, unknown, any>(
  (state: AppState) => ({
    size: state.app.size,
    iframeMenus: state.app.iframeMenus,
  }),
  {
    createComponentSize,
  }
)(SizeSetting);
