/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-14 20:52:05
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import logo1 from './assets/logo1.svg';
import logo2 from './assets/logo2.svg';

import './index.less';

class Logo extends Component<any> {
  render(): React.ReactElement {
    const { collapsed } = this.props;
    return (
      <div className="app-logo">
        <Link to="/home" className="link">
          <img
            className={classNames('logo', !collapsed ? 'logo1' : 'logo2')}
            src={!collapsed ? logo1 : logo2}
          />
        </Link>
      </div>
    );
  }
}

export default Logo;
