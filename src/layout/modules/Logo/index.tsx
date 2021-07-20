/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 10:48:53
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import logo1 from './assets/logo1.svg';
import logo2 from './assets/logo2.svg';

import './index.less';

class Logo extends Component<any> {
  static propTypes = {
    collapsed: PropTypes.bool,
  };

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
