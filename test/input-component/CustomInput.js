import React, { Component } from 'react';

export default class CustomInput extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <input {...this.props} />
        <div>custom stuff</div>
      </div>
    );
  }
}
