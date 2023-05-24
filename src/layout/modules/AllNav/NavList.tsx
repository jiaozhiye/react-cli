/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-05-24 14:26:36
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import config from '@/config';
import { application } from '@/hoc';
import { connect } from 'react-redux';
import { setStarMenu } from '@/store/actions';
import { t } from '@/locale';
import { sleep, Message } from '@/utils';
import type { AppState } from '@/store/reducers/app';

import { Select, QmTabs, pinyin } from '@jiaozhiye/qm-design-react';
import { StarOutlined, StarFilled } from '@/icons';

import './index.less';

const { Option } = Select;
const { TabPane } = QmTabs;

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
@application
class NavList extends Component<any> {
  static propTypes = {
    visible: PropTypes.bool,
    getWidth: PropTypes.func,
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
      return Message(t('app.information.maxStar', { total: config.maxCacheNum }), 'warning');
    }
    this.props.setStarMenu(result);
  };

  renderLinkItem(item) {
    return !isHttpLink(item.key) ? (
      <Link to={item.key || ''} target={item.target} onClick={this.clickHandle}>
        <span>{item.title}</span>
      </Link>
    ) : (
      <a href={item.key} target={item.target || '_blank'} onClick={this.clickHandle}>
        <span>{item.title}</span>
      </a>
    );
  }

  render() {
    const { forwardedRef, visible, flattenMenus, sideMenus, starMenus, getWidth } = this.props;
    const { searchValue } = this.state;
    return (
      <>
        <div
          className={classNames('nav-list-masker', { show: visible })}
          style={{ left: getWidth() }}
          onClick={(ev) => {
            ev.stopPropagation();
            this.clickHandle();
          }}
        />
        <div
          ref={forwardedRef}
          className={classNames('nav-list-container', { show: visible })}
          style={{ left: getWidth() }}
          onClick={(ev) => ev.stopPropagation()}
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
                filterOption={(input, option: any) => {
                  const pyt: string = pinyin
                    .parse(option.children)
                    .map((v) => {
                      if (v.type === 2) {
                        return v.target.toLowerCase().slice(0, 1);
                      }
                      return v.target;
                    })
                    .join('');
                  return (
                    `${option.children}|${pyt}`.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
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
              <QmTabs tabBarGutter={0} tabPosition="right" tabBarStyle={{ width: '150px' }}>
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
              </QmTabs>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default React.forwardRef((props: any, ref) => <NavList {...props} forwardedRef={ref} />);
