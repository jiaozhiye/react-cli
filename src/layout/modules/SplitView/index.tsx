/*
 * @Author: 焦质晔
 * @Date: 2022-05-29 08:54:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-29 11:33:07
 */
import React, { Component } from 'react';
import classNames from 'classnames';

import './index.less';

type IProps = {
  offset: number;
  min: number;
  max: number;
  threshold?: number;
  onDrag: (value: number) => void;
  onDragEnd?: (value: number) => void;
  onDragChange?: (bool: boolean) => void;
};

type IState = {
  active: boolean;
  hover: boolean;
};

class SplitView extends Component<IProps, IState> {
  private _timer;

  state = {
    active: false,
    hover: false,
  };

  dragStart = (ev) => {
    ev.preventDefault();
    this.setState({ active: true }, () => this.props.onDragChange?.(this.state.active));
    document.addEventListener('mousemove', this.moving, { passive: true });
    document.addEventListener('mouseup', this.dragStop, { passive: true, once: true });
  };

  dragStop = () => {
    document.removeEventListener('mousemove', this.moving);
    this.setState({ active: false }, () => this.props.onDragChange?.(this.state.active));
  };

  moving = (ev: MouseEvent) => {
    const { pageX } = ev;
    const { min, max, threshold, onDrag } = this.props;
    let offset = pageX;
    // 阈值
    if (threshold) {
      if (offset > min && offset <= (min + threshold) / 2) {
        offset = min;
      }
      if (offset < threshold && offset > (min + threshold) / 2) {
        offset = threshold;
      }
    }
    if (offset < min) {
      offset = min;
    }
    if (offset > max) {
      offset = max;
    }
    onDrag(offset);
  };

  hoverHandle = () => {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this.setState({ hover: true }), 200);
  };

  leaveHandle = () => {
    clearTimeout(this._timer);
    this.setState({ hover: false });
  };

  render() {
    const { offset } = this.props;
    const { hover, active } = this.state;
    const cls = {
      [`resize-bar`]: true,
      [`vertical`]: true,
      [`hover`]: hover,
      [`active`]: active,
    };
    return (
      <div className={`app-split-view horizontal`}>
        <div
          className={classNames(cls)}
          style={{ left: offset }}
          onMouseDown={this.dragStart}
          onMouseOver={this.hoverHandle}
          onMouseLeave={this.leaveHandle}
        />
      </div>
    );
  }
}

export default SplitView;
