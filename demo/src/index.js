import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducer0 from 'App/components/Example0/redux';
import reducer1 from 'App/components/Example1/redux';
import reducer2 from 'App/components/Example2/redux';
import App from 'App/App';

const appReducer = combineReducers({
  0: reducer0,
  1: reducer1,
  2: reducer2
});

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
