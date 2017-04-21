import es6promise from 'es6-promise';
import React from 'react';
import { render } from 'react-dom';
import App from 'App/App';

es6promise.polyfill(); // Required, because `Promise` is undefined in IE.

render(<App />, document.getElementById('demo'));
