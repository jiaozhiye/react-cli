/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-06 22:41:54
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { t } from '@/locale';
import { useWatermark } from './useWatermark';
import { application } from '@/hoc';
import dayjs from 'dayjs';

import './index.less';

enum distance {
  large = 52,
  middle = 48,
  small = 44,
}

@application
class Watermark extends Component<any> {
  public watermarkRef = React.createRef<HTMLDivElement>();

  createWatermark = () => {
    const { setWatermark } = useWatermark(this.watermarkRef.current);
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
