import styles from './Footer.less';

import React from 'react';
import Link from 'Link/Link';

export default function Footer() {
  return (
    <div className={styles.container}>
      <div>
        {'Crafted with love by '}
        <Link
          className={styles.link}
          href="https://twitter.com/moroshko"
          underline={false}>
          @moroshko
        </Link>
      </div>
      <div className={styles.pageDesign}>
        {'Page design by '}
        <Link
          className={styles.link}
          href="https://twitter.com/ThatBaldUXGuy"
          underline={false}>
          @thatbalduxguy
        </Link>
      </div>
      <div className={styles.licensed}>
        {'Licensed under '}
        <Link
          className={styles.link}
          href="http://moroshko.mit-license.org/"
          underline={false}>
          MIT license
        </Link>
      </div>
    </div>
  );
}
