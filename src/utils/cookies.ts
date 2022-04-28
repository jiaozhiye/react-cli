/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 15:42:01
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-06-17 11:36:53
 */
import Cookies from 'js-cookie';
import { getParentLocal } from '@/utils';

// 架构 cookie
export const getToken = (): string => getParentLocal('jwt').value ?? '';
export const setToken = (val: string) =>
  localStorage.setItem('jwt', JSON.stringify({ value: val }));
export const removeToken = (): void => localStorage.removeItem('jwt');

export const getUserInfo = () => getParentLocal('userinfo');
export const setUserInfo = (val: Record<string, unknown>) =>
  localStorage.setItem('userinfo', JSON.stringify(val));
export const removeUserInfo = (): void => localStorage.removeItem('userinfo');

// 业务 cookie
