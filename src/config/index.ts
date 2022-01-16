/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 12:43:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-16 10:13:16
 */
import config from '../../config/app.conf';
import { t } from '@/locale';
import type { ComponentSize, Language, ThemeType } from '@/utils/types';

type IConfig = {
  system: string;
  title: string;
  baseUrl: string;
  lang: Language;
  size: ComponentSize;
  themeType: ThemeType;
  prefix: string;
  useIframe: boolean;
  sideWidth: number[];
  maxCacheNum: number;
  showBreadcrumb: boolean;
  showScreenFull: boolean;
  showCustomTheme: boolean;
  showLangSelect: boolean;
  showSizeSelect: boolean;
  showHelperDoc: boolean;
  showNotification: boolean;
  openWatermark: boolean;
  openBuryPoint: boolean;
};

export default {
  system: config.name,
  title: t('app.global.title'),
  baseUrl: process.env.ENV_CONFIG === 'gray' ? '/gray' : '/',
  lang: 'zh-cn', // 语言
  size: 'middle', // 尺寸
  themeType: 'light', // 主题模式
  prefix: '/api', // ajax 请求前缀
  useIframe: true, // 是否使用 iframe 承载路由页面
  sideWidth: [200, 60], // 侧栏导航宽度
  maxCacheNum: 10, // 路由组件最大缓存数量
  showBreadcrumb: false, // 是否显示面包屑
  showScreenFull: true, // 是否显示全屏按钮
  showCustomTheme: true, // 是否显示自定义主题
  showLangSelect: true, // 是否显示多语言
  showSizeSelect: true, // 是否显示尺寸选择
  showHelperDoc: true, // 是否显示帮助
  showNotification: true, // 是否显示通知
  openWatermark: true, // 是否开启水印功能
  openBuryPoint: false, // 是否开启埋点
} as IConfig;
