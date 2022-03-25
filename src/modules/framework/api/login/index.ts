/*
 * @Author: 焦质晔
 * @Date: 2021-07-20 16:37:57
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-23 15:40:27
 */
import axios from '@/api/fetch';
import SERVER from '../server';

// 执行登录
export const doLogin = (params) =>
  axios.post(`${SERVER.SYS}/sysLogin/emp/loginByNameOrPhoneForMany`, params);
