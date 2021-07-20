/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 15:05:14
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 15:33:24
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Input, DatePicker } from 'antd';

import css from './index.module.less';

class Demo extends Component {
  render() {
    return <div>
      <div className={classNames(css.demo)}>
        <h5 className={classNames(css.title)}>demo</h5>
      </div>
      <Input placeholder="Basic usage" />
      <DatePicker />
    </div>;
  }
}

export default Demo;
