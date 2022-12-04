/*
 * @Author: 焦质晔
 * @Date: 2022-11-26 10:16:06
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-12-02 09:58:55
 */
import React from 'react';
import { useLocale } from '@/hooks';
import { getMicroEvent } from '@/utils/mitt';
import { WIDGET_MAIN, WIDGET_SUB } from '@/store/types';
import config from '@/config';

import { Col, QmDrawer } from '@jiaozhiye/qm-design-react';
import { ExpandOutlined } from '@/icons';

import './index.less';

type IPayload = {
  code: string;
  payload: any;
};

export type WidgetRef = {
  dispatch: (value: IPayload) => void;
  attachEvent: (handler: (payload: IPayload) => void) => void;
};

type IProps = {
  cols: number;
  rows: number;
  fullScreen?: {
    title?: string;
    content: React.ReactNode;
  };
};

const ROW_HEIGHT = 75;
const GIRD_GUTTER = 16;

const Widget = React.forwardRef<WidgetRef, IProps>((props, ref) => {
  const { cols = 1, rows = 1, fullScreen } = props;

  const microEvent = getMicroEvent();

  const dispatch = (data: IPayload) => {
    microEvent?.$emit(WIDGET_MAIN, data);
  };

  const attachEvent = (fn: (payload: IPayload) => void) => {
    microEvent?.$on(WIDGET_SUB, fn);
  };

  const { t } = useLocale();
  const [visible, setVisible] = React.useState<boolean>(false);

  const height = React.useMemo<number>(() => {
    return ROW_HEIGHT * rows + (rows - 1) * GIRD_GUTTER;
  }, [rows]);

  const width = window.name || config.powerByMicro ? '100%' : undefined;

  // 公开方法
  React.useImperativeHandle(ref, () => ({
    dispatch,
    attachEvent,
  }));

  React.useEffect(() => {
    return () => {
      microEvent?.$off(WIDGET_SUB);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Col
        span={cols * 4}
        className={`app-widget-wrap`}
        style={{ height: height, maxWidth: width }}
      >
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
      </Col>
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
