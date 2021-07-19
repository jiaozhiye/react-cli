/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-19 16:35:58
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { connect } from 'react-redux';

import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;

import './index.less';

const getIcon = (icon) => {
  if (!icon) return null;
  return (
    <span className="anticon">
      <i className={classNames(`iconfont`, icon)} />
    </span>
  );
};

const conversionPath = (path) => {
  if (path && path.indexOf('http') === 0) {
    return path;
  }
  return `/${path || ''}`.replace(/\/+/g, '/');
};

@withRouter
class SideMenu extends Component<any> {
  // 获得菜单子节点
  getNavMenuItems = (menus) => {
    if (!menus) return [];
    return menus.filter((x) => !x.hideInMenu).map((x) => this.getSubMenuOrItem(x));
  };

  // 获取 SubMenu or Item
  getSubMenuOrItem = (item) => {
    if (item.children && !item.hideChildrenInMenu) {
      return (
        <SubMenu
          key={item.key}
          title={
            <>
              {getIcon(item.icon)}
              <span>{item.title}</span>
            </>
          }
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.key}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  // 判断是否是 http 链接 返回 Link 或 a
  getMenuItemPath = (item) => {
    const path = conversionPath(item.key);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(path)) {
      return (
        <a href={path} target={target}>
          {getIcon(item.icon)}
          <span>{item.title}</span>
        </a>
      );
    }
    return (
      <Link to={path} target={target} replace={path === this.props.location.pathname}>
        {getIcon(item.icon)}
        <span>{item.title}</span>
      </Link>
    );
  };

  render(): React.ReactElement {
    const { sideMenus } = this.props;
    return (
      <div className={classNames('app-side-menu')}>
        <Menu
          mode="inline"
          theme="dark"
          // defaultOpenKeys={['/bjgl', '/bjgl/cggl']}
          // defaultSelectedKeys={['/bjgl/cggl/dd']}
        >
          {this.getNavMenuItems(sideMenus)}
        </Menu>
      </div>
    );
  }
}

export default connect((state: any) => ({ sideMenus: state.app.sideMenus }), {})(SideMenu);
