/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-02-26 13:02:35
 */
import React from 'react';
import classNames from 'classnames';

import { Form, Input, QmButton, Divider } from '@jiaozhiye/qm-design-react';

import css from './index.module.less';

const Login = () => {
  return (
    <div className={classNames(css.lgin_wrapper)}>
      <div className={classNames(css.left)}></div>
      <div className={classNames(css.right)}>
        <div className={classNames(css.main)}>
          <h4 className={classNames(css.title)}></h4>
          <div className={classNames(css.container)}>
            <Form
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 24 }}
              className={classNames(css.login_form)}
            >
              <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input placeholder="请输入用户名" />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input placeholder="请输入密码" />
              </Form.Item>
              <div className={css.forget_pwd}>
                <a href="#">忘记密码</a>
              </div>
              <Form.Item>
                <QmButton size="large" type="primary" className={classNames(css.btn)}>
                  登 录
                </QmButton>
                <div className={classNames(css.tooltip)}>
                  建议您在Chrome浏览器(92版本以上)或Edge浏览器使用
                </div>
              </Form.Item>
            </Form>
            <Divider plain className={classNames(css.divider)}>
              其他平台登录
            </Divider>
            <div style={{ textAlign: 'center' }}>
              <QmButton>一汽生态域</QmButton>
              <QmButton style={{ marginLeft: 10 }}>一汽企业域</QmButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
