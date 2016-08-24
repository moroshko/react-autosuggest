import jsdom from 'jsdom';

global.document = jsdom.jsdom('<!doctype html><html><body><div id="app"></div></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
