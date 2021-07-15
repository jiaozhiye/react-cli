/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-13 22:00:50
 */
import React, { Component } from 'react';
import { Confirm } from '@/utils';
import { t } from '@/locale';
import './lang';

class Dashboard extends Component<any> {
  clickHandle = async () => {
    this.props.history.push('/bjgl/cggl/dd?a=1&b=2');
    // try {
    //   await Confirm(t('dashboard.title'));
    //   console.log(111);
    // } catch (err) {
    //   console.log(222);
    // }
  };
  render(): React.ReactElement {
    return <div onClick={this.clickHandle}>{t('dashboard.title')}</div>;
  }
}

export default Dashboard;
