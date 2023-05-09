/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-01-04 09:22:40
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { CheckOutlined } from '@/icons';
import { connect } from 'react-redux';
import { createThemeType } from '@/store/actions';
import { t } from '@/locale';
import type { AppState } from '@/store/reducers/app';

import './index.less';

class ThemeColor extends Component<any> {
  themeTypeChangeHandle(theme) {
    this.props.createThemeType(theme);
    localStorage.setItem('theme_type', theme);
  }

  render() {
    const { themeType } = this.props;
    return (
      <div className={classNames('themeColor')}>
        <div className={classNames('title')}>{t('app.theme.type')}</div>
        <div style={{ display: 'flex' }}>
          <div
            className={classNames('color-type-item', 'item-light')}
            onClick={() => this.themeTypeChangeHandle('light')}
          >
            <CheckOutlined
              className={classNames('selectIcon')}
              style={{ display: themeType === 'light' ? '' : 'none' }}
            />
          </div>
          <div
            className={classNames('color-type-item', 'item-dark')}
            onClick={() => this.themeTypeChangeHandle('dark')}
          >
            <CheckOutlined
              className={classNames('selectIcon')}
              style={{ display: themeType === 'dark' ? '' : 'none' }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect<unknown, unknown, any>(
  (state: AppState) => ({
    themeType: state.app.themeType,
    lang: state.app.lang,
  }),
  {
    createThemeType,
  }
)(ThemeColor);
