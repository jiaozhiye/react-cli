/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:40:32
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-10-28 13:55:43
 */
import { lazy } from 'react';
import { t } from '@/locale';
import config from '@/config';
import moduleRoutes from './routes';
import type { IRoute } from '@/utils/types';

import Redirect from '@/pages/redirect';

const Login = lazy(() => import('@/modules/framework/pages/login'));
const Dashboard = lazy(() => import('@/modules/framework/pages/dashboard'));
const BasicLayout = lazy(() => import('@/layout/BasicLayout'));
const BlankLayout = lazy(() => import('@/layout/BlankLayout'));
const MicroLayout = lazy(() => import('@/layout/MicroLayout'));
const Nomatch = lazy(() => import('@/pages/nomatch'));

const flattenRoutes = moduleRoutes.map((x) => x.routes).flat();

export const getSubRoutes = () => {
  let result: IRoute[] = [];
  if (config.isMainApp) {
    result = routes.find((k) => k.path === '/')!.routes!.filter((x) => x.dynamic);
  }
  return result;
};

const getMicroRoutes = () => {
  let result: IRoute[] = [];
  // for qiankun micro-app
  if (config.powerByMicro) {
    result = flattenRoutes.map((x) => {
      const _route: IRoute = {
        path: `/${config.system}` + x.path,
        meta: x.meta,
        exact: x.exact,
        props: x.props,
        component: x.component,
      };
      return Object.assign(
        _route,
        x.iframePath ? { iframePath: x.iframePath, component: MicroLayout } : null
      );
    });
    result.push({
      path: `/${config.system}/*`,
      component: Nomatch,
    });
    result.push({
      path: '/404',
      component: Nomatch,
    });
  }
  return result;
};

const getIframeRoutes = () => {
  let result: IRoute[] = [];
  result = flattenRoutes.map((x) => ({
    path: '/iframe' + x.path,
    meta: x.meta,
    exact: x.exact,
    props: x.props,
    component: x.component,
  }));
  result.push({
    path: '/iframe/*',
    component: Nomatch,
  });
  return result;
};

// subView 判断
const isSubView = (path = ''): boolean => {
  return path.startsWith('/subview');
};

const routes: IRoute[] = [
  {
    path: '/login',
    meta: { title: t('app.login.title') },
    component: Login,
  },
  ...moduleRoutes.map((x) => x.public).flat(),
  ...getMicroRoutes(),
  ...getIframeRoutes(),
  {
    path: '/',
    meta: { title: t('app.global.home') },
    component: BasicLayout,
    routes: [
      {
        path: '/',
        exact: true,
        redirect: '/home',
      },
      {
        path: '/home',
        meta: { title: t('app.global.dashboard'), bgColor: true, keepAlive: false },
        component: Dashboard,
      },
      ...flattenRoutes.map((x) => {
        if (x.iframePath || (config.microType && !isSubView(x.path))) {
          return {
            path: x.path,
            meta: x.meta,
            exact: x.exact,
            props: x.props,
            iframePath: x.iframePath
              ? x.iframePath
              : config.microType === 'iframe'
              ? `${config.baseRoute}/iframe${x.path}`
              : '',
            component: BlankLayout,
          };
        }
        return x;
      }),
      {
        path: '/redirect/:path(.*)',
        component: Redirect,
      },
      {
        path: '/404',
        component: Nomatch,
      },
      {
        path: '*',
        redirect: !config.isMainApp ? '/404' : '',
      },
    ],
  },
];

export default routes;
