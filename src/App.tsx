/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:12:19
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-19 14:45:31
 */
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import UseConfig from '@/config/use';
import store from '@/store';
import { renderRoutes } from '@/router';
import routes from '@/router/config';
import config from '@/config';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router basename={config.baseRoute}>
          <UseConfig>{renderRoutes(routes)}</UseConfig>
        </Router>
      </Provider>
    );
  }
}

export default App;
