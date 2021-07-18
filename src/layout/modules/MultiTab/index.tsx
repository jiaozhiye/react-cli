/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 13:44:13
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-18 17:22:00
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import classNames from 'classnames';
import { t } from '@/locale';

import { connect } from 'react-redux';
import { createTabMenu, createIframeMenu } from '@/store/actions';

import { Tabs } from 'antd';
import './index.less';

const { TabPane } = Tabs;

const CTX_MENU_ID = 'SIMPLE';

@withRouter
class MultiTab extends Component<any> {
  state = {
    activeKey: this.props.location.pathname,
  };

  componentDidUpdate(prevProps, prevState) {
    const { pathname } = this.props.location;
    if (prevState.activeKey === pathname) return;
    this.setState({ activeKey: pathname });
  }

  findCurTagIndex(activeKey) {
    const { tabMenus } = this.props;
    return tabMenus.findIndex((x) => x.path === activeKey);
  }

  refreshTagHandle = () => {
    const { activeKey } = this.state;
    const { search } = this.props.location;
    this.props.history.replace(`/redirect${activeKey}` + search);
    let $iframe = document.getElementById(activeKey) as any;
    if ($iframe) {
      // 可能未释放内存，待优化
      $iframe.contentWindow.location.reload();
    }
    $iframe = null;
  };

  closeTagHandle = (dir) => {
    const { tabMenus } = this.props;
    const index = this.findCurTagIndex(this.state.activeKey);
    if (index === -1) return;
    tabMenus.forEach((x, i) => {
      if (i === 0) return;
      if (dir === 'right' && i > index) {
        this.doRemove(x.path);
      }
      if (dir === 'left' && i < index) {
        this.doRemove(x.path);
      }
      if (dir === 'other') {
        if (i === index) return;
        this.doRemove(x.path);
      }
    });
  };

  doRemove(targetKey) {
    const { activeKey } = this.state;
    const { tabMenus } = this.props;
    if (targetKey === activeKey) {
      const index = this.findCurTagIndex(targetKey);
      const nextActiveKey = tabMenus[index - 1].path;
      this.changeHandle(nextActiveKey);
    }
    this.props.createTabMenu(targetKey, 'remove');
    this.props.createIframeMenu(targetKey, 'remove');
  }

  changeHandle = (activeKey) => {
    this.props.history.push(activeKey);
    this.setState({ activeKey });
  };

  editHandle = (targetKey, action) => {
    if (action !== 'remove') return;
    this.doRemove(targetKey);
  };

  render(): React.ReactElement {
    const { activeKey } = this.state;
    const { tabMenus } = this.props;
    return (
      <div className={classNames('app-multi-tab')}>
        <Tabs
          type="editable-card"
          activeKey={activeKey}
          hideAdd
          onChange={this.changeHandle}
          onEdit={this.editHandle}
        >
          {tabMenus.map((item, index) => (
            <TabPane
              key={item.path}
              tab={
                <ContextMenuTrigger
                  id={item.path === activeKey ? CTX_MENU_ID : ''}
                  renderTag="span"
                  attributes={{ style: { marginLeft: '-16px', padding: '10px 0 10px 16px' } }}
                >
                  {item.title}
                </ContextMenuTrigger>
              }
              closable={index > 0}
            />
          ))}
        </Tabs>
        <ContextMenu id={CTX_MENU_ID} className="ant-dropdown-menu">
          <MenuItem className="ant-dropdown-menu-item" onClick={() => this.refreshTagHandle()}>
            {t('app.multiTab.refresh')}
          </MenuItem>
          <MenuItem className="ant-dropdown-menu-item" onClick={() => this.closeTagHandle('right')}>
            {t('app.multiTab.closeRight')}
          </MenuItem>
          <MenuItem className="ant-dropdown-menu-item" onClick={() => this.closeTagHandle('left')}>
            {t('app.multiTab.closeLeft')}
          </MenuItem>
          {tabMenus.length > 1 && (
            <MenuItem
              className="ant-dropdown-menu-item"
              onClick={() => this.closeTagHandle('other')}
            >
              {t('app.multiTab.closeOthers')}
            </MenuItem>
          )}
        </ContextMenu>
      </div>
    );
  }
}

export default connect(
  (state: any) => ({
    tabMenus: state.app.tabMenus,
  }),
  {
    createTabMenu,
    createIframeMenu,
  }
)(MultiTab);
