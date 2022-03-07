/*
 * @Author: 焦质晔
 * @Date: 2022-01-17 11:22:01
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-17 14:13:40
 */
import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export default function useTool() {
  const history = useHistory();
  const location = useLocation();

  const openView = (pathname) => {
    history.push(pathname);
  };

  const reloadView = () => {};

  return { openView, reloadView, location };
}
