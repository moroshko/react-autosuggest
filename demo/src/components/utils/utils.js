// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function randomDelay() {
  return 100 + Math.random() * 1000;
}

export {
  escapeRegexCharacters,
  randomDelay
};
