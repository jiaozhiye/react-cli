/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 21:35:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-13 17:55:18
 */
import axios from '@/api/fetch';
import SERVER from '../server';

export const getTableData = (params) =>
  axios.post(`http://127.0.0.1:3000/api/design/getTableData`, params);

export const getTableKeys = (params) =>
  axios.post(`http://127.0.0.1:3000/api/design/getTableKeys`, params);

export const getSummationData = (params) =>
  axios.post(`http://127.0.0.1:3000/api/design/getSummationData`, params);

export const getSelectData = (params) =>
  axios.get(`http://127.0.0.1:3000/api/design/getSelectData`, { params });

export const getTreeData = (params) =>
  axios.get(`http://127.0.0.1:3000/api/design/getTreeData`, { params });

export const getStreetData = (params) =>
  axios.get(`http://127.0.0.1:3000/api/design/getStreetData`, { params });

export const getRecordById = (params) =>
  axios.post(`http://127.0.0.1:3000/api/design/getTableData`, params);

export const addRecord = (params) =>
  axios.post(`http://127.0.0.1:3000/api/design/getTableData`, params);

export const saveRecord = (params) =>
  axios.post(`http://127.0.0.1:3000/api/design/getTableData`, params);
