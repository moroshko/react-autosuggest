import styles from './Header.less';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Link from 'Link/Link';
import GitHub from 'GitHub/GitHub';
import { loadStargazers } from './redux';

function mapStateToProps({ header }) {
  return {
    stargazers: header.stargazers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadStargazers: () => dispatch(loadStargazers())
  };
}

class Header extends Component {
  static propTypes = {
    stargazers: PropTypes.string.isRequired,

    loadStargazers: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.loadStargazers();
  }

  render() {
    const { stargazers } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.logo} />
        <h1 className={styles.header}>
          React Autosuggest
        </h1>
        <div className={styles.subHeader}>
          WAI-ARIA compliant autosuggest component built in React
        </div>
        <a className={styles.button}
           href="https://github.com/moroshko/react-autosuggest#installation"
           target="_blank">
          Get started
        </a>
        <div className={styles.socialLinks}>
          <Link className={styles.stargazersLink}
                href="https://github.com/moroshko/react-autosuggest/stargazers"
                underline={false}>
            {stargazers} stargazers
          </Link>
          <Link className={styles.twitterLink}
                href="https://twitter.com/moroshko"
                underline={false}>
            @moroshko
          </Link>
        </div>
        <GitHub user="moroshko" repo="react-autosuggest" />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
