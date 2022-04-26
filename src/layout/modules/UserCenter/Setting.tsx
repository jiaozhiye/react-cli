/*
 * @Author: 焦质晔
 * @Date: 2022-04-21 12:14:34
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-04-21 12:21:44
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { t } from '@/locale';

import { QmButton, QmSpace } from '@jiaozhiye/qm-design-react';

class Setting extends Component<any> {
  saveHandle = () => {
    // ....
    this.cancelHandle();
  };
  cancelHandle = () => {
    this.props.onClose();
  };
  render() {
    return (
      <>
        <div>{t('app.settings.usersetting')}</div>
        <QmSpace className={`fixed-footer`}>
          <QmButton onClick={() => this.cancelHandle()}>{t('app.button.close')}</QmButton>
          <QmButton type="primary" click={() => this.saveHandle()}>
            {t('app.button.confirm')}
          </QmButton>
        </QmSpace>
      </>
    );
  }
}

export default Setting;
