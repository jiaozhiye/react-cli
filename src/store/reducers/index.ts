/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 15:51:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-06 16:43:08
 */
import { combineReducers } from 'redux';
import { appReducer } from './app';

// 合并 reducers
export const reducers = combineReducers({
  app: appReducer,
});
