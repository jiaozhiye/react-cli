/*
 * @Author: 焦质晔
 * @Date: 2022-05-13 10:50:17
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-09-25 08:57:58
 */
import React, { Component } from 'react';
import echarts from '../lib';
import { debounce } from '@/utils';

import type { EChartsOption } from '../lib';
import type { Nullable } from '@/utils/types';

type ITheme = 'light' | 'dark' | 'default';

type IParams = {
  theme?: ITheme;
};

export default (params?: IParams) => {
  const { theme = 'default' } = params || {};

  return (WrappedComponent: React.ComponentType<any>): any => {
    class C extends Component<any> {
      static displayName = `Dict(${WrappedComponent.displayName || WrappedComponent.name})`;

      public chartRef = React.createRef<HTMLDivElement>();

      public chartInstance: Nullable<echarts.ECharts> = null;

      public resizeObserver: ResizeObserver | undefined;

      getOptions = (options: EChartsOption): EChartsOption => {
        if (theme !== 'dark') {
          return options;
        }
        return {
          backgroundColor: 'transparent',
          ...options,
        };
      };

      setOptions = (options: EChartsOption, clear = true) => {
        const $el = this.chartRef.current!;
        if (!$el) return;
        if (!this.chartInstance) {
          this.chartInstance = echarts.init($el, theme);
        }
        // 清空画布
        clear && this.chartInstance.clear();
        this.chartInstance.setOption(this.getOptions(options));
      };

      setResize = (resize = true) => {
        const $el = this.chartRef.current!;
        if ($el?.offsetHeight === 0) return;
        resize && this.chartInstance?.resize();
      };

      getInstance = () => {
        return this.chartInstance;
      };

      resizeDebouncer = debounce(() => {
        this.setResize();
      }, 20);

      componentDidMount() {
        this.resizeObserver = new ResizeObserver(this.resizeDebouncer);
        this.resizeObserver.observe(this.chartRef.current!);
      }

      componentWillUnmount() {
        this.resizeObserver?.disconnect();
        this.chartInstance?.dispose();
        this.chartInstance = null;
      }

      render() {
        const { forwardedRef } = this.props;
        return (
          <WrappedComponent
            ref={forwardedRef}
            {...this.props}
            setOptions={this.setOptions}
            setResize={this.setResize}
            getInstance={this.getInstance}
            echarts={echarts}
            render={(style: React.CSSProperties) => <div ref={this.chartRef} style={style} />}
          />
        );
      }
    }

    return React.forwardRef((props: any, ref) => <C {...props} forwardedRef={ref} />);
  };
};
