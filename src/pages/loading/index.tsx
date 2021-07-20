/*
 * @Author: 焦质晔
 * @Date: 2021-07-12 21:42:07
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 16:34:16
 */
import React, { Component } from 'react';
import { Spin } from 'antd';

import './index.less';

class Loading extends Component {
  render(): React.ReactElement {
    return <Spin />;
  }
}

export default Loading;
