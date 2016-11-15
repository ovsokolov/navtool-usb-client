// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron')

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

requestSBL = function(){
	console.log('Request SBL')
	ipcRenderer.send('device-sbl', 0x80)
}

clearSBL = function(){
	console.log('Clear SBL')
	ipcRenderer.send('device-sbl', 0x08)
	ipcRenderer.send('device-sbl', 0x09)
}

ipcRenderer.send('check_device')



