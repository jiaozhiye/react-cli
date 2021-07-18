/*
 * @Author: 焦质晔
 * @Date: 2021-07-18 19:57:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-18 22:17:55
 */
import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { connect } from 'react-redux';

export default (WrappedComponent): any => {
  class C extends Component<any> {
    static displayName = `Dict(${WrappedComponent.displayName || WrappedComponent.name})`;

    createDictList = () => {};

    createDictText = () => {};

    render() {
      return (
        <WrappedComponent
          {...this.props}
          createDictList={this.createDictList}
          createDictText={this.createDictText}
        />
      );
    }
  }

  return connect((state: any) => ({ dict: state.app.dict }), {})(hoistStatics(C, WrappedComponent));
};
