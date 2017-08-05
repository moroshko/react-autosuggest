import styles from './Features.less';

import React from 'react';
import Link from 'Link/Link';

const Features = () =>
  <div className={styles.container}>
    <h2 className={styles.header}>Features</h2>
    <div className={styles.content}>
      <div className={styles.feature}>
        <div className={styles.accessibleIcon} />
        <div className={styles.featureName}>Accessible</div>
        <div className={styles.featureDescription}>
          <Link
            className={styles.link}
            href="https://rawgit.com/w3c/aria-practices/master/aria-practices-DeletedSectionsArchive.html#autocomplete"
          >
            WAI-ARIA compliant
          </Link>
          , with support for ARIA attributes and keyboard interactions.
        </div>
      </div>
      <div className={styles.feature}>
        <div className={styles.mobileFriendlyIcon} />
        <div className={styles.featureName}>Mobile friendly</div>
        <div className={styles.featureDescription}>
          Works well on those little devices you carry around in your hands.
        </div>
      </div>
      <div className={styles.feature}>
        <div className={styles.customizableIcon} />
        <div className={styles.featureName}>Customizable</div>
        <div className={styles.featureDescription}>
          Supports custom suggestion rendering, multiple sections, and more.
        </div>
      </div>
    </div>
    <div className={styles.footer}>
      {'Check out the '}
      <Link
        className={styles.link}
        href="https://github.com/moroshko/react-autosuggest#features"
      >
        GitHub page
      </Link>
      {' for a full list of features.'}
    </div>
  </div>;

export default Features;
