/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 15:58:50
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-15 22:05:06
 */
import { SIDE_MENU, TAB_MENU, COMP_SIZE, LOCALE_LANG, THEME_COLOR, THEME_TYPE } from '../types';
import { getNavList, getAllDict } from '@/api/application';
import { t } from '@/locale';
import routes from '@/router/config';

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

// 设置顶部选项卡导航
export const createTabMenu = (payload, behavior) => ({ type: TAB_MENU, payload, behavior });

// 设置尺寸
export const createComponentSize = (payload) => ({ type: COMP_SIZE, payload });

// 设置多语言
export const createLocaleLang = (payload) => ({ type: LOCALE_LANG, payload });

// 设置主题颜色
export const createThemeColor = (payload) => ({ type: THEME_COLOR, payload });

// 设置主题模式
export const createThemeType = (payload) => ({ type: THEME_TYPE, payload });
