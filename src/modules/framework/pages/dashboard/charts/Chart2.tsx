/*
 * @Author: 焦质晔
 * @Date: 2022-05-13 10:53:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-15 18:05:27
 */
import React from 'react';
import { get } from 'lodash-es';
import { chart, useChart } from '@/charts';
import { useUpdateEffect } from '@/hooks';

import type { EChartsOption } from '@/charts/lib';
import type { IntervalHandle } from '@/utils/types';

import { QmSpin } from '@jiaozhiye/qm-design-react';

// 请求间隔 15s
const DELAY_TIME = 15;

const Chart2: React.FC<any> = (props) => {
  const { fetch, style } = props;

  const dchartRef = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<IntervalHandle>();
  const { setOptions } = useChart(dchartRef);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getChartData();
    return () => {
      stopTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useUpdateEffect(() => {
    getChartData('update');
  }, [fetch?.params]);

  // echarts 配置
  const createOptios = (data): EChartsOption => {
    return {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, Math.random() * 1000],
          type: 'line',
        },
      ],
    };
  };

  const stopTimer = () => {
    clearInterval(timer.current!);
  };

  const getChartData = async (state = 'init') => {
    if (!fetch?.api) {
      return console.warn('参数有误，请设置 `api` 接口');
    }
    if (state === 'init') {
      setLoading(true);
    }
    try {
      const res = await fetch.api(fetch.params);
      if (res.code === 200) {
        const data = get(res.data, fetch.dataKey) ?? res.data;
        if (state === 'init') {
          setOptions(createOptios(data));
          timer.current = setInterval(() => getChartData('update'), DELAY_TIME * 1000);
        }
        if (state === 'update') {
          setOptions(createOptios(data), false);
        }
      }
    } catch (err) {
      // ...
    }
    setLoading(false);
  };

  return (
    <QmSpin spinning={loading} style={style}>
      <div ref={dchartRef} style={style} />
    </QmSpin>
  );
};

Chart2.displayName = 'Chart2';

export default Chart2;
