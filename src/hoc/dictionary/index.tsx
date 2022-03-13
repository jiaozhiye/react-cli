/*
 * @Author: 焦质晔
 * @Date: 2021-07-18 19:57:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-13 21:07:42
 */
import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { connect } from 'react-redux';
import type { AppState } from '@/store/reducers/app';
import type { Dictionary, Nullable } from '@/utils/types';

export default (WrappedComponent: React.ComponentType<any>): any => {
  class C extends Component<any> {
    static displayName = `DictTool(${WrappedComponent.displayName || WrappedComponent.name})`;

    /**
     * @description 获取本地存储的数据字典
     * @param
     * @returns {object}
     */
    getLocalDict = (): Record<string, Dictionary[]> => {
      return Object.keys(this.props.dict).length
        ? this.props.dict
        : JSON.parse(localStorage.getItem('dict') as string) || {};
    };

    /**
     * @description 创建数据字典列表，支持过滤
     * @param {string} code 数据字典的 code 码
     * @param {array} excludes 需要过滤数据字典项的 code 值
     * @param {bool} showStoped 是否显示已停用的数据字典，默认 false
     * @returns {array}
     */
    createDictList = (
      code: string,
      excludes: string[] | string = [],
      showStoped = false
    ): Dictionary[] => {
      const vals: string[] = Array.isArray(excludes) ? excludes : [excludes];
      const dict = this.getLocalDict();
      let res: Dictionary[] = [];
      if (Array.isArray(dict[code])) {
        // 过滤已停用的数据字典项
        res = !showStoped ? dict[code].filter((x) => (x as any).stoped !== '1') : dict[code];
        res = res.map((x) => ({ text: x.text, value: x.value }));
        res = res.filter((x) => !vals.includes(x.value.toString()));
      }
      return res;
    };

    /**
     * @description 数据字典的翻译
     * @param {string|number} val 数据的值
     * @param {string} code 数据字典的编码
     * @param {bool} showStoped 是否显示已停用的数据字典，默认 false
     * @returns {string} 翻译后的文本
     */
    createDictText = (val: string | number, code: string, showStoped = false): string => {
      let res = '';
      if (!code) {
        return res;
      }
      const dict = this.getLocalDict();
      if (Array.isArray(dict[code])) {
        // 过滤已停用的数据字典项
        const dicts: Dictionary[] = !showStoped
          ? dict[code].filter((x) => (x as any).stoped !== '1')
          : dict[code];
        const target: Nullable<Dictionary> = dicts.find((x) => x.value == val) || null;
        res = target ? target.text : val.toString();
      }
      return res;
    };

    render() {
      const { forwardedRef } = this.props;
      return (
        <WrappedComponent
          ref={forwardedRef}
          {...this.props}
          createDictList={this.createDictList}
          createDictText={this.createDictText}
        />
      );
    }
  }

  const Forward = React.forwardRef((props, ref) => {
    const H = connect(
      (state: AppState) => ({
        dict: state.app.dict,
        forwardedRef: ref,
        ...props,
      }),
      {}
    )(hoistStatics(C, WrappedComponent));
    return <H />;
  });
  Forward.displayName = 'Forward';

  return Forward;
};
