/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-21 16:15:31
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import config from '@/config';
import appTool from '@/hoc/application';
import { connect } from 'react-redux';
import { setStarMenu } from '@/store/actions';
import { t } from '@/locale';
import { sleep, Message } from '@/utils';
import { setStarMenuList } from '@/api/application';
import { AppState } from '@/store/reducers/app';

import { Select, Tabs } from '@jiaozhiye/qm-design-react';
import { StarOutlined, StarFilled } from '@ant-design/icons';

import './index.less';

const { Option } = Select;
const { TabPane } = Tabs;

const isHttpLink = (path = '') => {
  return /^https?:\/\//.test(path);
};

const reduxConnect: any = connect;

@reduxConnect(
  (state: AppState) => ({
    sideMenus: state.app.sideMenus,
    starMenus: state.app.starMenus,
    flattenMenus: state.app.flattenMenus,
  }),
  {
    setStarMenu,
  }
)
@appTool
class NavList extends Component<any> {
  static propTypes = {
    visible: PropTypes.bool,
    collapsed: PropTypes.bool,
    onChange: PropTypes.func,
  };

  state = {
    searchValue: null,
  };

  componentDidUpdate(prevProps) {
    const { visible: prevVisible } = prevProps;
    const { visible, location, flattenMenus } = this.props;
    if (visible && visible !== prevVisible) {
      if (flattenMenus.some((x) => x.key === location.pathname)) {
        this.setState({ searchValue: location.pathname });
      } else {
        this.setState({ searchValue: null });
      }
    }
  }

  clickHandle = () => {
    this.props.onChange();
  };

  onSelectChange = async (val) => {
    this.setState({ searchValue: val });
    !isHttpLink(val) ? this.props.openView(val) : window.open(val);
    await sleep(200);
    this.props.onChange();
  };

  starChange = (active, key, title) => {
    const { starMenus } = this.props;
    const result = active ? starMenus.filter((x) => x.key !== key) : [...starMenus, { key, title }];
    // 最大数量判断
    if (result.length > config.maxCacheNum) {
      return Message(t('app.information.maxCache', { total: config.maxCacheNum }), 'warning');
    }
    this.props.setStarMenu(result);
    this.saveStarMenu();
  };

  async saveStarMenu() {
    if (process.env.MOCK_DATA === 'true') return;
    await setStarMenuList({ starMenus: this.props.starMenus });
  }

  renderLinkItem(item) {
    return !isHttpLink(item.key) ? (
      <Link to={item.key} target={item.target} onClick={this.clickHandle}>
        <span>{item.title}</span>
      </Link>
    ) : (
      <a href={item.key} target={item.target || '_blank'} onClick={this.clickHandle}>
        <span>{item.title}</span>
      </a>
    );
  }

  render(): React.ReactElement {
    const { forwardedRef, visible, collapsed, flattenMenus, sideMenus, starMenus } = this.props;
    const { searchValue } = this.state;
    return (
      <>
        <div
          className={classNames('nav-list-masker', visible ? 'show' : '')}
          style={{ left: !collapsed ? `${config.sideWidth[0]}px` : `${config.sideWidth[1]}px` }}
          onClick={this.clickHandle}
        />
        <div
          ref={forwardedRef}
          className={classNames('nav-list-container', visible ? 'show' : '')}
          style={{ left: !collapsed ? `${config.sideWidth[0]}px` : `${config.sideWidth[1]}px` }}
        >
          <div className={classNames('wrapper')}>
            <div className={classNames('search')}>
              <Select
                value={searchValue}
                size="middle"
                placeholder={t('app.sidebar.allNavPlaceholder')}
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={this.onSelectChange}
              >
                {flattenMenus.map((x) => (
                  <Option key={x.key} value={x.key}>
                    {x.title}
                  </Option>
                ))}
              </Select>
            </div>
            <div className={classNames('main')}>
              <Tabs tabBarGutter={0} tabPosition="right" tabBarStyle={{ width: '150px' }}>
                {sideMenus.map((item, index) => (
                  <TabPane key={index} tab={item.title}>
                    <div className={classNames('column-wrap')}>
                      {item.children?.map((sub, index) => (
                        <div key={index} className={classNames('box')}>
                          <h4>{sub.title}</h4>
                          <ul>
                            {sub.children?.map((x, i) => {
                              const actived = starMenus.some((k) => k.key === x.key);
                              return (
                                <li key={i}>
                                  {React.createElement(actived ? StarFilled : StarOutlined, {
                                    className: classNames('icon'),
                                    onClick: () => this.starChange(actived, x.key, x.title),
                                  })}
                                  {this.renderLinkItem(x)}
                                </li>
                              );
                            })}
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

export default React.forwardRef((props: any, ref) => <NavList {...props} forwardedRef={ref} />);
