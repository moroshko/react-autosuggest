'use strict';

require('./Examples.less');
require('./Autosuggest.less');

import React, { Component } from 'react';
import classnames from 'classnames';
import BasicExample from './BasicExample/BasicExample';
import CustomRenderer from './CustomRenderer/CustomRenderer';
import MultipleSections from './MultipleSections/MultipleSections';
import EventsPlayground from './EventsPlayground/EventsPlayground';
import EventsLog from './EventsLog/EventsLog';


export default class Examples extends Component {
  constructor() {
    super();

    this.examples = [
      'Basic example',
      'Custom renderer',
      'Multiple sections',
      'Events playground'
    ];

    this.eventsPlaceholder = {
      type: 'placeholder',
      text: 'Once you interact with the Autosuggest, events will appear here.'
    };

    this.eventQueue = [];

    this.state = {
      activeExample: decodeURI(location.hash).split('#')[1] || this.examples[0],
      events: [this.eventsPlaceholder]
    };
  }

  changeExample(example) {
    this.setState({
      activeExample: example
    });
  }

  renderMenu() {
    return (
      <div className="examples__menu">
        {this.examples.map(example => {
          let classes = classnames({
            'examples__menu-item': true,
            'examples__menu-item--active': example === this.state.activeExample
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

  clearEvents() {
    this.setState({
      events: [this.eventsPlaceholder]
    });
  }

  eventsExist() {
    return this.state.events[0].type !== 'placeholder';
  }

  renderEventsLog() {
    if (this.state.activeExample === 'Events playground') {
      return (
        <div className="examples__events-log-wrapper">
          { this.eventsExist() && <button onClick={this.clearEvents.bind(this)}>Clear</button> }
          <EventsLog events={this.state.events} />
        </div>
      );
    }

    return null;
  }

  processEvents() {
    if (this.eventQueue.length > 0) {
      let event = this.eventQueue[0];
      this.setState({
        events: this.eventsExist() ? this.state.events.concat([event]) : [event]
      }, () => {
        this.eventQueue.shift();
        this.processEvents();
      });
    }
  }

  onEventAdded(event) {
    this.eventQueue.push(event);
    if(this.eventQueue.length === 1) {
      this.processEvents();
    }
  }

  renderExample() {
    switch (this.state.activeExample) {
      case 'Basic example': return <BasicExample />;
      case 'Custom renderer': return <CustomRenderer />;
      case 'Multiple sections': return <MultipleSections />;
      case 'Events playground': return <EventsPlayground onEventAdded={this.onEventAdded.bind(this)} />;
    }
  }

  render() {
    return (
      <div className="examples">
        <div className="examples__column">
          {this.renderMenu()}
          {this.renderEventsLog()}
        </div>
        <div className="examples__column">
          {this.renderExample()}
        </div>
      </div>
    );
  }
}
