/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 10:13:36
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-07 10:32:04
 */
import PropTypes from 'prop-types';
import BaseComponent from './Base';

class I18n extends BaseComponent {
  static propTypes = {
    render: PropTypes.func.isRequired,
  };

  render() {
    const { renderProps } = this.props as any;
    return renderProps();
  }
}

export default I18n;
