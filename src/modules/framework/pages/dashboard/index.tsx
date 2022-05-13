/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-13 16:51:22
 */
import React from 'react';
import classNames from 'classnames';
import { t } from '@/locale';
import './lang';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getTableData } from '@test/api/demo';
import Chart1 from './charts/Chart1';

import css from './index.module.less';

const Dashboard: React.FC = () => {
  const [params, setParams] = React.useState<any>({});
  return (
    <div>
      {t('dashboard.title')}
      <Chart1
        fetch={{ api: getTableData, params, dataKey: '' }}
        style={{ height: 300, width: 400 }}
      />
    </div>
  );
};

export default Dashboard;
