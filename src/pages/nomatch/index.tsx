/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 15:02:31
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { t } from '@/locale';

import './index.less';

class Nomatch extends Component {
  render() {
    return (
      <div className={classNames('app-nomatch')}>
        <div className={classNames('container')}>
          <h2>404</h2>
          <div className={classNames('text')}>{t('app.global.noMatch')}</div>
        </div>
      </div>
    );
  }
}

export default Nomatch;
