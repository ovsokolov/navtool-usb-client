const electron = require('electron')
var os = require('os');
var HID = require('node-hid')
var log = require('electron-log');
var usbDetect = require('node-usb-detection');
var devices = HID.devices()
const {ipcMain} = require('electron')
const {ipcRenderer} = require('electron')
const { autoUpdater } = require("electron-updater")
const settings = require('electron-settings');
const {download} = require("electron-dl");


const app = electron.app
// Module to control application life.
var environment = 'PROD';
var log_level = 'error';
var open_dev_tool = 'false';
var var_env = 'environment'


var platfor_string = os.platform() + '_' + os.arch()

log.info("data for autoupdate app :\n", app);
log.info("data for autoupdate os : ", platfor_string);


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
let updateWindow


function sendStatusToWindow(text) {
  log.info(text);
  updateWindow.webContents.send('message', text);
}
function createUpdateWindow() {
  mainWindow = null;
  updateWindow = new BrowserWindow();
  updateWindow.setMenu(null)
  updateWindow.on('closed', () => {
    updateWindow = null;
  });
  updateWindow.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  return updateWindow;
}

function createWindow () {
  log.info('createWindow');
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1200, height: 800})

  if(environment == 'DEV') {
    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index_dev.html#v${app.getVersion()}`)

    // Open the DevTools.
  }else{
    mainWindow.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`)
  }

  if(open_dev_tool != 'false'){
      mainWindow.webContents.openDevTools()
  }

  
  mainWindow.setMenu(null)
  mainWindow.webContents.once('dom-ready', () => {
    log.info('###################################');
    download(BrowserWindow.getFocusedWindow(), "https://drive.google.com/uc?export=download&id=10ZvLMpX4zUgKBqMwGKglatyuB1jxEvXl")
    .then(dl => console.log(dl.getSavePath()))
    .catch(console.error);
    //  .then(dl => console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"))
    //  .catch(console.error);
    log.info('###################################');
  })

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
app.on('ready', function()  {
  log.info('load settings');
  if(settings.has('environment')) {
    //log.info("has settings  #######");
    environment = settings.get('environment');
  }else{
    //log.info("rewrite settings");
    settings.set('environment', 'PROD' );
  }

  log.info("environment :\n", environment);

  if(settings.has('log_level')) {
    log_level = settings.get('log_level');
  }else{
    settings.set('log_level', 'error' );
  }

  if(settings.has('open_dev_tool')) {
    open_dev_tool = settings.get('open_dev_tool');
  }else{
    settings.set('open_dev_tool', 'false' );
  }

  if(environment == 'PROD') {
    log.transports.console.level = true;
  }


  log.transports.file.file = app.getPath('userData') + '/app_log.txt';
  log.transports.file.level = log_level;
  log.info(settings.getAll());

  autoUpdater.logger = require("electron-log")
  autoUpdater.logger.transports.file.level = "info"
  autoUpdater.logger.transports.file.file = app.getPath('userData') + '/autoupdater_log.txt';






}); 

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

usbDetect.add(function(device) {
    ////log.info("added device:\n", device.deviceDescriptor);
    //log.info(HID.devices());
    if(device.deviceDescriptor.idVendor == 49745){
    		//log.info("XXX", device.deviceDescriptor);
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


ipcMain.on('device-sbl-status', (event, arg) => {
  ////log.info('Checking Device SBL status....')
		try{
			//wait for 1sec for device to arrive
		  	var devicesList = HID.devices();
			var deviceInfo = devicesList.find( function(d) {
		    	return d.vendorId===49745 && d.productId===278;
			});

			//log.info(deviceInfo);
			mainWindow.webContents.send('device-mfg-id', { mfgid: deviceInfo.serialNumber} );
			device = new HID.HID( deviceInfo.path );


			//log.info("UsagePage: " + deviceInfo.usagePage);
			//log.info("Usage: " + deviceInfo.usage);
			//log.info("Path: " + deviceInfo.path);


	   	isOpen = true
		}
		catch(err){
			//log.info(err)
		}

    	//log.info(device);
		////log.info('before sbl check')
		device.read(function(err,data) {
		//log.info('data recieved for sbl status')
        //log.info(data)
				mainWindow.webContents.send('device-sbl-status', { msg: data} );
		})
    	//log.info('checking SBL status')

		device.write([0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00]);

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


ipcMain.on('check-device', (event, arg) => {
  devices = HID.devices();
  //log.info(devices);
	for (var i = 0; i < devices.length; i++){
		//log.info("@@@@@@@@@@    device found " + devices[i].vendorId)
		if(devices[i].vendorId == 49745){
			mainWindow.webContents.send('device-arrived' , {msg:'device arrived'});
			//log.info("xxxxxxxxxxx    after found")
		}
	}
});

ipcMain.on('device-read-settings', (event, arg) => {

  log.info('before device-read-settings')
  device.read(function(err,data) {
      log.info('data recieved device-read-settings', data);
      mainWindow.webContents.send('device-data-result' , {msg: data});
  })
  device.write([0x00, arg, 0x00, 0x00, 0x00, 0x00, 0x00])
});

ipcMain.on('device-write_data', (event, arg) => {

  log.info('before device-write_data')
  log.info(arg)
  log.info(arg.length)
  device.read(function(err,data) {
      log.info('data recieved device-write_data')
      log.info(data)
      mainWindow.webContents.send('device-data-result' , {msg: data});
  })
  device.write(arg)
});

ipcMain.on('device-obd-status', (event, arg) => {
  log.info('device-obd-status')
  device.read(function(err,data) {
      log.info('data recieved device-obd-status')
      log.info(data)
      mainWindow.webContents.send('device-obd-status' , {msg: data});
  })
  device.write([0x00, arg, 0x00, 0x00, 0x00, 0x00, 0x00]);
});


app.on('ready', function()  {
  log.info('checkForUpdates');
  autoUpdater.checkForUpdates();
}); 

autoUpdater.on('update-downloaded', (ev, info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  setTimeout(function() {
    autoUpdater.quitAndInstall();  
  }, 5000)
})

autoUpdater.on('update-available', (ev, info) => {
  createUpdateWindow();
  sendStatusToWindow('Update available.');
})

autoUpdater.on('error', (ev, err) => {
  sendStatusToWindow('Error in auto-updater.');
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
});
