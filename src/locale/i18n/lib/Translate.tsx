/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 10:14:25
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-07 10:29:41
 */
import React from 'react';
import PropTypes from 'prop-types';
import { translate } from './core';
import BaseComponent from './Base';

class Translate extends BaseComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    locale: PropTypes.string,
  };

  render() {
    const { value, locale, ...otherProps } = this.props as any;
    const translation = translate(value, otherProps, { locale });

    return <React.Fragment>{translation}</React.Fragment>;
  }
}

export default Translate;
