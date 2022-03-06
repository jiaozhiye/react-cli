/*
 * @Author: 焦质晔
 * @Date: 2021-07-12 21:42:07
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 16:34:16
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Spin } from '@jiaozhiye/qm-design-react';

import './index.less';

class Loading extends Component {
  render(): React.ReactElement {
    return <Spin size="large" className={classNames('app-loading')} />;
  }
}

export default Loading;
