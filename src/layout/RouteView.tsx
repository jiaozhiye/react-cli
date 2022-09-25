/*
 * @Author: 焦质晔
 * @Date: 2022-05-19 16:20:53
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-09-25 20:10:56
 */
import React from 'react';
import { isEqual } from 'lodash-es';
import { renderRoutes } from '../router';
import type { IRoute } from '@/utils/types';

type IProps = {
  routes: IRoute[];
};

class RouteView extends React.Component<IProps> {
  getSimpleRoutes(routes) {
    return routes.map((x) => ({ path: x.path, meta: x.meta }));
  }

  private _routes = this.getSimpleRoutes(this.props.routes);

  shouldComponentUpdate(nextProps: IProps) {
    const newRoutes = this.getSimpleRoutes(nextProps.routes);
    if (!isEqual(newRoutes, this._routes)) {
      this._routes = newRoutes;
      return true;
    }
    return false;
  }

  render() {
    return <>{renderRoutes(this.props.routes)}</>;
  }
}

export default RouteView;
