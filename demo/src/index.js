import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import appReducer from 'flux/reducers/app';
import App from 'App/App';

const store = applyMiddleware(thunk)(createStore)(appReducer);

class Demo extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

ReactDOM.render(
  <Demo />,
  document.getElementById('demo')
);
