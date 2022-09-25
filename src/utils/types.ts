/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 14:26:46
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-04-01 12:13:51
 */
import type React from 'react';

export type Nullable<T> = T | null;

export type ValueOf<T> = T[keyof T];

export type JSXElement = React.ReactElement | JSX.Element;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, unknown> ? DeepPartial<T[P]> : T[P];
};

export type AnyObject<T> = { [key: string]: T };

export type AnyFunction<T> = (...args: any[]) => T;

export type CustomizedHTMLElement<T> = HTMLElement & T;

export type ComponentSize = 'large' | 'middle' | 'small';

export type Language = 'en' | 'zh-cn';

export type ThemeType = 'light' | 'dark';

export type Device = 'desktop' | 'mobile';

export type TimeoutHandle = ReturnType<typeof setTimeout>;

export type IntervalHandle = ReturnType<typeof setInterval>;

export enum SizeHeight {
  large = 40,
  middle = 32,
  small = 24,
}

export type Dictionary = {
  text: string;
  value: string | number;
  stoped?: boolean;
  disabled?: boolean;
};

export type DeepDictionary = Dictionary & {
  children?: Array<DeepDictionary> | Nullable<undefined>;
};

export type IRoute = {
  path: string;
  component?: any;
  redirect?: string;
  exact?: boolean;
  strict?: boolean;
  dynamic?: boolean;
  iframePath?: string;
  microHost?: string;
  microRule?: string;
  meta?: {
    title?: string;
    keepAlive?: boolean;
    bgColor?: boolean;
    noAuth?: boolean;
  };
  routes?: IRoute[];
  render?: (...args: unknown[]) => any;
};
