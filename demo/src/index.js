import React from 'react';
import { render } from 'react-dom';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import header from 'App/components/Header/redux';
import App from 'App/App';

const appReducer = combineReducers({
  header
});

const store = applyMiddleware(thunk)(createStore)(appReducer);

function Demo() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

render(
  <Demo />,
  document.getElementById('demo')
);
