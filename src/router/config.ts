/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:40:32
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-27 10:58:15
 */
import { lazy } from 'react';
import { t } from '@/locale';
import config from '@/config';
import moduleRoutes from './routes';

import Redirect from '@/pages/redirect';

const Login = lazy(() => import('@/modules/framework/pages/login'));
const Dashboard = lazy(() => import('@/modules/framework/pages/dashboard'));
const BasicLayout = lazy(() => import('@/layout/BasicLayout'));
const BlankLayout = lazy(() => import('@/layout/BlankLayout'));
const Nomatch = lazy(() => import('@/pages/nomatch'));

const flattenRoutes = moduleRoutes.map((x) => x.routes).flat();

export const getLocalRoutes = () => {
  let result: any[] = [];
  if (config.isMainApp) {
    const localRoutes = localStorage.getItem('sub_routes');
    if (localRoutes) {
      try {
        result = JSON.parse(localRoutes).map((x) => ({
          ...x,
          component: BlankLayout,
        }));
      } catch (err) {
        // ...
      }
    }
  }
  return result;
};

const getMicroRoutes = () => {
  let result: any[] = [];
  // for qiankun
  if (window.__POWERED_BY_QIANKUN__) {
    result = flattenRoutes.map((x) => ({
      path: `/${config.system}` + x.path,
      meta: x.meta,
      props: x.props,
      component: x.component,
    }));
    result.push({
      path: `/${config.system}/*`,
      component: Nomatch,
    });
  }
  return result;
};

const routes = [
  {
    path: '/login',
    meta: { title: t('app.login.title') },
    component: Login,
  },
  ...moduleRoutes.map((x) => x.public).flat(),
  ...getMicroRoutes(),
  ...flattenRoutes.map((x) => ({
    path: '/iframe' + x.path,
    meta: x.meta,
    props: x.props,
    component: x.component,
  })),
  {
    path: '/iframe/*',
    component: Nomatch,
  },
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
        if (config.microType) {
          return {
            path: x.path,
            meta: x.meta,
            iframePath: x.iframePath
              ? x.iframePath
              : config.microType === 'iframe'
              ? `${config.baseRoute}/iframe${x.path}`
              : '',
            component: () => null,
          };
        }
        return x;
      }),
      ...getLocalRoutes(),
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
        redirect: '/404',
      },
    ],
  },
];

export default routes;
