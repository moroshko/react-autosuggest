'use strict';

require('./EventsLog.less');

import React, { Component, PropTypes } from 'react';

export default class EventsLog extends Component { // eslint-disable-line no-shadow
  static propTypes = {
    events: PropTypes.array.isRequired
  }

  renderEvent(event) {
    switch (event.type) {
      case 'placeholder':
        return event.text;

      case 'suggestion-selected':
        return (
          <span>
            <span className="examples__events-log__event-description">Suggestion selected: </span>
            {event.suggestion}
          </span>
        );

      case 'suggestion-focused':
        return (
          <span>
            <span className="examples__events-log__event-description">Suggestion focused: </span>
            {event.suggestion}
          </span>
        );

      case 'suggestion-unfocused':
        return (
          <span>
            <span className="examples__events-log__event-description">Suggestion unfocused: </span>
            {event.suggestion}
          </span>
        );

      case 'input-changed':
        return (
          <span>
            <span className="examples__events-log__event-description">Input changed: </span>
            {event.value || '(empty)'}
          </span>
        );

      case 'input-blurred':
        return (
          <span>
            <span className="examples__events-log__event-description">Input blurred</span>
          </span>
        );
    }
  }

  render() {
    return (
      <div className="examples__events-log" ref="eventsLogWrapper">
        {this.props.events.map((event, index) => {
          const classes = 'examples__events-log__event ' +
                          'examples__events-log__event--' + event.type;

          return (
            <div className={classes} key={index}>
              {this.renderEvent(event)}
            </div>
          );
        })}
      </div>
    );
  }
}
