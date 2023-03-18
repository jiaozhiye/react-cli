/*
 * @Author: 焦质晔
 * @Date: 2022-11-26 10:16:06
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-03-18 18:06:57
 */
import React from 'react';
import { getMicroEvent } from '@/utils/mitt';
import { WIDGET_MAIN, WIDGET_SUB } from '@/store/types';
import config from '@/config';

import './index.less';

type IPayload = {
  code: string;
  payload: any;
};

type EventHandler = (payload: IPayload) => void;

export type WidgetRef = {
  dispatch: (value: IPayload) => void;
  attachEvent: (handler: EventHandler) => void;
  doExpand: (value: number) => void;
};

type IProps = {
  cols: number;
  rows: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const ROW_HEIGHT = 75;
const GIRD_GUTTER = 16;
const WIDGET_ROWSPAN = 'WIDGET_ROWSPAN';

const Widget = React.forwardRef<WidgetRef, IProps>((props, ref) => {
  const { cols = 1, rows = 1, style } = props;
  const evHandleRef = React.useRef<EventHandler | null>(null);

  const microEvent = getMicroEvent();

  const dispatch = (data: IPayload) => {
    microEvent?.$emit(WIDGET_MAIN, data);
  };

  const attachEvent = (fn: EventHandler) => {
    if (evHandleRef.current) {
      return console.error('[Widget]', `事件只允许绑定一次！`);
    }
    microEvent?.$on(WIDGET_SUB, fn);
    evHandleRef.current = fn;
  };

  const __DEV__ = process.env.NODE_ENV === 'development';
  const __MICRO__ = config.powerByMicro || !!window.name;

  const [expandHeight, setExpandHeight] = React.useState<number>(0);

  const height = React.useMemo<number>(() => {
    return ROW_HEIGHT * rows + (rows - 1) * GIRD_GUTTER + expandHeight;
  }, [rows, expandHeight]);

  const width = React.useMemo<string>(() => {
    return __MICRO__ ? '100%' : ((cols * 4) / 24) * 100 + '%';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cols]);

  const doExpand = (value: number) => {
    const v = (value + GIRD_GUTTER) / (ROW_HEIGHT + GIRD_GUTTER);
    if (__MICRO__) {
      const microAppName = window.__MICRO_APP_NAME__ || window.name;
      dispatch({
        code: WIDGET_ROWSPAN,
        payload: {
          name: microAppName.split('-')[2] || '',
          rows: value ? Number(v.toFixed(1)) : 0,
        },
      });
    }
    setExpandHeight(value);
  };

  // 公开方法
  React.useImperativeHandle(ref, () => ({
    dispatch,
    attachEvent,
    doExpand,
  }));

  React.useEffect(() => {
    if (__DEV__ && !__MICRO__) {
      document.body.style.backgroundColor = '#f2f2f2';
    }
    return () => {
      if (__DEV__ && !__MICRO__) {
        document.body.style.backgroundColor = '';
      }
      if (evHandleRef.current) {
        microEvent?.$off(WIDGET_SUB, evHandleRef.current);
        evHandleRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`app-widget-wrap`} style={{ width, height, ...style }}>
      {props.children}
    </div>
  );
});

Widget.displayName = 'Widget';

export default Widget;
