/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:12:19
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-18 18:23:44
 */
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import UseConfig from '@/config/use';
import store from '@/store';
import { renderRoutes } from '@/router';
import routes from '@/router/config';

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
