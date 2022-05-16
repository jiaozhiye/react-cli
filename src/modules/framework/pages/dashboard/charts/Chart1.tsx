/*
 * @Author: 焦质晔
 * @Date: 2022-05-13 10:53:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-15 18:05:10
 */
import React from 'react';
import { get, isEqual } from 'lodash-es';
import { chart } from '@/charts';

import type { EChartsOption } from '@/charts/lib';
import type { IntervalHandle } from '@/utils/types';

import { QmSpin } from '@jiaozhiye/qm-design-react';

// 请求间隔 15s
const DELAY_TIME = 15;

@chart()
class Chart1 extends React.Component<any> {
  private timer: IntervalHandle;

  state = {
    loading: false,
  };

  componentDidMount() {
    this.getChartData();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.fetch?.params, this.props.fetch?.params)) {
      this.getChartData('update');
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // echarts 配置
  createOptios = (data): EChartsOption => {
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
          type: 'bar',
        },
      ],
    };
  };

  getChartData = async (state = 'init') => {
    const { fetch } = this.props;
    if (!fetch?.api) {
      return console.warn('参数有误，请设置 `api` 接口');
    }
    if (state === 'init') {
      this.setState({ loading: true });
    }
    try {
      const res = await fetch.api(fetch.params);
      if (res.code === 200) {
        const data = get(res.data, fetch.dataKey) ?? res.data;
        if (state === 'init') {
          this.props.setOptions(this.createOptios(data));
          this.timer = setInterval(() => this.getChartData('update'), DELAY_TIME * 1000);
        }
        if (state === 'update') {
          this.props.setOptions(this.createOptios(data), false);
        }
      }
    } catch (err) {
      // ...
    }
    this.setState({ loading: false });
  };

  render() {
    const { loading } = this.state;
    const { style } = this.props;
    return (
      <QmSpin spinning={loading} style={style}>
        {this.props.render(style)}
      </QmSpin>
    );
  }
}

export default Chart1;
