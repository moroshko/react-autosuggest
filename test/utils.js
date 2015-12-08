const reactAttributesRegex = / data-react[-\w]+="[^"]+"/g;

// See: http://stackoverflow.com/q/28979533/247243
function stripReactAttributes(html) {
  return html.replace(reactAttributesRegex, '');
}

export {
  stripReactAttributes
};
