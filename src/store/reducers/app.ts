/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 15:52:33
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-06-24 21:45:22
 */
import {
  SIDE_MENU,
  DICT_DATA,
  AUTH_DATA,
  STAR_MENU,
  TAB_MENU,
  MICRO_STATE,
  IFRAME_MENU,
  MICRO_MENU,
  PREVENT_TAB,
  COMP_SIZE,
  LOCALE_LANG,
  THEME_COLOR,
  THEME_TYPE,
  SIGN_IN,
  SIGN_OUT,
  DEVICE,
} from '../types';
import { t } from '@/locale';
import { getPathName } from '@/utils';
import { matchRoutes, setDocumentTitle } from '@/router';
import config from '@/config';
import routes from '@/router/config';
import type { ComponentSize, Device, Dictionary, IRoute, Language, ThemeType } from '@/utils/types';

export type ISideMenu = {
  key: string;
  title: string;
  id?: string;
  icon?: string;
  keepAlive?: boolean;
  hideInMenu?: boolean;
  microHost?: string;
  caseHref?: string;
  children?: Array<ISideMenu>;
};

export type ITabNav = {
  path: string;
  title: string;
  from?: string;
  search?: string;
};

export type IPreventTab = {
  path: string;
  message?: string;
};

export type ICacheMenu = {
  key: string;
  value: string;
  keep?: boolean;
  search?: string;
};

type IState = {
  size: ComponentSize;
  lang: Language;
  device: Device;
  themeType: ThemeType;
  themeColor: string;
  navLoaded: boolean;
  microAppReady: boolean;
  sideMenus: ISideMenu[];
  starMenus: ISideMenu[];
  tabMenus: ITabNav[];
  flattenMenus: Omit<ISideMenu, 'children'>[];
  iframeMenus: ICacheMenu[];
  microMenus: ICacheMenu[];
  keepAliveList: ICacheMenu[];
  preventTabs: IPreventTab[];
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
  const subRoutes: IRoute[] = routes.find((k) => k.path === '/')!.routes!;
  const mainAppRoutes: IRoute[] = []; // 主应用路由表
  if (config.isMainApp) {
    for (let i = 0; i < subRoutes.length; i++) {
      if (subRoutes[i].dynamic) {
        subRoutes.splice(i, 1);
        i = i - 1;
      }
    }
  }
  list.forEach((x) => {
    const route = subRoutes.find((k) => k.path === getPathName(x.key));
    if (route) {
      route.meta
        ? Object.assign(route.meta, { title: x.title })
        : (route.meta = { title: x.title });
    }
    if (config.isMainApp) {
      const path = x.key.replace(/\?.*/, '');
      const host = x.microHost || '';
      if (path) {
        mainAppRoutes.push({
          path,
          exact: true,
          meta: { title: x.title, keepAlive: x.keepAlive },
          ...(x.caseHref || config.microType === 'iframe'
            ? {
                iframePath: x.caseHref || host.slice(0, -1) + x.key.replace(/^\/[^/]+/, '/iframe'),
              }
            : {
                iframePath: ``, // iframePath 与 microHost、microRule 不共存
                microHost: host,
                microRule: path,
              }),
          component: () => null, // 重要
        });
      }
    }
  });
  if (config.isMainApp) {
    subRoutes.splice(-3, 0, ...mainAppRoutes.map((x) => ({ ...x, dynamic: true })));
    // 修正兜底路由
    subRoutes[subRoutes.length - 1].redirect = '/404';
  }
};

const getLocalTabMenus = () => {
  const localTabNav = localStorage.getItem('tab_menus');
  let result: ITabNav[] = [];
  if (localTabNav) {
    try {
      result = JSON.parse(localTabNav);
    } catch (err) {
      // ...
    }
  }
  return result;
};

const setLocalTabMenus = (tabMenus: ITabNav[]) => {
  localStorage.setItem('tab_menus', JSON.stringify(tabMenus));
};

/**
 * 初始化 state
 */
const initState: IState = {
  size: (localStorage.getItem('size') || config.size) as ComponentSize, // 组件尺寸
  lang: (localStorage.getItem('lang') || config.lang) as Language, // 多语言
  device: 'desktop', // 设备类型
  themeType: config.themeType, // 主题模式
  themeColor: process.env.THEME_COLOR || '', // 主题颜色
  navLoaded: false, // 是否完成菜单的加载
  microAppReady: true, // 微应用加载状态
  sideMenus: [], // 侧栏菜单数据
  starMenus: [], // 收藏菜单
  tabMenus: [{ path: '/home', title: t('app.global.dashboard') }], // 顶部选项卡菜单数据
  flattenMenus: [], // 展平后的三级菜单列表
  iframeMenus: [], // iframe 列表
  microMenus: [], // qiankun 列表
  keepAliveList: [], // 路由组件缓存列表
  preventTabs: [], // 不允许关闭的页签列表
  dict: {}, // 数据字典
  auth: {}, // 按钮权限
  loginInfo: {}, // 用户登录信息
};

// 设置导航菜单
const setSideMenus = (state: IState, payload) => {
  const flattenMenus = createFlattenMenus(payload);
  setRouteMeta([{ key: '/home', title: t('app.global.home') }, ...flattenMenus]);
  // 初始化 tabMenus
  const tabMenus: ITabNav[] = [{ path: '/home', title: t('app.global.dashboard') }];
  getLocalTabMenus().forEach((x) => {
    const menuItem = flattenMenus.find((k) => getPathName(k.key) === x.path);
    if (menuItem) {
      tabMenus.push(Object.assign(x, { title: menuItem.title }));
    }
  });
  setLocalTabMenus(tabMenus);
  // 重置 DocTitle
  const { route } = matchRoutes(routes, window.location.pathname).pop()!;
  setDocumentTitle(route.meta?.title);
  return Object.assign({}, state, {
    navLoaded: true,
    sideMenus: payload,
    flattenMenus,
    tabMenus,
  });
};

const addTabMenu = <T extends ITabNav>(tabMenus: T[], data: T) => {
  const target = tabMenus.find((x) => x.path === data.path);
  if (!target) {
    const v = tabMenus.findIndex((x) => x.path === data.from);
    if (v !== -1) {
      tabMenus.splice(v + 1, 0, data);
    } else {
      tabMenus.push(data);
    }
    return [...tabMenus];
  }
  if (data.search) {
    Object.assign(target, data);
  } else {
    delete target.search;
  }
  return [...tabMenus];
};

// 设置顶部选项卡导航
const setTabMenus = (state: IState, payload, behavior) => {
  const results: ITabNav[] =
    behavior === 'add'
      ? addTabMenu(state.tabMenus, payload)
      : state.tabMenus.filter((x) => x.path !== payload);
  setLocalTabMenus(results);
  return Object.assign({}, state, {
    tabMenus: results,
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
const setIframeMenus = (state: IState, payload, behavior) => {
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
const setMicroMenus = (state: IState, payload, behavior) => {
  return Object.assign({}, state, {
    microMenus:
      behavior === 'add'
        ? addMicroMenu(state.microMenus, payload)
        : state.microMenus.filter((x) => x.key !== payload),
  });
};

const addPreventTab = <T extends IPreventTab>(preventTabs: T[], data: T) => {
  const target = preventTabs.find((x) => x.path === data.path);
  if (!target) {
    return [...preventTabs, data];
  }
  if (data.message) {
    Object.assign(target, data);
  }
  return [...preventTabs];
};

// 设置阻止关闭选项卡
const setPreventTabs = (state: IState, payload, behavior) => {
  return Object.assign({}, state, {
    preventTabs:
      behavior === 'add'
        ? addPreventTab(state.preventTabs, payload)
        : state.preventTabs.filter((x) => x.path !== payload),
  });
};

// 设置子应用加载状态
const setMicroState = (state: IState, payload) => {
  return Object.assign({}, state, {
    microAppReady: payload,
  });
};

// 设置数据字典
const setDictData = (state: IState, payload) => {
  return Object.assign({}, state, {
    dict: payload,
  });
};

// 设置数据字典
const setAuthData = (state: IState, payload) => {
  return Object.assign({}, state, {
    auth: payload,
  });
};

// 设置收藏菜单
const setStarMenus = (state: IState, payload) => {
  return Object.assign({}, state, {
    starMenus: payload,
  });
};

// 设置尺寸
const setComponentSize = (state: IState, payload) => {
  return Object.assign({}, state, {
    size: payload,
  });
};

// 设置多语言
const setLocaleLang = (state: IState, payload) => {
  return Object.assign({}, state, {
    lang: payload,
  });
};

// 设置主题颜色
const setThemeColor = (state: IState, payload) => {
  return Object.assign({}, state, {
    themeColor: payload,
  });
};

// 设置主题模式
const setThemeType = (state: IState, payload) => {
  return Object.assign({}, state, {
    themeType: payload,
  });
};

// 设置设备类型
const setDeviceType = (state: IState, payload) => {
  return Object.assign({}, state, {
    device: payload,
  });
};

// 登录
const setSignIn = (state: IState, payload) => {
  return Object.assign({}, state, {
    loginInfo: payload,
  });
};

// 退出登录
const setSignOut = (state: IState, payload) => {
  return Object.assign({}, state, {
    loginInfo: payload || {},
  });
};

// 必须要给 state 参数默认赋值 initState
export const appReducer = (state: IState = initState, action) => {
  switch (action.type) {
    case SIDE_MENU:
      return setSideMenus(state, action.payload);
    case DICT_DATA:
      return setDictData(state, action.payload);
    case AUTH_DATA:
      return setAuthData(state, action.payload);
    case STAR_MENU:
      return setStarMenus(state, action.payload);
    case MICRO_STATE:
      return setMicroState(state, action.payload);
    case TAB_MENU:
      return setTabMenus(state, action.payload, action.behavior);
    case IFRAME_MENU:
      return setIframeMenus(state, action.payload, action.behavior);
    case MICRO_MENU:
      return setMicroMenus(state, action.payload, action.behavior);
    case PREVENT_TAB:
      return setPreventTabs(state, action.payload, action.behavior);
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
