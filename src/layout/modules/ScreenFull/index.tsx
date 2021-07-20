/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 14:49:19
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import screenfull from 'screenfull';

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
    const cls = [`iconfont`, this.state.isFullscreen ? `icon-fullscreen-exit` : `icon-fullscreen`];
    return (
      <div className="app-screen-full" onClick={this.clickHandle}>
        <span className="ant-dropdown-trigger">
          <i className={classNames(cls)} />
        </span>
      </div>
    );
  }
}

export default ScreenFull;
