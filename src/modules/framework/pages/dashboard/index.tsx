/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-02-26 13:02:24
 */
import React from 'react';
import classNames from 'classnames';
import { t } from '@/locale';
import './lang';

import css from './index.module.less';

const Dashboard: React.FC = () => {
  return <div>{t('dashboard.title')}</div>;
};

export default Dashboard;
