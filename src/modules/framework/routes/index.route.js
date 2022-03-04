/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 21:38:08
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-04 09:05:04
 */
import { lazy } from 'react';

export default {
  // webpackChunkName -> webpack 在打包编译时，生成的文件路径(名)，格式：模块名称/用例名称 service/spt1001
  routes: [],
  public: [
    // 大屏
    // {
    //   path: '/large-screen/v1',
    //   meta: { title: '大屏系统', keepAlive: false },
    //   component: lazy(() =>
    //     import(/* webpackChunkName: "framework/bigScreen" */ '@framework/pages/bigScreen/index')
    //   ),
    // },
    // 大屏 END
  ],
};
