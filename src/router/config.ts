/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:40:32
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-24 21:00:41
 */
import { lazy } from 'react';
import { t } from '@/locale';
import config from '@/config';
import moduleRoutes from './routes';

const Login = lazy(() => import('@/modules/framework/pages/login'));
const Dashboard = lazy(() => import('@/modules/framework/pages/dashboard'));
const BasicLayout = lazy(() => import('@/layout/BasicLayout'));
const BlankLayout = lazy(() => import('@/layout/BlankLayout'));
const Nomatch = lazy(() => import('@/pages/nomatch'));
const Redirect = lazy(() => import('@/pages/redirect'));

export const getLocalRoutes = () => {
  let result: any[] = [];
  if (config.system === 'app') {
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

const routes = [
  {
    path: '/login',
    meta: { title: t('app.login.title') },
    component: Login,
  },
  ...moduleRoutes.map((x) => x.public).flat(),
  ...moduleRoutes
    .map((x) => x.routes)
    .flat()
    .map((x) => ({
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
      ...moduleRoutes
        .map((x) => x.routes)
        .flat()
        .map((x) => {
          if (config.useIframe || x.iframePath) {
            return {
              path: x.path,
              meta: { ...x.meta, iframe: x.iframePath || '/iframe' + x.path },
              iframePath: x.iframePath || '/iframe' + x.path,
              component: BlankLayout,
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
