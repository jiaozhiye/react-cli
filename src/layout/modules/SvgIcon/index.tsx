/*
 * @Author: 焦质晔
 * @Date: 2023-05-13 13:48:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-05-13 13:51:21
 */
import React from 'react';
import classNames from 'classnames';

type IProps = {
  svgUrl: string;
  className?: string;
};

const SvgIcon: React.FC<IProps> = (props) => {
  const { svgUrl, className } = props;
  const [svgContent, setSvgContent] = React.useState<string>();

  const fetchSvg = async () => {
    try {
      const res = await fetch(svgUrl);
      const svgText = await res.text();
      setSvgContent(svgText);
    } catch (err) {
      // ...
    }
  };

  React.useEffect(() => {
    fetchSvg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgUrl]);

  return svgContent ? (
    <span
      className={classNames('anticon', className)}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  ) : null;
};

SvgIcon.displayName = 'SvgIcon';

export default SvgIcon;
