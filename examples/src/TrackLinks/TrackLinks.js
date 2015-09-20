import React, { Component } from 'react';

export default class TrackLinks extends Component {
  componentDidMount() {
    if (typeof analytics !== 'object') {
      return;
    }

    const links = this.refs.children.querySelectorAll('a');
    const linksCount = links.length;

    for (let i = 0; i < linksCount; i++) {
      const link = links[i];
      const linkName = link.dataset.linkName;
      const event = `Clicked [${linkName}] link`;

      analytics.trackLink(link, event);
    }
  }

  render() {
    const { children } = this.props;

    return (
      <div ref="children">
        {children}
      </div>
    );
  }
}
