/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 14:26:46
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-14 20:26:02
 */
export type Nullable<T> = T | null;

export type ValueOf<T> = T[keyof T];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, unknown> ? DeepPartial<T[P]> : T[P];
};

export type AnyObject<T> = { [key: string]: T };

export type AnyFunction<T> = (...args: any[]) => T;

export type CustomizedHTMLElement<T> = HTMLElement & T;

export type ComponentSize = 'large' | 'middle' | 'small';

export type Language = 'en' | 'zh-cn';

export type ThemeType = 'light' | 'dark';

export type Dictionary = {
  text: string;
  value: string | number;
  stoped?: boolean;
  disabled?: boolean;
};

export type DeepDictionary = Dictionary & {
  children?: Array<DeepDictionary> | Nullable<undefined>;
};
