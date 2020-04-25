import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compareObjects from './compareObjects';

export default class SectionTitle extends Component {
  static propTypes = {
    section: PropTypes.any.isRequired,
    renderSectionTitle: PropTypes.func.isRequired,
    theme: PropTypes.func.isRequired,
    sectionKeyPrefix: PropTypes.string.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return compareObjects(nextProps, this.props);
  }

  render() {
    const { section, renderSectionTitle, theme, sectionKeyPrefix } = this.props;
    const sectionTitle = renderSectionTitle(section);

    if (!sectionTitle) {
      return null;
    }

    return (
      <div {...theme(`${sectionKeyPrefix}title`, 'sectionTitle')}>
        {sectionTitle}
      </div>
    );
  }
}
