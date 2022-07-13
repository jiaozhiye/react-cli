/*
 * @Author: 焦质晔
 * @Date: 2021-07-21 13:38:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-21 14:07:34
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { t } from '@/locale';

import './index.less';

interface IState {
  hasError: boolean;
}

interface IProps {
  children;
}

class ErrorBoundary extends Component<IProps, IState> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className={classNames('app-error-boundary')}>{t('app.global.errorLoad')}</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
