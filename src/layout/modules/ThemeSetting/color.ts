/*
 * @Author: 焦质晔
 * @Date: 2022-07-03 11:18:37
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-07-03 11:32:32
 */
import client from 'webpack-custom-theme/client';
import { generate } from '@ant-design/colors';

export const getAntdSerials = (color: string) => {
  const lightens: string[] = new Array(9).fill(null).map((t, i) => {
    return client.varyColor.lighten(color, i / 10);
  });
  const darkens: string[] = new Array(6).fill(null).map((t, i) => {
    return client.varyColor.darken(color, i / 10);
  });
  const colorPalettes = generate(color);
  const rgb: string = client.varyColor.toNum3(color.replace('#', '')).join(',');
  return lightens.concat(darkens).concat(colorPalettes).concat(rgb);
};
