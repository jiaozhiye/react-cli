/*
 * @Author: 焦质晔
 * @Date: 2021-11-17 14:25:10
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-29 16:28:08
 */
import * as echarts from 'echarts/core';

import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  FunnelChart,
  GaugeChart,
} from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
} from 'echarts/components';

import { LabelLayout, UniversalTransition } from 'echarts/features';

import { CanvasRenderer } from 'echarts/renderers';

export type { EChartsOption } from 'echarts';

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  FunnelChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  CanvasRenderer,
  LabelLayout,
  UniversalTransition,
]);

export default echarts;
