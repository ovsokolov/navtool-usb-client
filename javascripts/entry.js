require('../less/main.less');

'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise'
import ReduxThunk from 'redux-thunk';


import App from './components/app';
import reducers from './reducers';

//const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);
const createStoreWithMiddleware = applyMiddleware(ReduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('content')
);
