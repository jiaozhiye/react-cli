/*
 * @Author: 焦质晔
 * @Date: 2021-07-12 21:42:07
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-12 21:42:36
 */
import React, { Component } from 'react';
import { Spin } from 'antd';

class Loading extends Component {
  render(): React.ReactElement {
    return <Spin />;
  }
}

export default Loading;
