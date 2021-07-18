/*
 * @Author: 焦质晔
 * @Date: 2021-07-18 19:57:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-18 21:27:32
 */
import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { connect } from 'react-redux';

export default (WrappedComponent): any => {
  @connect((state: any) => ({ dict: state.app.dict }), {})
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

  return hoistStatics(C, WrappedComponent);
};
