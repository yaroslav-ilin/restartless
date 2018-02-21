import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { createActions, handleActions } from 'redux-actions';

import { FocusApp } from './containers/FocusApp';

// const increment = createAction<'INCREMENT'>('INCREMENT');
// const decrement = createAction<'DECREMENT'>('DECREMENT');
const { increment, decrement } = createActions({
  INCREMENT: (amount: number) => ({ amount }),
  DECREMENT: (amount: number) => ({ amount: -amount }),
});

const reducer = handleActions({
  [increment](state) {
    return { counter: state.counter + 1 };
  },
  [decrement](state) {
    return { counter: state.counter - 1 };
  },
}, {
  counter: 0,
});

const store = createStore(
  reducer,
  /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

render(
  <Provider store={store}>
    <FocusApp />
  </Provider>,
  document.getElementById('react-root'),
);
