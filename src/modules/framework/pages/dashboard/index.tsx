/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 15:07:08
 */
import React, { Component } from 'react';
import { t } from '@/locale';
import './lang';

class Dashboard extends Component<any> {
  render(): React.ReactElement {
    return <div>{t('dashboard.title')}</div>;
  }
}

export default Dashboard;
