/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 14:50:37
 */
import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';
import { Avatar } from 'antd';
import { UserOutlined, SettingOutlined, ClearOutlined, LogoutOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { createLocaleLang } from '@/store/actions';
import { t } from '@/locale';
import { AppState } from '@/store/reducers/app';

import './index.less';

class UserCenter extends Component<any> {
  state = {
    avatarImg: require('@/assets/img/avatar.jpg'),
  };

  renderMenus() {
    return (
      <Menu>
        <Menu.Item key="1" icon={<UserOutlined />}>
          {t('app.settings.usercenter')}
        </Menu.Item>
        <Menu.Item key="2" icon={<SettingOutlined />}>
          {t('app.settings.usersetting')}
        </Menu.Item>
        <Menu.Item key="3" icon={<ClearOutlined />}>
          {t('app.settings.clearcache')}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4" icon={<LogoutOutlined />}>
          {t('app.settings.logout')}
        </Menu.Item>
      </Menu>
    );
  }

  render(): React.ReactElement {
    return (
      <div className="app-user-center">
        <Dropdown overlay={this.renderMenus()} placement="bottomRight" trigger={['click']}>
          <span>
            <Avatar size={26} src={this.state.avatarImg} />
            <span style={{ marginLeft: '5px' }}>管理员</span>
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default connect((state: AppState) => ({ lang: state.app.lang }), {
  createLocaleLang,
})(UserCenter);
