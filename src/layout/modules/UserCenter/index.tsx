/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-04-05 11:22:32
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Menu, Dropdown, QmDrawer } from '@jiaozhiye/qm-design-react';
import { Avatar } from '@jiaozhiye/qm-design-react';
import { UserOutlined, SettingOutlined, ClearOutlined, LogoutOutlined } from '@/icons';
import { connect } from 'react-redux';
import { createLocaleLang, createSignOut } from '@/store/actions';
import { t } from '@/locale';
import { getUserName } from '@/utils/cookies';
import type { AppState } from '@/store/reducers/app';

import Center from './Center';
import Setting from './Setting';

import './index.less';

class UserCenter extends Component<any> {
  state = {
    avatarImg: require('@/assets/img/avatar.jpg'),
    visibleUserCenter: false,
    visibleUserSetting: false,
  };

  doClearCache = () => {
    window.history.go(0);
  };

  doLogout = () => {
    // 需要走后台接口
    this.props.createSignOut();
  };

  renderMenus() {
    return (
      <Menu>
        <Menu.Item key="1" style={{ pointerEvents: 'none' }}>
          {getUserName() || t('app.settings.admin')}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          key="2"
          icon={<UserOutlined />}
          onClick={() => this.setState({ visibleUserCenter: true })}
        >
          {t('app.settings.usercenter')}
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={<SettingOutlined />}
          onClick={() => this.setState({ visibleUserSetting: true })}
        >
          {t('app.settings.usersetting')}
        </Menu.Item>
        <Menu.Item key="4" icon={<ClearOutlined />} onClick={this.doClearCache}>
          {t('app.settings.clearcache')}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="5" icon={<LogoutOutlined />} onClick={this.doLogout}>
          {t('app.settings.logout')}
        </Menu.Item>
      </Menu>
    );
  }

  render(): React.ReactElement {
    const { visibleUserCenter, visibleUserSetting } = this.state;
    return (
      <div className={classNames('app-user-center')}>
        <Dropdown overlay={this.renderMenus()} placement="bottomRight" trigger={['click']}>
          <span>
            <Avatar size={26} src={this.state.avatarImg} />
          </span>
        </Dropdown>
        <QmDrawer
          visible={visibleUserCenter}
          title={t('app.settings.usercenter')}
          width={'40%'}
          loading={false}
          bodyStyle={{ paddingBottom: 52 }}
          onClose={() => this.setState({ visibleUserCenter: false })}
        >
          <Center
            onClose={() => {
              this.setState({ visibleUserCenter: false });
            }}
          />
        </QmDrawer>
        <QmDrawer
          visible={visibleUserSetting}
          title={t('app.settings.usersetting')}
          width={'40%'}
          loading={false}
          bodyStyle={{ paddingBottom: 52 }}
          onClose={() => this.setState({ visibleUserSetting: false })}
        >
          <Setting
            onClose={() => {
              this.setState({ visibleUserSetting: false });
            }}
          />
        </QmDrawer>
      </div>
    );
  }
}

export default connect((state: AppState) => ({ lang: state.app.lang }), {
  createLocaleLang,
  createSignOut,
})(UserCenter);
