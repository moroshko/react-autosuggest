import React, { Component } from 'react';

export default class CustomInput extends Component {
  constructor() {
    super();
    this.state = {
      custom: 42
    };
  }
  render() {
    return (
      <div className="my-custom-input">
        <input {...this.props} />
        <span>(customized)</span>
      </div>
    );
  }
}
