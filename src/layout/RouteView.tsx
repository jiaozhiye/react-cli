/*
 * @Author: 焦质晔
 * @Date: 2022-05-19 16:20:53
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-27 10:48:41
 */
import React from 'react';
import { renderRoutes } from '../router';

type IProps = {
  routes: any[];
};

class RouteView extends React.Component<IProps> {
  private _value: number = this.props.routes.length;

  shouldComponentUpdate(nextProps) {
    const current: number = nextProps.routes.length;
    if (current !== this._value) {
      this._value = current;
      return true;
    }
    return false;
  }

  render() {
    return <>{renderRoutes(this.props.routes)}</>;
  }
}

export default RouteView;
