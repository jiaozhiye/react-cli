/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:12:19
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-18 18:10:06
 */
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import UseConfig from '@/config/use';
import store from '@/store';
import { renderRoutes } from '@/router';
import routes from '@/router/config';
import '@/locale/setting';

import 'antd/dist/antd.less';
// import 'antd/dist/antd.dark.less'; // 引入官方提供的暗色 less 样式入口文件
// import 'antd/dist/antd.compact.less'; // 引入官方提供的紧凑 less 样式入口文件
import '@/assets/css/style.less';
import '@/assets/css/antd-ui.less';
import '@/assets/css/iconfont.less';

class App extends Component {
  render(): React.ReactElement {
    return (
      <Provider store={store}>
        <Router>
          <UseConfig>{renderRoutes(routes)}</UseConfig>
        </Router>
      </Provider>
    );
  }
}

export default App;
