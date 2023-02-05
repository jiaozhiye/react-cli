/*
 * @Author: 焦质晔
 * @Date: 2022-11-26 10:16:06
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-02-05 12:28:01
 */
import React from 'react';
import { useLocale } from '@/hooks';
import { getMicroEvent } from '@/utils/mitt';
import { WIDGET_MAIN, WIDGET_SUB } from '@/store/types';
import config from '@/config';

import { QmDrawer } from '@jiaozhiye/qm-design-react';
import { ExpandOutlined } from '@/icons';

import './index.less';

type IPayload = {
  code: string;
  payload: any;
};

type EventHandler = (payload: IPayload) => void;

export type WidgetRef = {
  dispatch: (value: IPayload) => void;
  attachEvent: (handler: EventHandler) => void;
};

type IProps = {
  cols: number;
  rows: number;
  fullScreen?: {
    title?: string;
    content: React.ReactNode;
  };
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const ROW_HEIGHT = 75;
const GIRD_GUTTER = 16;

const Widget = React.forwardRef<WidgetRef, IProps>((props, ref) => {
  const { cols = 1, rows = 1, style, fullScreen } = props;
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

  const { t } = useLocale();
  const [visible, setVisible] = React.useState<boolean>(false);

  const height = React.useMemo<number>(() => {
    return ROW_HEIGHT * rows + (rows - 1) * GIRD_GUTTER;
  }, [rows]);

  const width = React.useMemo<string>(() => {
    return window.name || config.powerByMicro ? '100%' : ((cols * 4) / 24) * 100 + '%';
  }, [cols]);

  const __DEV__ = process.env.NODE_ENV === 'development';
  const __MICRO__ = !!window.name || config.powerByMicro;

  // 公开方法
  React.useImperativeHandle(ref, () => ({
    dispatch,
    attachEvent,
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
    <>
      <div className={`app-widget-wrap`} style={{ width, height, ...style }}>
        {!!fullScreen && (
          <div
            className={`full-sign`}
            title={t('app.widget.fullScreen')}
            onClick={() => setVisible(true)}
          >
            <ExpandOutlined />
          </div>
        )}
        {props.children}
      </div>
      {fullScreen && (
        <QmDrawer
          visible={visible}
          title={fullScreen.title || ''}
          width="100vw"
          loading={false}
          showFullScreen={false}
          onClose={() => {
            setVisible(false);
          }}
        >
          <div
            className={`container`}
            style={{
              margin: -10,
              height: `calc(100% + 20px)`,
              overflowY: 'auto',
            }}
          >
            {fullScreen.content}
          </div>
        </QmDrawer>
      )}
    </>
  );
});

Widget.displayName = 'Widget';

export default Widget;
