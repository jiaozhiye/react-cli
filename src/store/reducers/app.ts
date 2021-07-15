/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 15:52:33
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-15 22:05:31
 */
import { uniqBy } from 'lodash-es';
import {
  SIDE_MENU,
  TAB_MENU,
  DICT_DATA,
  COMP_SIZE,
  LOCALE_LANG,
  THEME_COLOR,
  THEME_TYPE,
} from '../types';
import { t } from '@/locale';
import config from '@/config';
import { ComponentSize, Dictionary, ThemeType } from '@/utils/types';

type IState = {
  size: ComponentSize;
  lang: string;
  themeType: ThemeType;
  themeColor: string;
  sideMenus: any[];
  tabMenus: any[];
  flattenMenus: any[];
  dict: Record<string, Dictionary[] | number>;
};

const createFlattenMenus = (list: any[]) => {
  const res: any[] = [];
  list.forEach((x) => {
    if (Array.isArray(x.children)) {
      res.push(...createFlattenMenus(x.children));
    } else {
      res.push(x);
    }
  });
  return res;
};

/**
 * 初始化 state
 */
const initState: IState = {
  size: (localStorage.getItem('size') as ComponentSize) || config.size, // 组件尺寸
  lang: localStorage.getItem('lang') || config.lang, // 多语言
  themeType: (localStorage.getItem('theme_type') as ThemeType) || config.themeType, // 主题模式
  themeColor: localStorage.getItem('theme_color') || (process.env.THEME_COLOR as string), // 主题颜色
  sideMenus: [], // 侧栏菜单数据
  tabMenus: [{ path: '/home', title: t('app.global.dashboard') }], // 顶部选项卡菜单数据
  flattenMenus: [], // 战平后的三级菜单列表
  dict: {}, // 数据字典
};

// 设置导航菜单
const setSideMenus = (state, payload) => {
  return Object.assign({}, state, {
    sideMenus: payload,
    flattenMenus: createFlattenMenus(payload),
  });
};

// 设置顶部选项卡导航
const setTabMenus = (state, payload, behavior) => {
  return Object.assign({}, state, {
    tabMenus:
      behavior === 'add'
        ? uniqBy([...state.tabMenus, payload], 'path')
        : state.tabMenus.filter((x) => x.path !== payload),
  });
};

// 设置数据字典
const setDictData = (state, payload) => {
  return Object.assign({}, state, {
    dict: payload,
  });
};

// 设置尺寸
const setComponentSize = (state, payload) => {
  return Object.assign({}, state, {
    size: payload,
  });
};

// 设置多语言
const setLocaleLang = (state, payload) => {
  return Object.assign({}, state, {
    lang: payload,
  });
};

// 设置主题颜色
const setThemeColor = (state, payload) => {
  return Object.assign({}, state, {
    themeColor: payload,
  });
};

// 设置主题模式
const setThemeType = (state, payload) => {
  return Object.assign({}, state, {
    themeType: payload,
  });
};

// 必须要给 state 参数默认赋值 initState
export const appReducer = (state = initState, action) => {
  switch (action.type) {
    case SIDE_MENU:
      return setSideMenus(state, action.payload);
    case TAB_MENU:
      return setTabMenus(state, action.payload, action.behavior);
    case DICT_DATA:
      return setDictData(state, action.payload);
    case COMP_SIZE:
      return setComponentSize(state, action.payload);
    case LOCALE_LANG:
      return setLocaleLang(state, action.payload);
    case THEME_COLOR:
      return setThemeColor(state, action.payload);
    case THEME_TYPE:
      return setThemeType(state, action.payload);
    default:
      return state;
  }
};
