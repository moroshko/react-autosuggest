import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import minimalSetup from 'App/components/MinimalSetup/redux';
import multipleSections from 'App/components/MultipleSections/redux';
import asyncExample from 'App/components/AsyncExample/redux';
import debouncedExample from 'App/components/DebouncedExample/redux';
import cachingExample from 'App/components/CachingExample/redux';
import App from 'App/App';

const appReducer = combineReducers({
  minimalSetup,
  multipleSections,
  asyncExample,
  debouncedExample,
  cachingExample
});

const store = applyMiddleware(thunk)(createStore)(appReducer);

function Demo() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

ReactDOM.render(
  <Demo />,
  document.getElementById('demo')
);
