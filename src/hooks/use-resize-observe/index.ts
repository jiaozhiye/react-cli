/*
 * @Author: 焦质晔
 * @Date: 2021-12-31 12:25:01
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-09-19 08:34:24
 */
import * as React from 'react';

export default function useResizeObserve(ref: React.RefObject<HTMLElement>) {
  const [state, setState] = React.useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const resizeObserver = React.useRef<ResizeObserver>();

  React.useEffect(() => {
    const $el = ref.current;

    const handler = (entry: any) => {
      const { width, height } = entry[0].contentRect;
      setState({ width: Math.ceil(width), height: Math.ceil(height) });
    };

    if ($el) {
      resizeObserver.current = new ResizeObserver(handler);
      resizeObserver.current.observe($el);
    }

    return () => {
      resizeObserver.current?.disconnect();
    };
  }, [ref]);

  return state;
}
