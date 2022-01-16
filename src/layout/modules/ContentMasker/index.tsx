/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-16 11:00:10
 */
import React, { Component } from 'react';

import './index.less';

class ContentMasker extends Component<any> {
  render(): React.ReactElement {
    const { onClick: handler } = this.props;
    return <div className={`app-masker`} onClick={() => handler()} />;
  }
}

export default ContentMasker;
