/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 21:38:08
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-07 15:51:50
 */
import { lazy } from 'react';

export default {
  // webpackChunkName -> webpack 在打包编译时，生成的文件路径(名)，格式：模块名称/用例名称 service/spt1001
  routes: [
    {
      path: '/bjgl/cggl/dd',
      meta: { keepAlive: true },
      component: lazy(() => import(/* webpackChunkName: "test/demo" */ '@test/pages/demo')),
    },
    {
      path: '/test',
      meta: { title: '测试页面', keepAlive: true },
      component: lazy(() => import(/* webpackChunkName: "test/demo" */ '@test/pages/demo')),
    },
  ],
  public: [],
};
