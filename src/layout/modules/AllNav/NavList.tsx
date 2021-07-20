/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 12:54:40
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import config from '@/config';
import appTool from '@/hoc/application';
import { connect } from 'react-redux';
import { t } from '@/locale';

import { Select, Tabs } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';

import './index.less';

const { Option } = Select;
const { TabPane } = Tabs;

@appTool
class NavList extends Component<any> {
  static propTypes = {
    visible: PropTypes.bool,
    collapsed: PropTypes.bool,
    onChange: PropTypes.func,
  };

  clickHandle = () => {
    this.props.onChange();
  };

  onChange = (val) => {
    this.props.openView(val);
    this.props.onChange();
  };

  starChange = (star, key, title) => {
    // ...
  };

  render(): React.ReactElement {
    const { visible, collapsed, flattenMenus, sideMenus } = this.props;
    return (
      <>
        <div
          className={classNames('nav-list-masker', visible ? 'show' : '')}
          style={{ left: !collapsed ? `${config.sideWidth[0]}px` : `${config.sideWidth[1]}px` }}
          onClick={this.clickHandle}
        />
        <div
          className={classNames('nav-list-container', visible ? 'show' : '')}
          style={{ left: !collapsed ? `${config.sideWidth[0]}px` : `${config.sideWidth[1]}px` }}
        >
          <div className="wrapper">
            <div className="search">
              <Select
                size="middle"
                style={{ width: '100%' }}
                placeholder={t('app.sidebar.allNavPlaceholder')}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={this.onChange}
              >
                {flattenMenus.map((x) => (
                  <Option key={x.key} value={x.key}>
                    {x.title}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="main">
              <Tabs tabBarGutter={0} tabPosition="right" tabBarStyle={{ width: '150px' }}>
                {sideMenus.map((item, index) => (
                  <TabPane key={index} tab={item.title}>
                    <div className={classNames('column-wrap')}>
                      {item.children?.map((sub, index) => (
                        <div key={index} className={classNames('box')}>
                          <h4>{sub.title}</h4>
                          <ul>
                            {sub.children?.map((x, i) => (
                              <li key={i}>
                                {React.createElement(1 ? StarOutlined : StarFilled, {
                                  className: 'icon',
                                  onClick: () => this.starChange(x.star, x.key, x.title),
                                })}
                                <Link to={x.key} target={x.target}>
                                  <span>{x.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </TabPane>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  (state: any) => ({
    sideMenus: state.app.sideMenus,
    flattenMenus: state.app.flattenMenus,
  }),
  {}
)(NavList);
