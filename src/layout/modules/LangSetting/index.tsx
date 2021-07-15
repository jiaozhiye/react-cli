/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-15 08:24:36
 */
import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';
import { connect } from 'react-redux';
import { createLocaleLang } from '@/store/actions';
import { changeLocale } from '@/locale';

import './index.less';

class LangSetting extends Component<any> {
  langChangeHandle(lang) {
    this.props.createLocaleLang(lang);
    changeLocale(lang);
  }

  renderMenus() {
    const { lang } = this.props;
    return (
      <Menu>
        <Menu.Item
          key="zh-cn"
          disabled={lang === 'zh-cn'}
          onClick={() => this.langChangeHandle('zh-cn')}
        >
          CN&nbsp;&nbsp;简体中文
        </Menu.Item>
        <Menu.Item key="en" disabled={lang === 'en'} onClick={() => this.langChangeHandle('en')}>
          US&nbsp;&nbsp;English
        </Menu.Item>
      </Menu>
    );
  }

  render(): React.ReactElement {
    return (
      <div className="app-lang-setting">
        <Dropdown overlay={this.renderMenus()} placement="bottomRight" trigger={['click']}>
          <span>
            <i className="iconfont icon-earth" />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default connect((state: any) => ({ lang: state.app.lang }), {
  createLocaleLang,
})(LangSetting);
