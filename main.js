const electron = require('electron')
var os = require('os');
var fs = require('fs');
var HID = require('node-hid')
var log = require('electron-log');
var usbDetect = require('usb-detection');
var devices = HID.devices()
const {ipcMain} = require('electron')
const {ipcRenderer} = require('electron')
const { autoUpdater } = require("electron-updater")
const settings = require('electron-settings');
var exec = require('child_process').exec;
const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;
var chokidar = require('chokidar');
var watcher = chokidar.watch('./', { ignoreInitial: true });

const path = require('path')
const url = require('url')

var eventname='';
var flashfirmware='';

//4=LPC17XX,3=LPC18xx
var mcu_type='';

const app = electron.app
const Menu = require('electron').Menu
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

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)



function createWindow () {
  log.info('createWindow');
  // Create the browser window.
  webPreferences: {
  nodeIntegration: true
}
  mainWindow = new BrowserWindow({
    width: 1200, height: 800,
    webPreferences: {nodeIntegration: true}  
  })

  if(environment == 'DEV') {
    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index_dev.html#v${app.getVersion()}`)

    // Open the DevTools.
  }else{
    mainWindow.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`)
    //mainWindow.loadURL(`file://${__dirname}/index_dev.html#v${app.getVersion()}`)
  }

  if(open_dev_tool != 'false'){
      mainWindow.webContents.openDevTools()
  }
  mainWindow.webContents.openDevTools();
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
      console.log("in status");
      console.log(devicesList);
      log.info(devicesList);
      console.log("in status end");
      var deviceInfo = devicesList.find( function(d) {
          return d.vendorId===8137 && d.productId===129;
      });
      return deviceInfo;
}

function createMenu() {
  const application = {
    label: "Application",
    submenu: [
      {
        label: "About Application",
        selector: "orderFrontStandardAboutPanel:"
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => {
          app.quit()
        }
      }
    ]
  }

  const edit = {
    label: "Edit",
    submenu: [
      {
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        selector: "undo:"
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        selector: "redo:"
      },
      {
        type: "separator"
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        selector: "cut:"
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        selector: "selectAll:"
      }
    ]
  }

  const template = [
    application,
    edit
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
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
  console.log("user data");
  console.log(app.getPath('userData'));
  log.transports.file.level = log_level;
  log.info(settings.getAll());

  autoUpdater.logger = require("electron-log")
  autoUpdater.logger.transports.file.level = "info"
  autoUpdater.logger.transports.file.file = app.getPath('userData') + '/autoupdater_log.txt';

}); 

//app.on('ready', createWindow)
app.on('ready', () => {
  createWindow()
  createMenu()
})


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

usbDetect.startMonitoring();

usbDetect.on('add', function(device) {
    console.log("in add");
    console.log(device);
    console.log(device.vendorId);
    console.log("after in add");
    //vendorId: 8137
    //productId: 129
    ////log.info("added device:\n", device.deviceDescriptor);
    //log.info(HID.devices());
    if(device.vendorId == 8137){
        //log.info("XXX", device.deviceDescriptor);
        setTimeout(function() {
          mainWindow.webContents.send('device-arrived' , {msg:'device arrived'});
        }, 1000);
    }
});


usbDetect.on('remove', function(device) {
    //log.info("removed device:\n", device.deviceDescriptor);
    if(device.vendorId == 8137){
		    mainWindow.webContents.send('device-removed' , {msg:'device removed'});
	  }
});


ipcMain.on('device-read-settings', (event, arg) => {
    log.info('Getting Device Data Settings....')
		try{
			//wait for 1sec for device to arrive
      var deviceInfo = undefined;
      while(deviceInfo == undefined){
        //console.log("undefined");
        log.info("undefined");
        deviceInfo = getDevice();
      }
      log.info("after undefined");

			log.info(deviceInfo);
      log.info(deviceInfo.serialNumber);
      log.info(deviceInfo.serialNumber.length);

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
            let softwaredata = {};
            if(flashfirmware != ''){
                  softwaredata = db.get('firmwares')
                    .find({ firmware: flashfirmware })
                    .value().data[0];
            }
            let type = {};
            if(mcu_type != ''){
              //GET SUFFIX
              console.log('####### CHECKING SUFFIX ########', db.get('mcu_types'));
              type = db.get('mcu_types')
                    .find({ type: mcu_type })
                    .value().data[0];
            }
            console.log(softwaredata);
            console.log('####### MCU TYPE ########', mcu_type);
            console.log('####### TYPE ########', type);
            mainWindow.webContents.send('device-data-result' , {msg: data, device: flashfirmware, software: softwaredata, mcu_type: type}); 
            flashfirmware = '';  
            mcu_type = '';    
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

    eventname = 'device-setting-result';
		device.write([0x00, arg, 0x00, 0x00, 0x00, 0x00, 0x00]);

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
		if(devices[i].vendorId == 8137){
			mainWindow.webContents.send('device-arrived' , {msg:'device arrived'});
			//log.info("xxxxxxxxxxx    after found")
		}
	}
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

ipcMain.on('device-write-test-event', (event, arg) => {

  log.info('before device-write-test-event')
  log.info(arg)
  log.info(arg.length)
  /* remove read
  device.read(function(err,data) {
      log.info('data recieved device-write_data')
      log.info(data)
      mainWindow.webContents.send('device-data-result' , {msg: data});
  })
  */
  device.write(arg)
});


ipcMain.on('install-bootloader', (event, arg) => {
  console.log("main install-bootloader");
  console.log(arg);
  let commandstr = "";
  //let keilpath = db.get('keilpath')
  //                   .value(); 
  
  let bootloaders = db.get('bootloaders')
                  .value();
  var btl = bootloaders.filter(obj => {
    return obj.bootloader == arg.target
  });
  var bootloader = btl[0].data[0].bootloader; 
  var keilpath = btl[0].data[0].keilpath; 
  //flashfirmware = firmware[0].data[0].btl_id;
  flashfirmware = btl[0].data[0].btl_id;
  //commandstr = 'open -a Terminal' + '\\ ' + '\"' + arg.path + '\"' ;
  commandstr = 'cmd /K UV4' + '\ ' + '-f' + '\ ' + '\"' + keilpath + '\"' + '\ ' + '-t' + '\"' + bootloader + '\"';
  //commandstr = 'start cmd.exe /K navtool.bat';
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

ipcMain.on('install-application', (event, arg) => {
  console.log("main install-application");
  console.log(arg);
  let commandstr = "";
  //commandstr = 'open -a Terminal' + '\\ ' + '\"' + arg.path + '\"' ;
  flashfirmware = arg.target;
  mcu_type = arg.mcu_type;
  //let keilpath = db.get('keilpath')
  //                 .value(); 
  //commandstr = 'cmd /K UV4' + '\ ' + '-f' + '\ ' + '\"' + keilpath + '\"' + '\ ' + '-t' + '\"' + arg.target + '\"';

  let firmwares = db.get('firmwares')
                  .value();
  var firmware = firmwares.filter(obj => {
    return obj.firmware == arg.target
  });
  var batchfile = firmware[0].data[0].batch_file;  

  commandstr = 'start cmd.exe /K ' + batchfile + ' ' + flashfirmware + ' ' + mcu_type;    
  //commandstr = 'start cmd.exe /K navtool-x.bat';                    
  console.log(commandstr);
  child = exec(commandstr, function (error, stdout, stderr) {
    console.log("after command");
    log.info('stdout: ' + stdout);
    log.info('stderr: ' + stderr);
    log.info('error: ' + error);
    if (error !== null) {
      console.log("error command");
      console.log('exec error: ' + error);
    }
    if(fs.existsSync('errorflash.log')) {
      flashfirmware = '';
      mcu_type = '';
      console.log("Error file exists.");
      mainWindow.webContents.send('image-flash', {msg: 'ERROR', mcu: arg.mcu_serial});
    }
  })
});

ipcMain.on('install-images', (event, arg) => {
  console.log("install-images");
  console.log(arg);
  let commandstr = "";
  commandstr = 'start cmd.exe /K navtool.bat';
  console.log(commandstr);
  child = exec(commandstr, function (error, stdout, stderr) {
    console.log("after command");
    mainWindow.webContents.send('image-flash', {msg: 'SUCCESS', mcu: arg.mcu_serial});
    //mainWindow.webContents.send('image-flash', {msg: 'ERROR', mcu: arg.mcu_serial});
    log.info('stdout: ' + stdout);
    log.info('stderr: ' + stderr);
    log.info('error: ' + error);
    if (error != null) {
      console.log("error command");
      console.log('exec error: ' + error);
    }
  });
});

ipcMain.on('print-label', (event, arg) => {
  console.log("print-label");
  console.log(arg);
  let commandstr = "";
  commandstr = `start cmd.exe /K replp.bat  ${arg.mfgId} ${arg.deviceId}`;
  console.log(commandstr);
  child = exec(commandstr, function (error, stdout, stderr) {
    console.log("after command");
    log.info('stdout: ' + stdout);
    log.info('stderr: ' + stderr);
    log.info('error: ' + error);
    if (error != null) {
      console.log("error command");
      console.log('exec error: ' + error);
    }
  });

});

ipcMain.on('load-interfaces-list', (event, arg) => {
   let firmwares = db.get('firmwares')
                .value(); 
   let mcu_types = db.get('mcu_types')
                .value();                 
   mainWindow.webContents.send('interfaces-list',{firmwares: firmwares, mcu_types: mcu_types}); 
});
