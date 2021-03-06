/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 15:52:33
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-07-23 10:21:56
 */
import {
  SIDE_MENU,
  DICT_DATA,
  AUTH_DATA,
  STAR_MENU,
  TAB_MENU,
  IFRAME_MENU,
  MICRO_MENU,
  COMP_SIZE,
  LOCALE_LANG,
  THEME_COLOR,
  THEME_TYPE,
  SIGN_IN,
  SIGN_OUT,
  DEVICE,
} from '../types';
import { t } from '@/locale';
import config from '@/config';
import routes, { getLocalRoutes } from '@/router/config';
import type { ComponentSize, Device, Dictionary, ThemeType } from '@/utils/types';

export type ISideMenu = {
  key: string;
  title: string;
  id?: string;
  icon?: string;
  hideInMenu?: boolean;
  caseHref?: string;
  children?: Array<ISideMenu>;
};

export type ITabNav = {
  path: string;
  title: string;
  search?: string;
};

export type ICacheMenu = {
  key: string;
  value: string;
  search?: string;
};

export type IRoute = any;

type IState = {
  size: ComponentSize;
  lang: string;
  device: Device;
  themeType: ThemeType;
  themeColor: string;
  isReady: boolean;
  sideMenus: ISideMenu[];
  starMenus: ISideMenu[];
  tabMenus: ITabNav[];
  flattenMenus: Omit<ISideMenu, 'children'>[];
  iframeMenus: ICacheMenu[];
  microMenus: ICacheMenu[];
  keepAliveList: ICacheMenu[];
  dict: Record<string, Dictionary[]>;
  auth: Record<string, string[]>;
  loginInfo: Record<string, string>;
};

export type AppState = {
  app: IState;
};

const createFlattenMenus = <T extends ISideMenu>(list: T[]): T[] => {
  const res: T[] = [];
  list.forEach((x) => {
    if (Array.isArray(x.children)) {
      res.push(...createFlattenMenus(x.children as T[]));
    } else {
      res.push(x);
    }
  });
  return res;
};

const setRouteMeta = <T extends ISideMenu>(list: T[]) => {
  const subRoutes: IRoute[] = routes.find((k) => k.path === '/').routes;
  const localRoutes: IRoute[] = getLocalRoutes();
  const mainAppRoutes: IRoute[] = []; // 主应用路由表
  if (config.isMainApp) {
    for (let i = 0; i < subRoutes.length; i++) {
      if (subRoutes[i].dynamic) {
        subRoutes.splice(i, 1);
        i = i - 1;
      }
    }
    localRoutes.forEach((x) => {
      if (x.meta.noAuth && x.meta.title) {
        mainAppRoutes.push(x);
      }
    });
  }
  list.forEach((x) => {
    const _routes = config.isMainApp ? localRoutes : subRoutes;
    const route = _routes.find((k) => k.path === x.key.replace(/\?.*/, ''));
    if (route) {
      Object.assign(route.meta, { title: x.title });
    }
    if (config.isMainApp && route) {
      mainAppRoutes.push(route);
    }
    if (!route && x.caseHref) {
      subRoutes.splice(-3, 0, {
        path: x.key,
        meta: { keepAlive: true, title: x.title },
        iframePath: x.caseHref,
        dynamic: true,
        component: () => null,
      });
    }
  });
  if (config.isMainApp) {
    subRoutes.splice(-3, 0, ...mainAppRoutes.map((x) => ({ ...x, dynamic: true })));
    // 修正兜底路由
    subRoutes[subRoutes.length - 1].redirect = '/404';
  }
};

/**
 * 初始化 state
 */
const initState: IState = {
  size: (localStorage.getItem('size') || config.size) as ComponentSize, // 组件尺寸
  lang: localStorage.getItem('lang') || config.lang, // 多语言
  device: 'desktop', // 设备类型
  themeType: config.themeType, // 主题模式
  themeColor: process.env.THEME_COLOR || '', // 主题颜色
  isReady: false, // 是否完成菜单的加载
  sideMenus: [], // 侧栏菜单数据
  starMenus: [], // 收藏菜单
  tabMenus: [{ path: '/home', title: t('app.global.dashboard') }], // 顶部选项卡菜单数据
  flattenMenus: [], // 展平后的三级菜单列表
  iframeMenus: [], // iframe 列表
  microMenus: [], // qiankun 列表
  keepAliveList: [], // 路由组件缓存列表
  dict: {}, // 数据字典
  auth: {}, // 按钮权限
  loginInfo: {}, // 用户登录信息
};

// 设置导航菜单
const setSideMenus = (state, payload) => {
  const flattenMenus = createFlattenMenus(payload);
  setRouteMeta(flattenMenus);
  return Object.assign({}, state, {
    isReady: true,
    sideMenus: payload,
    flattenMenus,
  });
};

const addTabMenu = <T extends ITabNav>(tabMenus: T[], data: T) => {
  const target = tabMenus.find((x) => x.path === data.path);
  if (!target) {
    return [...tabMenus, data];
  }
  if (data.search) {
    Object.assign(target, data);
  } else {
    delete target.search;
  }
  return [...tabMenus];
};

// 设置顶部选项卡导航
const setTabMenus = (state, payload, behavior) => {
  return Object.assign({}, state, {
    tabMenus:
      behavior === 'add'
        ? addTabMenu(state.tabMenus, payload)
        : state.tabMenus.filter((x) => x.path !== payload),
  });
};

const addIframeMenu = <T extends ICacheMenu>(iframeMenus: T[], data: T) => {
  const target = iframeMenus.find((x) => x.key === data.key);
  if (!target) {
    return [...iframeMenus, data];
  }
  if (target.value !== data.value) {
    target.value = data.value;
  }
  return [...iframeMenus];
};

// 设置 iframe 导航
const setIframeMenus = (state, payload, behavior) => {
  return Object.assign({}, state, {
    iframeMenus:
      behavior === 'add'
        ? addIframeMenu(state.iframeMenus, payload)
        : state.iframeMenus.filter((x) => x.key !== payload),
  });
};

const addMicroMenu = <T extends ICacheMenu>(microMenus: T[], data: T) => {
  const target = microMenus.find((x) => x.key === data.key);
  if (!target) {
    return [...microMenus, data];
  }
  if (data.search) {
    Object.assign(target, data);
  } else {
    delete target.search;
  }
  return [...microMenus];
};

// 设置 micro 导航
const setMicroMenus = (state, payload, behavior) => {
  return Object.assign({}, state, {
    microMenus:
      behavior === 'add'
        ? addMicroMenu(state.microMenus, payload)
        : state.microMenus.filter((x) => x.key !== payload),
  });
};

// 设置数据字典
const setDictData = (state, payload) => {
  return Object.assign({}, state, {
    dict: payload,
  });
};

// 设置数据字典
const setAuthData = (state, payload) => {
  return Object.assign({}, state, {
    auth: payload,
  });
};

// 设置搜藏菜单
const setStarMenus = (state, payload) => {
  return Object.assign({}, state, {
    starMenus: payload,
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

// 设置设备类型
const setDeviceType = (state, payload) => {
  return Object.assign({}, state, {
    device: payload,
  });
};

// 登录
const setSignIn = (state, payload) => {
  return Object.assign({}, state, {
    loginInfo: payload,
  });
};

// 退出登录
const setSignOut = (state, payload) => {
  return Object.assign({}, state, {
    loginInfo: payload || {},
  });
};

// 必须要给 state 参数默认赋值 initState
export const appReducer = (state = initState, action) => {
  switch (action.type) {
    case SIDE_MENU:
      return setSideMenus(state, action.payload);
    case DICT_DATA:
      return setDictData(state, action.payload);
    case AUTH_DATA:
      return setAuthData(state, action.payload);
    case STAR_MENU:
      return setStarMenus(state, action.payload);
    case TAB_MENU:
      return setTabMenus(state, action.payload, action.behavior);
    case IFRAME_MENU:
      return setIframeMenus(state, action.payload, action.behavior);
    case MICRO_MENU:
      return setMicroMenus(state, action.payload, action.behavior);
    case COMP_SIZE:
      return setComponentSize(state, action.payload);
    case LOCALE_LANG:
      return setLocaleLang(state, action.payload);
    case THEME_COLOR:
      return setThemeColor(state, action.payload);
    case THEME_TYPE:
      return setThemeType(state, action.payload);
    case DEVICE:
      return setDeviceType(state, action.payload);
    case SIGN_IN:
      return setSignIn(state, action.payload);
    case SIGN_OUT:
      return setSignOut(state, action.payload);
    default:
      return state;
  }
};
