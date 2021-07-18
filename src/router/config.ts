/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:40:32
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-18 15:09:17
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
