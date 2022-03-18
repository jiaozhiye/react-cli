/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 10:48:53
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { t } from '@/locale';
import { Link } from 'react-router-dom';

import logo from './assets/logo.png';

import './index.less';

class Logo extends Component<any> {
  static propTypes = {
    collapsed: PropTypes.bool,
  };

  render(): React.ReactElement {
    const { collapsed } = this.props;
    return (
      <div className={classNames('app-logo')}>
        <Link to="/home" className={classNames('link')}>
          <img className={classNames('logo')} src={logo} />
          {!collapsed && <span className={`title`}>{t('app.global.title')}</span>}
        </Link>
      </div>
    );
  }
}

export default Logo;
