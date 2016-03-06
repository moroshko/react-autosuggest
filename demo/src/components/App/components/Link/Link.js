import styles from './Link.less';

import React, { PropTypes } from 'react';

export default function Link(props) {
  const { className, href, underline, children } = props;
  const klass =
    (className === null ? '' : className + ' ') +
    (underline ? styles.linkWithUnderline : styles.linkWithoutUnderline);

  return (
    <a className={klass} href={href} target="_blank">
      {children}
    </a>
  );
};

Link.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  underline: PropTypes.bool.isRequired,
  children: PropTypes.node
};

Link.defaultProps = {
  className: null,
  underline: true
};
