import jsdom from 'jsdom';

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;

// Cannot use `import` here because ES6 hoists module imports to the top of
// the file, and the globals above need to be defined before React is required.
require('./plain-list/AutosuggestApp.test');
require('./multi-section/AutosuggestApp.test');
