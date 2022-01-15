/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-15 14:00:38
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import screenfull from 'screenfull';

import { FullscreenOutlined, FullscreenExitOutlined } from '@/icons';

import './index.less';

class ScreenFull extends Component<any> {
  state = {
    isFullscreen: false,
  };

  componentDidMount() {
    this.initial();
  }

  componentWillUnmount() {
    this.destroy();
  }

  initial() {
    if (screenfull.isEnabled) {
      screenfull.on('change', this.changeHandler);
    }
  }

  clickHandle() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  changeHandler = () => {
    if (screenfull.isEnabled) {
      this.setState({ isFullscreen: screenfull.isFullscreen });
    }
  };

  destroy() {
    if (screenfull.isEnabled) {
      screenfull.off('change', this.changeHandler);
    }
  }

  render(): React.ReactElement {
    return (
      <div className={classNames('app-screen-full')} onClick={this.clickHandle}>
        <span className={classNames('ant-dropdown-trigger')}>
          {!this.state.isFullscreen ? (
            <FullscreenOutlined className={`icon`} />
          ) : (
            <FullscreenExitOutlined className={`icon`} />
          )}
        </span>
      </div>
    );
  }
}

export default ScreenFull;
