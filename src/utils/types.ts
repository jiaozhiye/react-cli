/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 14:26:46
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-15 14:52:20
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

export type Dictionary = {
  text: string;
  value: string | number;
  stoped?: boolean;
  disabled?: boolean;
};

export type DeepDictionary = Dictionary & {
  children?: Array<DeepDictionary> | Nullable<undefined>;
};
