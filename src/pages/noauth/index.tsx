/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-12-08 17:15:06
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { t } from '@/locale';

import './index.less';

class Noauth extends Component {
  render() {
    return (
      <div className={classNames('app-noauth')}>
        <div className={classNames('container')}>
          <h2>403</h2>
          <div className={classNames('text')}>{t('app.global.noAuth')}</div>
        </div>
      </div>
    );
  }
}

export default Noauth;
