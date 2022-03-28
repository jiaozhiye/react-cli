/*
 * @Author: 焦质晔
 * @Date: 2022-03-28 18:51:48
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-28 19:06:27
 */
import React from 'react';
import classNames from 'classnames';

import css from '../style/index.module.less';

const Test = (props) => {
  return <div className={classNames(css.wrapper)}>test 组件</div>;
};

Test.displayName = 'Test';

export default Test;
