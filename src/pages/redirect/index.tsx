/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-02-11 08:44:03
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

@withRouter
class Redirect extends Component<any> {
  componentDidMount() {
    const { params } = this.props.match;
    const { search } = this.props.location;
    this.props.history.replace(`/${params.path}` + search);
  }
  render(): React.ReactElement {
    return <div></div>;
  }
}

export default Redirect;
