import es6promise from 'es6-promise';
import React from 'react';
import { render } from 'react-dom';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import header from 'App/components/Header/redux';
import App from 'App/App';

es6promise.polyfill(); // Required, because `Promise` is undefined in IE.

const appReducer = combineReducers({
  header
});

const store = applyMiddleware(thunk)(createStore)(appReducer);

const Demo = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

render(
  <Demo />,
  document.getElementById('demo')
);
