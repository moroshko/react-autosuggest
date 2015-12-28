import styles from './Link.less';

import React from 'react';

export default function Link(props) {
  const { href, children } = props;

  return (
    <a className={styles.link} href={href} target="_blank">
      {children}
    </a>
  );
};
