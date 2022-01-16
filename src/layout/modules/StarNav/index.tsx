/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 12:22:13
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Menu } from '@jiaozhiye/qm-design-react';
import { StarFilled } from '@ant-design/icons';
import { t } from '@/locale';

import { connect } from 'react-redux';
import { createStarMenu } from '@/store/actions';
import type { AppState } from '@/store/reducers/app';

import './index.less';

const { SubMenu } = Menu;

class StarNav extends Component<any> {
  componentDidMount() {
    this.props.createStarMenu();
  }

  createMenuItems() {
    return this.props.starMenus.map((x) => (
      <Menu.Item key={x.key}>
        <Link to={x.key} target={x.target}>
          <span>{x.title}</span>
        </Link>
      </Menu.Item>
    ));
  }

  render(): React.ReactElement {
    return (
      <div className={classNames('app-star-nav')}>
        <Menu mode="inline" theme="dark">
          <SubMenu key="star-nav" icon={<StarFilled />} title={t('app.sidebar.starNav')}>
            {this.createMenuItems()}
          </SubMenu>
        </Menu>
      </div>
    );
  }
}

export default connect(
  (state: AppState) => ({
    starMenus: state.app.starMenus,
  }),
  {
    createStarMenu,
  }
)(StarNav);
