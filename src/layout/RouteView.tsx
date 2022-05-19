/*
 * @Author: 焦质晔
 * @Date: 2022-05-19 16:20:53
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-19 16:28:03
 */
import React from 'react';
import { renderRoutes } from '../router';

type IProps = {
  routes: any[];
};

class RouteView extends React.PureComponent<IProps> {
  render() {
    return <>{renderRoutes(this.props.routes)}</>;
  }
}

export default RouteView;
