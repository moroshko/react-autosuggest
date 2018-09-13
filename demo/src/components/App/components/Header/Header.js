import styles from './Header.less';

import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import Link from 'Link/Link';
import GitHub from 'GitHub/GitHub';

export default class Header extends Component {
  constructor() {
    super();

    this.state = {
      stargazers: '3754'
    };
  }

  componentDidMount() {
    fetch('https://api.github.com/repos/moroshko/react-autosuggest')
      .then(response => response.json())
      .then(response => {
        if (response.stargazers_count) {
          this.setState({
            stargazers: String(response.stargazers_count)
          });
        }
      });
  }

  render() {
    const { stargazers } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.logo} />
        <h1 className={styles.header}>React Autosuggest</h1>
        <div className={styles.subHeader}>
          WAI-ARIA compliant autosuggest component built in React
        </div>
        <a
          className={styles.button}
          href="https://github.com/moroshko/react-autosuggest#installation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get started
        </a>
        <div className={styles.socialLinks}>
          <Link
            className={styles.stargazersLink}
            href="https://github.com/moroshko/react-autosuggest/stargazers"
            underline={false}
          >
            {stargazers} stargazers
          </Link>
          <Link
            className={styles.twitterLink}
            href="https://twitter.com/moroshko"
            underline={false}
          >
            @moroshko
          </Link>
        </div>
        <GitHub user="moroshko" repo="react-autosuggest" />
      </div>
    );
  }
}
