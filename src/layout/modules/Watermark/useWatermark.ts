/*
 * @Author: 焦质晔
 * @Date: 2021-10-30 11:32:31
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-10-30 14:46:02
 */
const domSymbol = Symbol('watermark-dom');

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

    const can = document.createElement('canvas');
    can.width = 300;
    can.height = 240;

    const cans = can.getContext('2d');
    if (cans) {
      cans.rotate((-20 * Math.PI) / 160);
      cans.font = '15px Vedana';
      cans.fillStyle = 'rgba(0, 0, 0, 0.15)';
      cans.textAlign = 'left';
      cans.textBaseline = 'middle';
      cans.fillText(str1, can.width / 6, can.height / 2 + 10);
      cans.fillText(str2, can.width / 6, can.height / 2 + 30);
    }

    const div = document.createElement('div');
    div.id = id;
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.pointerEvents = 'none';
    div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';

    const el = appendEl;
    el && el.appendChild(div);
  };

  return { setWatermark, clear };
};
