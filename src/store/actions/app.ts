/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 15:58:50
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-06-30 08:55:51
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
import {
  getMenuList,
  getDictList,
  getAuthList,
  getStarMenuList,
  setStarMenuList,
} from '@/api/application';
import { getToken, removeToken } from '@/utils/cookies';
import { t } from '@/locale';
import localDict from '@/utils/localDict';
import config from '@/config';

import type { Dictionary } from '@/utils/types';
import type { ISideMenu } from '@/store/reducers/app';

const defaultMenuList: Array<ISideMenu & { hideInMenu: boolean }> = [
  { title: t('app.global.dashboard'), key: '/home', hideInMenu: true },
];

const createMenuPath = (item) => {
  const { appCode, caseCode } = item;
  if (config.isMainApp) {
    return appCode && caseCode ? `/${appCode}/${caseCode}` : '';
  }
  return caseCode ? `/${caseCode}` : '';
};

const formateMenus = (list): ISideMenu[] => {
  return list.map((x) => {
    const item: ISideMenu = {
      id: x.id,
      key: createMenuPath(x),
      title: x.title,
      icon: x.icon,
      hideInMenu: !!x.hidden,
      caseHref: x.caseHref,
    };
    if (Array.isArray(x.children)) {
      item.children = formateMenus(x.children);
    }
    return item;
  });
};

// 设置导航菜单
export const createMenuList =
  () =>
  async (dispatch, getState): Promise<boolean> => {
    const {
      app: { sideMenus },
    } = getState();

    if (sideMenus.length) {
      return true;
    }

    let status = true;
    let data: Array<ISideMenu & { hideInMenu: boolean }> = defaultMenuList;

    if (process.env.MOCK_DATA === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const res = require('@/mock/sideMenu').default;
      data = res;
    } else {
      try {
        const res: any = await getMenuList({});
        if (res.code === 200) {
          if (Array.isArray(res.data) && res.data?.length) {
            data = res.data;
          }
        } else {
          status = false;
        }
      } catch (err) {
        status = false;
      }
    }

    dispatch({
      type: SIDE_MENU,
      payload: formateMenus(data),
    });

    return status;
  };

// 设置数据字典
export const createDictData =
  () =>
  async (dispatch, getState): Promise<void> => {
    const {
      app: { dict },
    } = getState();

    if (Object.keys(dict).length) {
      return;
    }

    const lastToken = JSON.parse(localStorage.getItem('dict') as string)?._t;
    if (getToken() === lastToken) return;
    // 数据
    let data: Record<string, Array<Dictionary> | string> = {};
    if (process.env.MOCK_DATA === 'true') {
      data = { _t: getToken(), ...localDict };
    } else {
      const res: any = await getDictList({});
      if (res.code === 200) {
        // 数据字典规则：如果有重复的 Code，服务端覆盖客户端
        data = {
          _t: getToken(),
          ...localDict,
          ...res.data,
        };
      }
    }
    // 数据字典本地存储
    localStorage.setItem('dict', JSON.stringify(data));

    dispatch({
      type: DICT_DATA,
      payload: data,
    });
  };

// 设置功能权限
export const createAuthData =
  () =>
  async (dispatch, getState): Promise<void> => {
    const {
      app: { auth },
    } = getState();

    if (Object.keys(auth).length) {
      return;
    }

    const lastToken = JSON.parse(localStorage.getItem('auth') as string)?._t;
    if (getToken() === lastToken) return;
    // 数据
    let data: Record<string, string[] | string> = {};
    if (process.env.MOCK_DATA === 'true') {
      data = { _t: getToken() };
    } else {
      const res: any = await getAuthList({});
      if (res.code === 200) {
        // 数据字典规则：如果有重复的 Code，服务端覆盖客户端
        data = {
          _t: getToken(),
          ...res.data,
        };
      }
    }
    // 权限本地存储
    localStorage.setItem('auth', JSON.stringify(data));

    dispatch({
      type: AUTH_DATA,
      payload: data,
    });
  };

// 获取收藏菜单
export const createStarMenu =
  () =>
  async (dispatch, getState): Promise<void> => {
    const {
      app: { flattenMenus },
    } = getState();

    let data: ISideMenu[] = [];
    if (process.env.MOCK_DATA === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const res = require('@/mock/starMenu').default;
      data = res;
    } else {
      const res: any = await getStarMenuList({});
      if (res.code === 200) {
        data = res.data?.filter((x) => flattenMenus.some((k) => k.key === x.key)) ?? [];
      }
    }

    dispatch({
      type: STAR_MENU,
      payload: data,
    });
  };

// 设置收藏菜单
export const setStarMenu =
  (data: ISideMenu[]) =>
  async (dispatch, getState): Promise<void> => {
    if (config.showStarNav && process.env.MOCK_DATA === 'false') {
      await setStarMenuList({ starMenus: data });
    }
    dispatch({
      type: STAR_MENU,
      payload: data,
    });
  };

// 退出登录
export const createSignOut =
  () =>
  (dispatch, getState): void => {
    removeToken();
    dispatch({
      type: SIGN_OUT,
      payload: {},
    });
    // 刷新浏览器，释放内存
    setTimeout(() => window.parent.postMessage({ type: SIGN_OUT, data: '' }, '*'), 400);
  };

// 登录
export const createSignIn = (payload) => ({ type: SIGN_IN, payload });

// 设置顶部选项卡导航
export const createTabMenu = (payload, behavior) => ({ type: TAB_MENU, payload, behavior });

// 设置 iframe 导航
export const createIframeMenu = (payload, behavior) => ({ type: IFRAME_MENU, payload, behavior });

// 设置 micro 导航
export const createMicroMenu = (payload, behavior) => ({ type: MICRO_MENU, payload, behavior });

// 设置尺寸
export const createComponentSize = (payload) => ({ type: COMP_SIZE, payload });

// 设置多语言
export const createLocaleLang = (payload) => ({ type: LOCALE_LANG, payload });

// 设置主题颜色
export const createThemeColor = (payload) => ({ type: THEME_COLOR, payload });

// 设置主题模式
export const createThemeType = (payload) => ({ type: THEME_TYPE, payload });

// 设置设备类型
export const createDeviceType = (payload) => ({ type: DEVICE, payload });
