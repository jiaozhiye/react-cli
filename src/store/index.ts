/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 15:49:54
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-06 18:15:43
 */
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducers } from './reducers';

// 引入 redux devtools
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)));

export default store;
