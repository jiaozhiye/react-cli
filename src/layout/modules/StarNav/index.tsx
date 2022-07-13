/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-06 23:29:24
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Menu } from '@jiaozhiye/qm-design-react';
import { StarFilled } from '@/icons';
import { t } from '@/locale';

import { connect } from 'react-redux';
import { createStarMenu } from '@/store/actions';
import type { AppState } from '@/store/reducers/app';

import './index.less';

class StarNav extends Component<any> {
  componentDidMount() {
    this.props.createStarMenu();
  }

  createMenuItems() {
    return this.props.starMenus.map((x) => ({
      key: x.key,
      label: (
        <Link to={x.key} target={x.target}>
          <span>{x.title}</span>
        </Link>
      ),
    }));
  }

  render() {
    const items = [
      {
        key: 'star-nav',
        popupClassName: 'ant-submenu-popup-dark',
        icon: <StarFilled />,
        label: t('app.sidebar.starNav'),
        children: this.createMenuItems(),
      },
    ];
    return (
      <div className={classNames('app-star-nav')}>
        <Menu mode="inline" theme="dark" items={items} />
      </div>
    );
  }
}

export default connect(
  (state: AppState) => ({
    starMenus: state.app.starMenus,
    lang: state.app.lang,
  }),
  {
    createStarMenu,
  }
)(StarNav);
