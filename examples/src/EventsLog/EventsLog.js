'use strict';

require('./EventsLog.less');

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class EventsLog extends Component {
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
    }
  }

  render() {
    return (
      <div className="examples__events-log">
        {this.props.events.map((event, index) => {
          let classes = 'examples__events-log__event ' +
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
