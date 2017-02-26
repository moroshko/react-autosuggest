<a name="gettingTheInputElement"></a>
### How do I get the input element?

The input element is available on the Autosuggest instance as `input`.

You could store the input element like this:

```js
function storeInputReference(autosuggest) {
  if (autosuggest !== null) {
    this.input = autosuggest.input;
  }
}

<Autosuggest ref={storeInputReference} ... />
```

[Codepen example](http://codepen.io/moroshko/pen/WryOMP)

<a name="limitSuggestionsContainerScrolling"></a>
### How do I limit the scrolling of the suggestions container to the container itself?

When the suggestions container has a scroll bar, and you scroll beyond the start/end of the container, the page starts scrolling. To stop that, you can use [`react-isolated-scroll`](https://github.com/markdalgleish/react-isolated-scroll):

```js
import IsolatedScroll from 'react-isolated-scroll';

function renderSuggestionsContainer({ containerProps, children }) {
  const { ref, ...restContainerProps } = containerProps;
  const callRef = isolatedScroll => {
    if (isolatedScroll !== null) {
      ref(isolatedScroll.component);
    }
  };

  return (
    <IsolatedScroll ref={callRef} {...restContainerProps}>
      {children}
    </IsolatedScroll>
  );
}

<Autosuggest renderSuggestionsContainer={renderSuggestionsContainer} ... />
```
