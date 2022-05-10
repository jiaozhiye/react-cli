/*
 * @Author: 焦质晔
 * @Date: 2021-10-30 11:32:31
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-10 18:07:16
 */
const domSymbol = Symbol('watermark-dom');

// 返回当前显示设备的物理像素分辨率与CSS像素分辨率之比
const getPixelRatio = (context: any) => {
  if (!context) {
    return 1;
  }
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
  return (window.devicePixelRatio || 1) / backingStore;
};

export const useWatermark = (appendEl: HTMLElement | null = document.body) => {
  const id = domSymbol.toString();

  const clear = () => {
    const domId = document.getElementById(id);
    if (domId) {
      const el = appendEl;
      el && el.removeChild(domId);
    }
  };

  const setWatermark = (str1: string, str2: string) => {
    clear();

    const _width = 300;
    const _height = 240;
    const _fontSize = 20;
    const _color = 'rgba(0, 0, 0, 0.15)';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const ratio = getPixelRatio(ctx);

    canvas.width = _width * ratio;
    canvas.height = _height * ratio;

    if (ctx) {
      ctx.rotate((-20 * Math.PI) / 160);
      ctx.font = `${_fontSize}px sans-serif`;
      ctx.fillStyle = _color;
      ctx.fillText(str1, canvas.width / 6, canvas.height / 2 + 20);
      ctx.fillText(str2, canvas.width / 6, canvas.height / 2 + 45);
    }

    const div = document.createElement('div');
    div.id = id;
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.pointerEvents = 'none';
    div.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
    div.style.backgroundRepeat = 'repeat';
    div.style.backgroundSize = `${_width}px`;

    const el = appendEl;
    el && el.appendChild(div);
  };

  return { setWatermark, clear };
};
