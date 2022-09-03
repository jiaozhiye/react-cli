/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 13:02:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-09-02 09:16:54
 */
import React, { Suspense } from 'react';
import { Router, Switch, Route, Redirect, matchPath } from 'react-router-dom';
import { t } from '@/locale';
import { getToken } from '@/utils/cookies';
import config from '@/config';

import PrivateRoute from '@/router/PrivateRoute';
import ErrorBoundary from '@/pages/errorBoundary';

// 访问白名单
const whiteList: string[] = ['/login', '/public'];

// 权限白名单
const whiteAuth: string[] = [
  '/home',
  '/iframe',
  '/subview',
  `/${config.system}`,
  '/redirect',
  '/404',
  '/test',
];

// 登录判断
export const isLogin = (): boolean => {
  if (process.env.MOCK_DATA === 'true') {
    return true;
  } else {
    return !!getToken();
  }
};

// iframe 判断
export const isIframe = (path: string): boolean => {
  return path.startsWith(whiteAuth[1]);
};

export const renderRoutes = (routes: any[] = [], extraProps = {}, switchProps = {}) => {
  return (
    <Suspense fallback={null}>
      <Switch {...switchProps}>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={(props) => {
              const { path, redirect } = route;
              // for qiankun micro-app
              if (!config.powerByMicro) {
                document.title = `${t('app.global.title')}-${route.meta?.title || '404'}`;
              }
              if (isLogin()) {
                // 跳转首页
                if (path === whiteList[0]) {
                  return <Redirect to={whiteAuth[0]} />;
                }
                // 重定向
                if (redirect) {
                  return <Redirect to={redirect} />;
                }
                // 鉴权
                return (
                  <PrivateRoute
                    route={route}
                    whiteList={whiteList}
                    whiteAuth={whiteAuth}
                    render-props={() => {
                      return (
                        <ErrorBoundary>
                          {route.render ? (
                            route.render({ ...props, ...extraProps, route })
                          ) : (
                            <route.component {...props} {...extraProps} route={route} />
                          )}
                        </ErrorBoundary>
                      );
                    }}
                  />
                );
              } else {
                if (path !== whiteList[0]) {
                  return <Redirect to={whiteList[0]} />;
                }
                return <route.component {...props} />;
              }
            }}
          />
        ))}
      </Switch>
    </Suspense>
  );
};

export const matchRoutes = (routes, pathname, branch: any[] = []) => {
  routes.some((route) => {
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length
      ? branch[branch.length - 1].match // use parent match
      : Router.computeRootMatch(pathname); // use default "root" match
    if (match) {
      branch.push({ route, match });
      if (route.routes) {
        matchRoutes(route.routes, pathname, branch);
      }
    }
    return match;
  });
  return branch;
};
