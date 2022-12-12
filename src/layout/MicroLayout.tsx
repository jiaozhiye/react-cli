/*
 * @Author: 焦质晔
 * @Date: 2022-12-12 19:43:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-12-12 20:27:45
 */
import React from 'react';
import classNames from 'classnames';
import config from '@/config';

import type { IRoute } from '@/utils/types';

type IProps = {
  route: IRoute;
  children?: React.ReactNode;
};

const MicroLayout: React.FC<IProps> = (props) => {
  const { path, iframePath } = props.route;

  const createIframeView = () => {
    return (
      <iframe
        id={path}
        name={path}
        src={iframePath}
        width="100%"
        height="100%"
        frameBorder="0"
        onLoad={(ev) => {
          const $iframe = ev.target as HTMLIFrameElement;
          try {
            $iframe.contentWindow!.__MAIM_APP_ENV__ = config.isMainApp;
          } catch (err) {
            // ...
          }
          $iframe.focus();
        }}
      />
    );
  };

  return <div className={classNames('app-iframe-container')}>{createIframeView()}</div>;
};

export default MicroLayout;
