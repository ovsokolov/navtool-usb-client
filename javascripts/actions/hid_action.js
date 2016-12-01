const {ipcRenderer} = require('electron');

export const INIT_IPC = 'INIT_IPC';

import { fetchDeviceDBData } from './get_device_data';
import { store } from '../entry'

export function hidAction(hid_action){
  console.log("initializing HID");
  switch (hid_action){
    case INIT_IPC:
      initIPC();
  }
  return {
    type: INIT_IPC,
    payload: ""
  };
}

function initIPC(){
  ipcRenderer.on('device-arrived',handleDeviceArrived);
  ipcRenderer.on('device-sbl-status',handleDeviceSBLStatus);
  ipcRenderer.on('device-data-result',handleDeviceDataResult);
}

function handleDeviceArrived(event, data){
      console.log('Device Arrived Handling Action....');
      console.log(data);
      readDeviceSBLStatus()
}

function readDeviceSettings(){
  console.log('Read Device System Data Action');
  ipcRenderer.send('device-read-settings', 0x1A);

}

function readDeviceSBLStatus(){
  console.log('Read SBL Status Action');
  ipcRenderer.send('device-sbl-status', 0x01);
}

function handleDeviceSBLStatus(event, data){
    console.log('SBL Status handling Action');
    console.log(data);
    console.log('XXXXXXXXXXXXX');
    let msg = data["msg"]
    if(msg[1] == 0){
      console.log("SBL");
    }else{
      console.log("APP");
      readDeviceSettings()
    }
}

function handleDeviceDataResult(event, data){
    console.log('Handle Device settings Action');
    console.log(data);
    let msg = data["msg"];
    let action = msg[0];
    let usbResult = msg[1];
    let serial_number = ""
    let hexStringFrmt = "00"
    let binaryStringFrmt = "00000000"
    let softwareId = ""; //[19][18]
    let softwareBuild = ""; //[20]
    let bareNum;
    console.log("action:", action)
    switch(action) {
      case 0x1A:
        //build serial number
        for (var i = 0; i < 16; i++) {
          if (i % 4 == 0 && i > 0) {
            serial_number += "-";
          }
          bareNum = msg[2+i].toString(16);
          serial_number += hexStringFrmt.substring((bareNum).length, 2) + bareNum;
        }
        serial_number = serial_number.toUpperCase();
        console.log("in action dispatch")
        store.dispatch(fetchDeviceDBData(serial_number));
        break;
    }
}
