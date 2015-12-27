import styles from './Header.less';

import React, { PropTypes } from 'react';
import GitHub from 'GitHub/GitHub';

export default function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.logo} />
      <h1 className={styles.h1}>
        React Autosuggest
      </h1>
      <h2>
        <a href="https://www.w3.org/TR/wai-aria-practices/#autocomplete" target="_blank">
          WAI-ARIA compliant
        </a> React autosuggest component
      </h2>
      <GitHub user="moroshko" repo="react-autosuggest" />
    </div>
  );
}
