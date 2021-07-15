/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-15 08:02:33
 */
import React, { Component } from 'react';

import SizeSetting from '../SizeSetting';
import LangSetting from '../LangSetting';
import ScreenFull from '../ScreenFull';
import ThemeSetting from '../ThemeSetting';
import MessageCenter from '../MessageCenter';
import UserCenter from '../UserCenter';
import HelperDoc from '../HelperDoc';

import './index.less';

class Actions extends Component {
  render(): React.ReactElement {
    return (
      <div className="app-actions">
        <ScreenFull />
        <HelperDoc />
        <SizeSetting />
        <LangSetting />
        <ThemeSetting />
        <MessageCenter />
        <UserCenter />
      </div>
    );
  }
}

export default Actions;
