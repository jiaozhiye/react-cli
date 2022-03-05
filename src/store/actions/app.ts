/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 15:58:50
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-05 17:41:49
 */
import {
  SIDE_MENU,
  DICT_DATA,
  STAR_MENU,
  TAB_MENU,
  IFRAME_MENU,
  COMP_SIZE,
  LOCALE_LANG,
  THEME_COLOR,
  THEME_TYPE,
  SIGN_IN,
  SIGN_OUT,
  DEVICE,
} from '../types';
import { getMenuList, getDictList, getStarMenuList } from '@/api/application';
import { getToken, removeToken } from '@/utils/cookies';
import { t } from '@/locale';
import routes from '@/router/config';
import localDict from '@/utils/localDict';
import { Dictionary } from '@/utils/types';
import { ISideMenu } from '@/store/reducers/app';

const defaultMenuList: Array<ISideMenu & { hideInMenu: boolean }> = [
  { title: t('app.global.dashboard'), key: '/home', hideInMenu: true },
];

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

    let data: Array<ISideMenu & { hideInMenu: boolean }> = [];
    if (process.env.MOCK_DATA === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const res = require('@/mock/sideMenu').default;
      data = res;
    } else {
      try {
        const res: any = await getMenuList({});
        if (res.code === 200) {
          data = Array.isArray(res.data) && res.data.length ? res.data : defaultMenuList;
        }
      } catch (err) {
        return false;
      }
    }

    dispatch({
      type: SIDE_MENU,
      payload: data,
    });

    // 设置路由 meta 信息
    const {
      app: { flattenMenus },
    } = getState();
    const { routes: mRoutes } = routes.find((k) => k.path === '/');
    flattenMenus.forEach((x) => {
      const item = mRoutes.find((k) => k.path === x.key);
      if (item) {
        item.meta = Object.assign({}, item.meta, { title: x.title });
      }
    });

    return true;
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

    const lastToken = JSON.parse(localStorage.getItem('dict') as string)?._t ?? '';
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
          ...res.data.dict,
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
export const setStarMenu = (payload) => ({ type: STAR_MENU, payload });

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
    const { pathname, search } = window.location;
    setTimeout(() => (window.location.href = '/login?redirect=' + pathname + search), 400);
  };

// 登录
export const createSignIn = (payload) => ({ type: SIGN_IN, payload });

// 设置顶部选项卡导航
export const createTabMenu = (payload, behavior) => ({ type: TAB_MENU, payload, behavior });

// 设置 iframe 导航
export const createIframeMenu = (payload, behavior) => ({ type: IFRAME_MENU, payload, behavior });

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
