/*
 * @Author: 焦质晔
 * @Date: 2022-01-17 11:07:49
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-17 11:22:25
 */
import * as React from 'react';
import store from '@/store';

export default function useSize() {
  const { app } = store.getState();
  return app.size || localStorage.getItem('size') || 'middle';
}
