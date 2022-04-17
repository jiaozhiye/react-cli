/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-04-17 09:49:28
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { nextTick } from '@/utils';

@withRouter
class Redirect extends Component<any> {
  componentDidMount() {
    const { params } = this.props.match;
    const { search } = this.props.location;
    // 解决延迟调用 this.props.history.replace(`/redirect/pathname`) 的 bug
    nextTick(() => this.props.history.replace(`/${params.path}` + search));
  }
  render(): React.ReactElement {
    return <div></div>;
  }
}

export default Redirect;
