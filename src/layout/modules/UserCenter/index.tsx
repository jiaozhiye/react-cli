/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-05-24 14:32:13
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Menu, Dropdown, QmDrawer } from '@jiaozhiye/qm-design-react';
import { Avatar } from '@jiaozhiye/qm-design-react';
import { UserOutlined, SettingOutlined, ClearOutlined, LogoutOutlined } from '@/icons';
import { connect } from 'react-redux';
import { createLocaleLang, createSignOut } from '@/store/actions';
import { t } from '@/locale';
import { getUserInfo } from '@/utils/cookies';
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
    const items = [
      {
        key: 1,
        label: getUserInfo().userName || t('app.settings.admin'),
        style: { pointerEvents: 'none' } as React.CSSProperties,
      },
      {
        key: 2,
        type: 'divider',
      },
      {
        key: 3,
        icon: <UserOutlined />,
        label: t('app.settings.usercenter'),
        onClick: () => this.setState({ visibleUserCenter: true }),
      },
      {
        key: 4,
        icon: <SettingOutlined />,
        label: t('app.settings.usersetting'),
        onClick: () => this.setState({ visibleUserSetting: true }),
      },
      {
        key: 5,
        icon: <ClearOutlined />,
        label: t('app.settings.clearcache'),
        onClick: () => this.doClearCache(),
      },
      {
        key: 6,
        type: 'divider',
      },
      {
        key: 7,
        icon: <LogoutOutlined />,
        label: t('app.settings.logout'),
        onClick: () => this.doLogout(),
      },
    ];
    return <Menu items={items} />;
  }

  render() {
    const { visibleUserCenter, visibleUserSetting } = this.state;
    return (
      <div className={classNames('app-user-center')}>
        <Dropdown
          dropdownRender={() => this.renderMenus()}
          overlayClassName="app-user-center__popper"
          placement="bottomRight"
          trigger={['click']}
        >
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

export default connect<unknown, unknown, any>((state: AppState) => ({ lang: state.app.lang }), {
  createLocaleLang,
  createSignOut,
})(UserCenter);
