const electron = require('electron')
var os = require('os');
var HID = require('node-hid')
var log = require('electron-log');
var usbDetect = require('node-usb-detection');
var devices = HID.devices()
const {ipcMain} = require('electron')
const {ipcRenderer} = require('electron')
log.transports.file.file = __dirname + '/log.txt';

var platfor_string = os.platform() + '_' + os.arch()

////log.info("data for autoupdate app :\n", app);
//log.info("data for autoupdate os : ", platfor_string);


// Module to control application life.
const app = electron.app

////log.info("electron version : ", app.getVersion());
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
  mainWindow = new BrowserWindow({width: 1000, height: 800})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

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
	//log.info('device added');
	initListeners()
	mainWindow.webContents.send('device-arrived' , {msg:'device arrived'});

});
*/
usbDetect.add(function(device) {
    ////log.info("added device:\n", device.deviceDescriptor);
    ////log.info(HID.devices());
    if(device.deviceDescriptor.idVendor == 49745){
		    initListeners()
		    setTimeout(function() {
		    	mainWindow.webContents.send('device-arrived' , {msg:'device arrived'});
		    }, 1000);
	  }
});

usbDetect.remove(function(device) {
    //log.info("removed device:\n", device.deviceDescriptor);
    if(device.deviceDescriptor.idVendor == 49745){
		    mainWindow.webContents.send('device-removed' , {msg:'device removed'});
	  }
});



function initListeners(){
	if(isInitialized){
		return;
	}
	isInitialized = true


	ipcMain.on('device-sbl-status', (event, arg) => {
	  ////log.info('Checking Device SBL status....')
	  //event.sender.send('asynchronous-reply', 'pong')
	  //if(!isOpen){
	  //setTimeout(function() {
			try{
				//wait for 1sec for device to arrive
			  	var devicesList = HID.devices();
				var deviceInfo = devices.find( function(d) {

			    	return d.vendorId===49745 && d.productId===278;
				});
				device = new HID.HID( deviceInfo.path );


				//log.info("UsagePage: " + deviceInfo.usagePage);
				//log.info("Usage: " + deviceInfo.usage);
				//log.info("Path: " + deviceInfo.path);

				////log.info('#### openning device....')
		   		//device = new HID.HID(49745, 278)

		   		isOpen = true
			}
			catch(err){
				//log.info(err)
			}

			////log.info('before sbl check')
			device.read(function(err,data) {
			//log.info('data recieved for sbl status')
	        //log.info(data)
					mainWindow.webContents.send('device-sbl-status', { msg: data} );
			})
	    	//log.info('checking SBL status')
			device.write([0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00]);
		//}, 1000);

	});

	ipcMain.on('device-sbl', (event, arg) => {
		//log.info('request SBL')  // prints "ping"
		//device.pause()
		device.removeAllListeners("data")
		device.removeAllListeners("error")
		try {
      		device.write(arg)
		}
		catch(err){
			//device.close()
		}
		finally {
      		//device.close()
		  	//device = null
		}

	});
	////log.info("after init")

}


ipcMain.on('check-device', (event, arg) => {
  devices = HID.devices();
	for (var i = 0; i < devices.length; i++){
		//log.info("@@@@@@@@@@    device found " + devices[i].vendorId)
		if(devices[i].vendorId == 49745){
			initListeners()
			mainWindow.webContents.send('device-arrived' , {msg:'device arrived'});
			////log.info("xxxxxxxxxxx    after found")
		}
	}
});

ipcMain.on('device-read-settings', (event, arg) => {

  //log.info('before device-read-settings')
  device.read(function(err,data) {
      //log.info('data recieved device-read-settings')
      mainWindow.webContents.send('device-data-result' , {msg: data});
  })
  device.write([0x00, arg, 0x00, 0x00, 0x00, 0x00, 0x00])
});

ipcMain.on('device-write_data', (event, arg) => {

  //log.info('before device-write_data')
  //log.info(arg)
  //log.info(arg.length)
  device.read(function(err,data) {
      //log.info('data recieved device-write_data')
      //log.info(data)
      mainWindow.webContents.send('device-data-result' , {msg: data});
  })
  device.write(arg)
});
