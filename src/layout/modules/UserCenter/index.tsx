/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-14 16:53:42
 */
import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';
import { Avatar } from 'antd';
import { UserOutlined, SettingOutlined, ClearOutlined, LogoutOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { createLocaleLang } from '@/store/actions';

import './index.less';

class UserCenter extends Component<any> {
  state = {
    avatarImg: require('@/assets/img/avatar.jpg'),
  };

  renderMenus() {
    const { lang } = this.props;
    return (
      <Menu>
        <Menu.Item key="1" icon={<UserOutlined />}>
          个人中心
        </Menu.Item>
        <Menu.Item key="2" icon={<SettingOutlined />}>
          个人设置
        </Menu.Item>
        <Menu.Item key="3" icon={<ClearOutlined />}>
          清理缓存
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4" icon={<LogoutOutlined />}>
          退出登录
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

export default connect((state: any) => ({ lang: state.app.lang }), {
  createLocaleLang,
})(UserCenter);
