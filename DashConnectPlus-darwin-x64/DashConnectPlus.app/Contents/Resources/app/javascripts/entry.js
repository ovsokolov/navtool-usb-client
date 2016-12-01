/*require('../less/main.less');*/

'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise'
import ReduxThunk from 'redux-thunk';


const {ipcRenderer} = require('electron');
//import { ipcRenderer } from 'eletron';

let isSBL = 1

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})

//ipcRenderer.on('device-arrived' , function(event , data){
//	console.log('Renderer read device')
//		ipcRenderer.send('device-read', 'read device')
//});

ipcRenderer.on('device-data' , function(event , data){
	console.log('Renderer data recieved')
	console.log(data)
});


function add() {
    console.log("add");
  }

function subtract() {
    console.log("subtruct");
}

function requestSBL(){
  console.log('Request SBL');
  ipcRenderer.send('device-sbl', 0x80);
}

function clearSBL(){
  console.log('Clear SBL');
  ipcRenderer.send('device-sbl', 0x08);
  ipcRenderer.send('device-sbl', 0x09);
}

//function checkDevice(){
//  ipcRenderer.send('check-device');
//}

import App from './components/app';
import reducers from './reducers';

//const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);
const createStoreWithMiddleware = applyMiddleware(ReduxThunk)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <App />
  </Provider>
  , document.getElementById('content')
);
