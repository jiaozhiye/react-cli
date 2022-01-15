/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-15 14:30:42
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { t } from '@/locale';
import { useWatermark } from './useWatermark';
import { appTool } from '@/hoc';
import dayjs from 'dayjs';

import './index.less';

enum distance {
  large = 56,
  middle = 52,
  small = 48,
}

@appTool
class Watermark extends Component<any> {
  public watermarkRef = React.createRef<HTMLDivElement>();

  createWatermark = () => {
    const { setWatermark } = useWatermark(this.watermarkRef.current!);
    setWatermark(t('app.global.title'), dayjs().format('YYYY-MM-DD'));
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.lang !== this.props.lang) {
      this.createWatermark();
    }
  }

  componentDidMount() {
    this.createWatermark();
  }

  render(): React.ReactElement {
    const { size } = this.props;
    return (
      <div
        ref={this.watermarkRef}
        className={classNames('app-watermark')}
        style={{ top: `${distance[size]}px` }}
      />
    );
  }
}

export default Watermark;
