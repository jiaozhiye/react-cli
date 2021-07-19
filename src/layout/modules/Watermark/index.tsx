/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-19 15:50:41
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
    const { size } = this.props;
    return <div className="app-watermark" style={{ top: `${distance[size]}px` }} />;
  }
}

export default Watermark;
