/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 13:02:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-02-06 13:29:44
 */
import React, { Suspense } from 'react';
import { Router, Switch, Route, Redirect, matchPath } from 'react-router-dom';
import { t } from '@/locale';
import { getToken } from '@/utils/cookies';
import config from '@/config';
import type { IRoute } from '@/utils/types';

import PrivateRoute from '@/router/PrivateRoute';
import ErrorBoundary from '@/pages/errorBoundary';

// 访问白名单
export const whiteList: string[] = ['/login', '/public'];

// 权限白名单
export const whiteAuth: string[] = [
  '/home',
  '/iframe',
  '/subview',
  '/redirect',
  '/404',
  `/${config.system}`,
];

// 登录判断
const isLogin = (): boolean => {
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

// 设置 DocTitle
export const setDocumentTitle = (title?: string) => {
  if (!config.powerByMicro) {
    document.title = t('app.global.title') + (title ? `-${title}` : '');
  }
};

export const renderRoutes = (routes: IRoute[] = [], extraProps = {}, switchProps = {}) => {
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
              setDocumentTitle(route.meta?.title);
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

export const matchRoutes = (
  routes: IRoute[],
  pathname: string,
  branch: Array<{ route: IRoute; match: string }> = []
) => {
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
