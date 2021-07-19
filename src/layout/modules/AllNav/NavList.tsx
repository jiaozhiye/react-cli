/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-19 16:48:39
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { t } from '@/locale';

import './index.less';

class NavList extends Component<any> {
  render(): React.ReactElement {
    return (
      <>
        <div className={classNames('nav-list-masker')}></div>
        <div className={classNames('nav-list-content')}>1234</div>
      </>
    );
  }
}

export default NavList;
