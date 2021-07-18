/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 15:58:50
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-17 07:28:41
 */
import {
  SIDE_MENU,
  DICT_DATA,
  TAB_MENU,
  IFRAME_MENU,
  COMP_SIZE,
  LOCALE_LANG,
  THEME_COLOR,
  THEME_TYPE,
} from '../types';
import { getNavList, getAllDict } from '@/api/application';
import { t } from '@/locale';
import routes from '@/router/config';
import localDict from '@/utils/localDict';
import { Dictionary } from '@/utils/types';

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

    let data = [{ title: t('app.global.dashboard'), key: '/home', hideInMenu: true }];
    if (process.env.MOCK_DATA === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const res = require('@/mock/sideMenu').default;
      data = res;
    } else {
      try {
        const res: any = await getNavList({});
        if (res.code === 200) {
          data = Array.isArray(res.data) && res.data.length ? res.data : data;
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

    // 每隔 24h 获取一次数据字典
    const lastTime: number = JSON.parse(localStorage.getItem('dict') as string)?._t ?? 0;
    if (+new Date() - lastTime < 24 * 3600 * 1000) return;
    // 数据
    let data: Record<string, Array<Dictionary> | number> = {};
    if (process.env.MOCK_DATA === 'true') {
      data = { _t: +new Date(), ...localDict };
    } else {
      const res: any = await getAllDict({});
      if (res.code === 200) {
        // 数据字典规则：如果有重复的 Code，服务端覆盖客户端
        data = {
          _t: +new Date(),
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
