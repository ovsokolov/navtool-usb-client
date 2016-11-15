const electron = require('electron')
var HID = require('node-hid')
var log = require('electron-log');
var usbDetect = require('node-usb-detection');
var devices = HID.devices()
const {ipcMain} = require('electron')
const {ipcRenderer} = require('electron')
log.transports.file.file = __dirname + '/log.txt';







// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow


let device
let devicePath

let isOpen = false
let isInitialized = false

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.setMenu(null)


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
/*
usbDetect.on('add:49745:278', function(device) {
	log.info('device added');
	initListeners()
	mainWindow.webContents.send('device-arrived' , {msg:'device arrived'});

});
*/
usbDetect.add(function(device) {
    log.info("added device:\n", device.deviceDescriptor);
    if(device.deviceDescriptor.idVendor == 49745){
		log.info("in if 1 ")
		initListeners()
		log.info("in if 2 ")
		mainWindow.webContents.send('device-arrived' , {msg:'device arrived'});
	}
});



function initListeners(){
	if(isInitialized){
		return;
	}
	isInitialized = true
	log.info('xxxxxxxxxxxxxxxxxxxxxxxxxxxx')

	ipcMain.on('device-read', (event, arg) => {
		log.info('in device read')
	  //event.sender.send('asynchronous-reply', 'pong')
	   	//if(!isOpen){
		try{
	   		device = new HID.HID(49745, 278)

	   		isOpen = true
		}
		catch(err){
			log.info(err)
		}

	  	log.info('2')

		log.info('device read')
		/*
		device.on("data", function(data) {
			//for(var i = 0; i < data.length; i++){

				//var letter = String.fromCharCode(data[i]);
				log.info('data recieved in main')
				mainWindow.webContents.send('device-data' , {msg: data});
			//}
		})
        */
		log.info('before read')
		device.read(function(err,data) {
			//for(var i = 0; i < data.length; i++){

				//var letter = String.fromCharCode(data[i]);
				log.info('data recieved in main function')
				mainWindow.webContents.send('device-data' , {msg: data});
		})
		device.write([0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00])
	});

	ipcMain.on('device-sbl', (event, arg) => {
		//log.info('request SBL')  // prints "ping"
		//device.pause()
		device.removeAllListeners("data")
		device.removeAllListeners("error")
		try {
			//log.info('bwfore request SBL')
			device.write([0x00, arg, 0x00, 0x00, 0x00, 0x00, 0x00])
			//log.info('after request SBL')

		}

		catch(err){
			//log.info('error!!!')
			//device.close()
		}
		finally {
			//log.info('finally!!!')
            //device.close()
		    //device = null
		}

	});
	log.info("after init")

}


ipcMain.on('check_device', (event, arg) => {
	for (var i = 0; i < devices.length; i++){
		log.info("device found " + devices[i].vendorId)
		if(devices[i].vendorId == 49745){
			initListeners()
			mainWindow.webContents.send('device-arrived' , {msg:'device arrived'});
			log.info("after found")
		}
	}

});


