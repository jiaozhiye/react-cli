/*
 * @Author: 焦质晔
 * @Date: 2021-02-14 14:59:10
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 08:27:04
 */
import axios from '@/api/fetch';
import config from '@/config';
const { prefix } = config;

// 获取菜单
export const getMenuList = (params) =>
  axios.post(`${prefix}/sys/sysLogin/user/getUserMenus`, params);

// 获取数据字典
export const getDictList = (params) =>
  axios.post(`${prefix}/sys/sysLogin/user/getDictionary`, params);

// 获取收藏导航
export const getStarMenuList = (params) =>
  axios.get(`${prefix}/sys/sysLogin/user/getfavorite`, { params });

// 设置收藏导航
export const setStarMenuList = (params) =>
  axios.post(`${prefix}/sys/sysLogin/user/collection`, params);

// 菜单埋点
export const createMenuPoint = (params) =>
  axios.post(`${prefix}/sys/sysLogin/user/clickMenu`, params);

// 获取个人信息
export const getUserInfo = (params) =>
  axios.get(`${prefix}/sys/sysLogin/user/getUserInfo`, { params });
