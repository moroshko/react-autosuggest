'use strict';

require('./Examples.less');
require('./Autosuggest.less');

import React, { Component } from 'react';
import classnames from 'classnames';
import BasicExample from './BasicExample/BasicExample';
import CustomRenderer from './CustomRenderer/CustomRenderer';
import MultipleSections from './MultipleSections/MultipleSections';
import TwoOrMoreCharacters from './TwoOrMoreCharacters/TwoOrMoreCharacters';

export default class Examples extends Component {
  constructor() {
    this.examples = [
      'Basic example',
      'Custom renderer',
      'Multiple sections',
      '2 or more characters'
    ];

    this.state = {
      activeExample: decodeURI(location.hash).split('#')[1] || this.examples[0]
    };
  }
  changeExample(example) {
    this.setState({
      activeExample: example
    });
  }
  renderMenu() {
    return (
      <div className="examples-menu">
        {this.examples.map(example => {
          let classes = classnames({
            'examples-menu__item': true,
            'examples-menu__item--active': example === this.state.activeExample
          });

          return (
            <div className={classes}
                 key={example}
                 onClick={this.changeExample.bind(this, example)}>
              {example}
            </div>
          );
        })}
      </div>
    );
  }
  renderExample() {
    switch (this.state.activeExample) {
      case 'Basic example': return <BasicExample />;
      case 'Custom renderer': return <CustomRenderer />;
      case 'Multiple sections': return <MultipleSections />;
      case '2 or more characters': return <TwoOrMoreCharacters />;
    }
  }
  render() {
    return (
      <div className="examples">
        {this.renderMenu()}
        {this.renderExample()}
      </div>
    );
  }
}
