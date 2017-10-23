import styles from './Footer.less';

import React from 'react';
import Link from 'Link/Link';

const Footer = () =>
  <div className={styles.container}>
    <div>
      {'Crafted with love by '}
      <Link
        className={styles.link}
        href="https://twitter.com/moroshko"
        underline={false}
      >
        @moroshko
      </Link>
    </div>
    <div className={styles.pageDesign}>
      {'Page design by '}
      <Link
        className={styles.link}
        href="https://twitter.com/vedranio"
        underline={false}
      >
        @vedranio
      </Link>
    </div>
    <div className={styles.licensed}>
      {'Licensed under '}
      <Link
        className={styles.link}
        href="http://moroshko.mit-license.org/"
        underline={false}
      >
        MIT license
      </Link>
    </div>
  </div>;

export default Footer;
