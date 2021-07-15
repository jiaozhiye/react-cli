/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 10:12:56
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-07 10:15:22
 */
import React from 'react';

export default class Base extends React.Component {
  static instances: any = [];

  static rerenderAll() {
    Base.instances.forEach((instance) => instance.forceUpdate());
  }

  componentDidMount() {
    Base.instances.push(this);
  }

  componentWillUnmount() {
    Base.instances.splice(Base.instances.indexOf(this), 1);
  }
}
