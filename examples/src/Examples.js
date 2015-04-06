'use strict';

require('./Examples.less');
require('./Autosuggest.less');

import React from 'react';
import classnames from 'classnames';
import BasicExample from './BasicExample/BasicExample';
import CustomRenderer from './CustomRenderer/CustomRenderer';
import MultipleSections from './MultipleSections/MultipleSections';

class Examples extends React.Component {
  constructor() {
    this.examples = [
      'Basic example',
      'Custom renderer',
      'Multiple sections'
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
        {this.examples.map(function(example) {
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
        }, this)}
      </div>
    );
  }
  renderExample() {
    switch (this.state.activeExample) {
      case 'Basic example': return <BasicExample />;
      case 'Custom renderer': return <CustomRenderer />;
      case 'Multiple sections': return <MultipleSections />;
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

export default Examples;
