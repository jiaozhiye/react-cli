/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 21:38:08
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-09-02 09:43:36
 */
import { lazy } from 'react';

export default {
  // webpackChunkName -> webpack 在打包编译时，生成的文件路径(名)，格式：模块名称/用例名称 service/spt1001
  routes: [
    {
      path: '/spa1001',
      meta: { keepAlive: true },
      component: lazy(() => import(/* webpackChunkName: "test/demo" */ '@test/pages/demo')),
      // iframePath: 'http://localhost:9021/iframe/spa1001',
    },
    {
      path: '/spa1002',
      meta: { keepAlive: true },
      component: lazy(() => import(/* webpackChunkName: "test/spa1001" */ '@test/pages/spa1001')),
    },
    {
      path: '/spa1003',
      meta: { keepAlive: true },
      component: lazy(() => import(/* webpackChunkName: "test/spa1002" */ '@test/pages/spa1002')),
    },
    {
      path: '/subview/a',
      meta: { keepAlive: true, title: '子用例' },
      exact: true,
      component: lazy(() => import(/* webpackChunkName: "test/demo" */ '@test/pages/demo')),
    },
    {
      path: '/test',
      meta: { title: '测试页面', keepAlive: true },
      component: lazy(() => import(/* webpackChunkName: "test/demo" */ '@test/pages/demo')),
    },
    // {
    //   path: '/a/b/c',
    //   meta: { keepAlive: true, noAuth: true, title: '白名单用例' },
    //   component: lazy(() => import(/* webpackChunkName: "test/spa1001" */ '@test/pages/spa1001')),
    // },
  ],
  public: [],
};
