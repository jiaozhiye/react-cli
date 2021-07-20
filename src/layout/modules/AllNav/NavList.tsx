/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 11:02:17
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import config from '@/config';
import { t } from '@/locale';

import './index.less';

class NavList extends Component<any> {
  static propTypes = {
    visible: PropTypes.bool,
    collapsed: PropTypes.bool,
    onChange: PropTypes.func,
  };

  clickHandle = () => {
    this.props.onChange();
  };

  render(): React.ReactElement {
    const { visible, collapsed } = this.props;
    return (
      <>
        <div
          className={classNames('nav-list-masker', visible ? 'show' : '')}
          style={{ left: !collapsed ? `${config.sideWidth[0]}px` : `${config.sideWidth[1]}px` }}
          onClick={this.clickHandle}
        />
        <div
          className={classNames('nav-list-container', visible ? 'show' : '')}
          style={{ left: !collapsed ? `${config.sideWidth[0]}px` : `${config.sideWidth[1]}px` }}
        >
          <div>asdasd</div>
        </div>
      </>
    );
  }
}

export default NavList;
