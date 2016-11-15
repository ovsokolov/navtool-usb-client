require('../less/main.less');

'use strict';
import React from "react";
import ReactDOM from "react-dom";


const {ipcRenderer} = require('electron');
//import { ipcRenderer } from 'eletron';

let isSBL = 1

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})

ipcRenderer.on('device-arrived' , function(event , data){
	console.log('Renderer read device')
		ipcRenderer.send('device-read', 'read device')
});

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

function checkDevice(){
  ipcRenderer.send('check_device');
}

//ReactDOM.render(<div className="myDiv">Hello Electron!</div>, document.getElementById('content'));
ReactDOM.render(
     React.DOM.div({
        children: [
          React.DOM.label({children: 3}),
          React.DOM.button({onClick: checkDevice, children: "Check Device"}),
	        React.DOM.button({onClick: requestSBL, children: "Request SBL"}),
          React.DOM.button({onClick: clearSBL, children: "Clear SBL"}),
        ]
      }), document.getElementById('content'));