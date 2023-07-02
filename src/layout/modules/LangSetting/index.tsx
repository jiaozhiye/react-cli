/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-07-02 08:46:48
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Menu, Dropdown } from '@jiaozhiye/qm-design-react';
import { connect } from 'react-redux';
import { createLocaleLang, createMicroMenu, createIframeMenu } from '@/store/actions';
import { changeLocale } from '@/locale';
import { emitter as microEvent } from '@/utils/mitt';
import { application } from '@/hoc';
import { LOCALE_LANG } from '@/store/types';
import config from '@/config';

import type { AppState } from '@/store/reducers/app';

import { TranslationOutlined } from '@/icons';

import './index.less';

@application
class LangSetting extends Component<any> {
  langChangeHandle(lang) {
    this.props.createLocaleLang(lang);
    changeLocale(lang);
    this.props.iframeMenus.forEach((x) => {
      const $iframe = document.getElementById(x.key) as HTMLIFrameElement;
      if (!$iframe) return;
      $iframe.contentWindow?.postMessage({ type: LOCALE_LANG, data: lang }, config.postOrigin);
    });
    microEvent.$emit(LOCALE_LANG, lang);
    // 清空页签缓存
    this.props.tabMenus.forEach((x) => {
      this.props.createMicroMenu(x.path, 'remove');
      this.props.createIframeMenu(x.path, 'remove');
    });
    setTimeout(() => this.props.reloadView());
  }

  renderMenus() {
    const { lang } = this.props;
    const items = [
      {
        key: 'zh-cn',
        disabled: lang === 'zh-cn',
        label: <>CN&nbsp;&nbsp;简体中文</>,
        onClick: () => this.langChangeHandle('zh-cn'),
      },
      {
        key: 'en',
        disabled: lang === 'en',
        label: <>US&nbsp;&nbsp;English</>,
        onClick: () => this.langChangeHandle('en'),
      },
    ];
    return <Menu items={items} />;
  }

  render() {
    return (
      <div className={classNames('app-lang-setting')}>
        <Dropdown
          dropdownRender={() => this.renderMenus()}
          placement="bottomRight"
          trigger={['click']}
        >
          <span>
            <TranslationOutlined className={`icon`} />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default connect<unknown, unknown, any>(
  (state: AppState) => ({
    lang: state.app.lang,
    tabMenus: state.app.tabMenus,
    iframeMenus: state.app.iframeMenus,
  }),
  {
    createLocaleLang,
    createMicroMenu,
    createIframeMenu,
  }
)(LangSetting);
