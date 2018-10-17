const electron = require('electron')
var os = require('os');
var fs = require('fs');
var HID = require('node-hid')
var log = require('electron-log');
var usbDetect = require('node-usb-detection');
var devices = HID.devices()
const {ipcMain} = require('electron')
const {ipcRenderer} = require('electron')
const { autoUpdater } = require("electron-updater")
const settings = require('electron-settings');
const {download} = require("electron-dl");
var exec = require('child_process').exec;


var eventname='';

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

function executeQS(extension){
  let commandstr = "";
  if(os.platform() == 'darwin'){
    commandstr = "open " + app.getPath('downloads') + '/TeamViewerQS.' + extension;
  }else{
    commandstr = "cmd /K " + app.getPath('downloads') + '\\TeamViewerQS.' + extension;
  }
  console.log(commandstr);
  mainWindow.webContents.send('teamviewer-opened' , {msg:'teamviewer opened'});
  child = exec(commandstr, function (error, stdout, stderr) {
    console.log("after command");
    //mainWindow.webContents.send('teamviewer-opened' , {msg:'teamviewer opened'});
    log.info('stdout: ' + stdout);
    log.info('stderr: ' + stderr);
    if (error !== null) {
      console.log("error command");
      console.log('exec error: ' + error);
    }
  });
}

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

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })


}

function getDevice () {
      var devicesList = HID.devices();
      //console.log("in status");
      //console.log(devicesList);
      //log.info(devicesList);
      //console.log("in status end");
      var deviceInfo = devicesList.find( function(d) {
          return d.vendorId===49745 && d.productId===278;
      });
      return deviceInfo;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function()  {
  log.info('load settings');
  if(settings.has('environment')) {
    log.info("has settings  #######");
    environment = settings.get('environment');
  }else{
    log.info("rewrite settings");
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
  //console.log("user data");
  //console.log(app.getPath('userData'));
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
    //console.log("in add");
    //console.log(device);
    //console.log("after in add");
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
    log.info('Checking Device SBL status....')
		try{
			//wait for 1sec for device to arrive
      var deviceInfo = undefined;
      while(deviceInfo == undefined){
        //console.log("undefined");
        log.info("undefined");
        deviceInfo = getDevice();
      }
      log.info("after undefined");
      //console.log("after undefined");
      /*
		  var devicesList = HID.devices();
      console.log("in status");
      console.log(devicesList);
      log.info(devicesList);
      console.log("in status end");
			var deviceInfo = devicesList.find( function(d) {
		    	return d.vendorId===49745 && d.productId===278;
			});
      */
			log.info(deviceInfo);
      log.info(deviceInfo.serialNumber);
      log.info(deviceInfo.serialNumber.length);

      var serialNumber = "";
      if(deviceInfo.serialNumber.startsWith('UM')){
        //console.log("Length: " + deviceInfo.serialNumber.trim().length);
        //console.log(deviceInfo.serialNumber[6].charCodeAt(0));
        //console.log(deviceInfo.serialNumber.substring(0,6));
        //console.log(deviceInfo.serialNumber.substring(0,6) + deviceInfo.serialNumber[6].charCodeAt(0));
        //console.log("CHAR: " + String.fromCharCode(deviceInfo.serialNumber[6].charCodeAt(0)));
        //console.log("CHAR Length: " + String.fromCharCode(deviceInfo.serialNumber[6].charCodeAt(0)).length);
        //console.log(parseInt(deviceInfo.serialNumber[6].charCodeAt(0).toString(16)));
        //console.log(parseInt(deviceInfo.serialNumber[7].charCodeAt(0).toString(16)));
        if( String.fromCharCode(deviceInfo.serialNumber[6].charCodeAt(0)) == 'U'){
          serialNumber = deviceInfo.serialNumber;
        }else{
          //console.log("in else");
          serialNumber = deviceInfo.serialNumber.substring(0,6) + deviceInfo.serialNumber[6].charCodeAt(0);
        }        
      }else{
        serialNumber = deviceInfo.serialNumber;
      }
      //log.info(serialNumber);
      
			mainWindow.webContents.send('device-mfg-id', { mfgid: serialNumber} );
			device = new HID.HID( deviceInfo.path );
      try {
        device.on('data', function(data) {
          //log.info("start data event");
          if(eventname == 'device-sbl-status'){
            log.info('#####event data recieved for sbl status')
            //log.info(data)
            mainWindow.webContents.send('device-sbl-status', { msg: data} );          
          }
          if(eventname == 'device-data-result'){
            log.info('######event data recieved device-data-result', data);
            mainWindow.webContents.send('device-data-result' , {msg: data});       
          }
          if(eventname == 'device-setting-result'){
            log.info('######event data recieved device-read-settings', data);
            mainWindow.webContents.send('device-data-result' , {msg: data});       
          }
          if(eventname == 'device-obd-status'){
            log.info('##### data recieved device-obd-status')
            log.info(data)
            mainWindow.webContents.send('device-obd-status' , {msg: data});  
          }
        } );
      } catch (err) {
        log.info(err);
      }
      device.removeAllListeners("error")
      device.on('error', function(error) {
        log.info("event error");
      } );

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
    /* remove read
		device.read(function(err,data) {
		//log.info('data recieved for sbl status')
        //log.info(data)
				mainWindow.webContents.send('device-sbl-status', { msg: data} );
		})
    */
    //log.info('checking SBL status')
    eventname = 'device-sbl-status';
		device.write([0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00]);

});

ipcMain.on('device-sbl', (event, arg) => {
	//log.info('request SBL')  // prints "ping"
	//device.pause()
	device.removeAllListeners("data")
	//device.removeAllListeners("error")
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

  //log.info('before device-read-settings')
  /* remove read
  device.read(function(err,data) {
      //log.info('data recieved device-read-settings', data);
      mainWindow.webContents.send('device-data-result' , {msg: data});
  })
  */
  eventname = 'device-setting-result';
  device.write([0x00, arg, 0x00, 0x00, 0x00, 0x00, 0x00])
});

ipcMain.on('device-write_data', (event, arg) => {

  log.info('before device-write_data')
  log.info(arg)
  log.info(arg.length)
  /* remove read
  device.read(function(err,data) {
      log.info('data recieved device-write_data')
      log.info(data)
      mainWindow.webContents.send('device-data-result' , {msg: data});
  })
  */
  eventname = 'device-data-result';
  device.write(arg)
});

ipcMain.on('device-obd-status', (event, arg) => {
  log.info('device-obd-status')
  /* remove read
  device.read(function(err,data) {
      log.info('data recieved device-obd-status')
      log.info(data)
      mainWindow.webContents.send('device-obd-status' , {msg: data});
  })
  */
  eventname = 'device-obd-status';
  device.write([0x00, arg, 0x00, 0x00, 0x00, 0x00, 0x00]);
});

ipcMain.on('start-support', (event, arg) => {
    if(os.platform() == 'darwin'){
      console.log(app.getPath('downloads'));
      if (fs.existsSync(app.getPath('downloads') + '/TeamViewerQS.dmg')) {
        console.log('QS found');
        executeQS('dmg');
      }else{
        console.log('QS not found');
        download(BrowserWindow.getFocusedWindow(), "http://034b227.netsolhost.com/updater/TeamViewerQS.dmg")
        .then(dl => executeQS('dmg'))
        .catch(console.error);
      }
    }else{
      //windows
      console.log(app.getPath('downloads'));
      if (fs.existsSync(app.getPath('downloads') + '\\TeamViewerQS.exe')) {
        console.log('QS found');
        executeQS('exe');
      }else{
        console.log('QS not found');
        download(BrowserWindow.getFocusedWindow(), "http://034b227.netsolhost.com/updater/TeamViewerQS.exe")
        .then(dl => executeQS('exe'))
        .catch(console.error);
      }
    }
});

ipcMain.on('install-bootloader', (event, arg) => {
  console.log("main install-bootloader");
  console.log(arg);
  let commandstr = "";
  //commandstr = 'open -a Terminal' + '\\ ' + '\"' + arg.path + '\"' ;
  commandstr = 'cmd /K' + '\ ' + '-f' + '\ ' + '\"' + arg.path + '\"' + '\ ' + '-t' + '\"' + arg.target + '\"';
  console.log(commandstr);
  child = exec(commandstr, function (error, stdout, stderr) {
    console.log("after command");
    //mainWindow.webContents.send('teamviewer-opened' , {msg:'teamviewer opened'});
    log.info('stdout: ' + stdout);
    log.info('stderr: ' + stderr);
    if (error !== null) {
      console.log("error command");
      console.log('exec error: ' + error);
    }
  });
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
