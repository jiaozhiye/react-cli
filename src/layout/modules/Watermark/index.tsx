/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-19 12:00:46
 */
import React, { Component } from 'react';
import appTool from '@/hoc/application';

import './index.less';

enum distance {
  large = 56,
  middle = 52,
  small = 48,
}

@appTool
class Watermark extends Component<any> {
  render(): React.ReactElement {
    const { collapsed, size } = this.props;
    return (
      <div
        className="app-watermark"
        style={{ left: !collapsed ? '200px' : '60px', top: `${distance[size]}px` }}
      />
    );
  }
}

export default Watermark;
