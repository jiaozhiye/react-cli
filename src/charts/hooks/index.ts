/*
 * @Author: 焦质晔
 * @Date: 2022-05-15 17:17:41
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-15 18:09:17
 */
import * as React from 'react';
import echarts from '../lib';
import { debounce } from '@/utils';

import type { EChartsOption } from '../lib';

type ITheme = 'light' | 'dark' | 'default';

export default function useChart(
  elRef: React.RefObject<HTMLDivElement>,
  theme: ITheme = 'default'
) {
  const chartInstance = React.useRef<echarts.ECharts>();
  const resizeObserver = React.useRef<ResizeObserver>();

  const getOptions = (options: EChartsOption): EChartsOption => {
    if (theme !== 'dark') {
      return options;
    }
    return {
      backgroundColor: 'transparent',
      ...options,
    };
  };

  const setOptions = (options: EChartsOption, clear = true) => {
    const $el = elRef.current;
    if (!$el) return;
    if (!chartInstance.current) {
      chartInstance.current = echarts.init($el, theme);
    }
    // 清空画布
    clear && chartInstance.current.clear();
    chartInstance.current.setOption(getOptions(options));
  };

  const setResize = (resize = true) => {
    const $el = elRef.current;
    if ($el?.offsetHeight === 0) return;
    resize && chartInstance.current?.resize();
  };

  const getInstance = () => {
    return chartInstance.current;
  };

  const resizeDebouncer = debounce(() => setResize(), 20);

  React.useEffect(() => {
    resizeObserver.current = new ResizeObserver(resizeDebouncer);
    resizeObserver.current.observe(elRef.current!);
    return () => {
      chartInstance.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    setOptions,
    setResize,
    echarts,
    getInstance,
  };
}
