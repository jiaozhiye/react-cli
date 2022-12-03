/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-07-03 11:21:39
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { CheckOutlined } from '@/icons';
import { connect } from 'react-redux';
import { createTheme } from '@/store/actions';
import { emitter } from '@/utils/mitt';
import { t } from '@/locale';
import { THEME_COLOR } from '@/store/types';
import type { AppState } from '@/store/reducers/app';

import './index.less';

const Tag = ({ color, check, ...rest }) => (
  <div
    {...rest}
    style={{
      backgroundColor: color,
    }}
  >
    {check ? <CheckOutlined /> : ''}
  </div>
);

class ThemeColor extends Component<any> {
  state = {
    colorList: [
      { color: '#F5222D' },
      { color: '#FA541C' },
      { color: '#FAAD14' },
      { color: '#11A983' },
      { color: '#13C2C2' },
      { color: '#52C41A' },
      { color: '#1890FF' },
      { color: '#2F54EB' },
      { color: '#2A5CA5' },
    ],
  };

  themeColorChangeHandle(color) {
    this.props.createTheme(color);
    this.props.iframeMenus.forEach((x) => {
      const $iframe = document.getElementById(x.key) as HTMLIFrameElement;
      if (!$iframe) return;
      $iframe.contentWindow?.postMessage({ type: THEME_COLOR, data: color }, '*');
    });
    emitter.$emit(THEME_COLOR, color);
  }

  render() {
    const { themeColor } = this.props;
    const { colorList } = this.state;
    return (
      <div className={classNames('themeColor')}>
        <h5 className={classNames('title')}>{t('app.theme.color')}</h5>
        <div>
          {colorList.map(({ color }) => (
            <Tag
              key={color.slice(1)}
              className={classNames('color-block')}
              color={color}
              check={themeColor === color}
              onClick={() => this.themeColorChangeHandle(color)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default connect(
  (state: AppState) => ({
    themeColor: state.app.themeColor,
    iframeMenus: state.app.iframeMenus,
  }),
  {
    createTheme,
  }
)(ThemeColor);
