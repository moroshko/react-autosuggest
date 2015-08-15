import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from 'App/App';

class Demo extends Component {
  render() {
    return (
      <App />
    );
  }
}

ReactDOM.render(
  <Demo />,
  document.getElementById('demo')
);
