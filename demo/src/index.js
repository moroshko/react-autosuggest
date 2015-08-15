import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import appReducer from 'flux/reducers/app';
import App from 'App/App';

class Demo extends Component {
  constructor() {
    super();

    this.store = createStore(appReducer);
  }

  render() {
    return (
      <Provider store={this.store}>
        {() => <App />}
      </Provider>
    );
  }
}

ReactDOM.render(
  <Demo />,
  document.getElementById('demo')
);
