const {ipcRenderer} = require('electron');

export const INIT_IPC = 'INIT_IPC';
export const DEVICE_ARRIVED = 'DEVICE_ARRIVED';
export const DEVICE_APP_ARRIVED = 'DEVICE_APP_ARRIVED';
export const DEVICE_SBL_ARRIVED = 'DEVICE_SBL_ARRIVED';
export const DEVICE_REMOVED = 'DEVICE_REMOVED';
export const READ_DEVICE_SETTINGS = 'READ_DEVICE_SETTINGS';
export const DEVICE_DATA_SETTINGS = 'DEVICE_DATA_SETTINGS';
export const SAVE_DEVICE_SETTINGS = 'SAVE_DEVICE_SETTINGS';
export const SUCCESS_SETTINGS_UPDATE = 'SUCCESS_SETTINGS_UPDATE';
export const REQUEST_SBL = 'REQUEST_SBL';
export const DEVICE_USER_RESET = 'DEVICE_USER_RESET';
export const REQUEST_DATA_SETUP = 'REQUEST_DATA_SETUP';
export const REQUEST_DATA_SETUP_RESPONSE = 'REQUEST_DATA_SETUP_RESPONSE';
export const REQUEST_TRANSFER_START = 'REQUEST_TRANSFER_START';
export const REQUEST_TRANSFER_START_RESPONSE = 'REQUEST_TRANSFER_START_RESPONSE';
export const REQUEST_PACKET_SEND = 'REQUEST_PACKET_SEND';
export const REQUEST_PACKET_SEND_RESPONSE = 'REQUEST_PACKET_SEND_RESPONSE';
export const REQUEST_VALIDATE_BLOCK_SEND = 'REQUEST_VALIDATE_BLOCK_SEND';
export const REQUEST_VALIDATE_BLOCK_SEND_RESPONSE = 'REQUEST_VALIDATE_BLOCK_SEND_RESPONSE';
export const REQUEST_SECTOR_WRITE_SEND = 'REQUEST_SECTOR_WRITE_SEND';
export const REQUEST_SECTOR_WRITE_SEND_RESPONSE = 'REQUEST_SECTOR_WRITE_SEND_RESPONSE';
export const COMPLETE_UPDATE_REQUEST = 'COMPLETE_UPDATE_REQUEST';
export const START_OBD_PROGRAMMING = 'START_OBD_PROGRAMMING';
export const COMPLETE_OBD_PROGRAMMING = 'COMPLETE_OBD_PROGRAMMING';
export const READ_OSD_SETTINGS = 'READ_OSD_SETTINGS';
export const DEVICE_OSD_SETTINGS = 'DEVICE_OSD_SETTINGS';
export const SAVE_DEVICE_OSD_SETTINGS = 'SAVE_DEVICE_OSD_SETTINGS';



import { fetchDeviceDBData } from './get_device_data';
import { getSerialNumber,
         checkOBDSupport,
         getSoftwareId,
         setDeviceSettings,
         setDeviceOSDSettings,
         setVehicleInfo,
         setUpTransferData,
         parseTransferDataResponse,
         setUpTransferStart,
         setUpPacketData,
         parsePacketDataResponse,
         setUpBlockValidateData,
         parseSectorWriteResponse,
         setUpSectorWriteData} from '../utils/device_utils';

import { SET_UP_TRANSFER,
         START_TRANSFER,
         PACKET_SEND,
         BLOCK_VALIDATE,
         SECTOR_WRITE } from '../utils/device_utils'

var notifyRemoved = true;

export function hidAction(hid_action){
  return dispatch => {
    dispatch(handleDeviceArrived());
    dispatch(handleDeviceSBLStatus());
    dispatch(handleDeviceDataResult());
    dispatch(handleDeviceRemoved());
    dispatch({
      type: INIT_IPC,
      payload: ''
    });
  };
}

export function handleDeviceArrived(){
    return dispatch => {
        ipcRenderer.on('device-arrived',(event, data) => {
            //console.log('Device Arrived Handling Action....', data);
            ipcRenderer.send('device-sbl-status', 0x01);
            notifyRemoved = true;
            dispatch({
              type: DEVICE_ARRIVED,
              payload: ''
            });
        });
    };
}

export function handleDeviceRemoved(){
    return dispatch => {
        ipcRenderer.on('device-removed',(event, data) => {
            //console.log("Notify: ", notifyRemoved);
            if(notifyRemoved == true){
              //console.log('Device Removed Handling Action....', data);
              dispatch({
                type: DEVICE_REMOVED,
                payload: ''
              });
            }else{
              //console.log('Device reset by user....', data);
              dispatch({
                type: DEVICE_USER_RESET,
                payload: ''
              });
            }
        });
    };
}


function handleDeviceSBLStatus(){
  //console.log('Handle device sbl init....');
  return dispatch => {
      ipcRenderer.on('device-sbl-status',(event, data) => {
          //console.log('SBL Status handling Action');
          //TODO need to change return to read mfg_id and store it somewhere. 
          let msg = data["msg"]
          if(msg[1] == 0){
            dispatch({
              type: DEVICE_SBL_ARRIVED,
              payload: ""
            });
          }else{
            dispatch({
              type: DEVICE_APP_ARRIVED,
              payload: ""
            });
            ipcRenderer.send('device-read-settings', 0x1A);
          }
          //console.log('SBL Status handling Data Action....', data);
          dispatch({
            type: READ_DEVICE_SETTINGS,
            payload: ""
          });
      });
  };
}

export function getOSDSettings(){
  //console.log('Reading OSD settings');
  ipcRenderer.send('device-read-settings', 0x65);
  return {
    type: READ_OSD_SETTINGS,
    payload: ""
  };
}

export function handleDeviceDataResult(){
  let result;
  return dispatch => {
    ipcRenderer.on('device-data-result',(event, data) => {
      ////console.log('Handle Device settings Action',data);
      let msg = data["msg"];
      ////console.log(msg);
      let usbResult;
      let action;
      if(msg != undefined){
        action = msg[0];
        usbResult = msg[1];
      }
      let serial_number = "";
      let obdsupport = {};
      let softwareIdResult = {};
      //console.log("action handleDeviceDataResult:", action)
      switch(action) {
        case 0x1A: //data settings response
          serial_number = getSerialNumber(msg);
          //obdsupport = checkOBDSupport(msg);
          softwareIdResult = getSoftwareId(msg);
          //console.log("*******************************");
          //console.log(softwareIdResult);
          //console.log("*******************************");
          dispatch(fetchDeviceDBData(serial_number,softwareIdResult));
          dispatch({
            type: DEVICE_DATA_SETTINGS,
            payload: msg
          });
          //TODO
          //check here if OBD & OSD support and dispatch events to read OSD settings and OBD config from database
          //for OBD need mfg_id and sw_id. mfg id has to be already retrieved by sbl status call
          break;
        case 0x1B:
          dispatch({
            type: SUCCESS_SETTINGS_UPDATE,
            payload: ""
          });
          ipcRenderer.send('device-read-settings', 0x1A);
          break;
        case 0x66:
          dispatch({
            type: SUCCESS_SETTINGS_UPDATE,
            payload: ""
          });
          getOSDSettings();
          break;
        case 0x65: //read osd settings response
          //console.log("+++++++++ OSD RESULT +++++++++++++");
          //console.log(msg);
          dispatch({
            type: DEVICE_OSD_SETTINGS,
            payload: msg
          })
          break;
        case 0x20: //setup response
          //console.log("set up response")
          result = parseTransferDataResponse(msg);
          dispatch({
            type: REQUEST_DATA_SETUP_RESPONSE,
            payload: result
          });
          break;
        case 0x30: //start transfer response
          ////console.log("start transfer response")
          dispatch({
            type: REQUEST_TRANSFER_START_RESPONSE,
            payload: msg
          });
          break;
        case 0x40: //send packet response
          ////console.log("send packet response");
          result = parsePacketDataResponse(msg);
          ////console.log(result);
          dispatch({
            type: REQUEST_PACKET_SEND_RESPONSE,
            payload: result
          });
          break;
        case 0x50: //validate block response
          ////console.log("send packet response");
          result = msg[1]; //remaining blocks in sector
          ////console.log(result);
          dispatch({
            type: REQUEST_VALIDATE_BLOCK_SEND_RESPONSE,
            payload: result
          });
          break;
        case 0x70: //sector write response
          ////console.log("sector write response");
          result = parseSectorWriteResponse(msg); //rwrite secotr result
          ////console.log(result);
          dispatch({
            type: REQUEST_SECTOR_WRITE_SEND_RESPONSE,
            payload: result
          });
          break;
      }
    });
  };
}

export function saveDeviceSettings(data, settings){
    let result = setDeviceSettings(data,settings);
    ipcRenderer.send('device-write_data', result);
    return {
      type: SAVE_DEVICE_SETTINGS,
      payload: ""
    };
}

export function saveDeviceOSDSettings(settings){
    let result = setDeviceOSDSettings(settings);
    ipcRenderer.send('device-write_data', result);
    return {
      type: SAVE_DEVICE_OSD_SETTINGS,
      payload: ""
    };
}

export function startOBDProgramming(){
    return {
      type: START_OBD_PROGRAMMING,
      payload: ""
    };
}

export function updateDeviceVichecleInfo(settings, info){
    let result = setVehicleInfo(settings, info);
    ipcRenderer.send('device-write_data', result);
    return {
      type: COMPLETE_UPDATE_REQUEST,
      payload: ""
    };
}

export function sendSoftwareUpdateData(action, update_status){
    var data = [];
    switch(action){
      case SET_UP_TRANSFER:
        ////console.log("inside software update action", SET_UP_TRANSFER);
        data = setUpTransferData(update_status);
        ////console.log(data);
        ipcRenderer.send('device-write_data', data);
        return {
          type: REQUEST_DATA_SETUP,
          payload: ""
        };
      case START_TRANSFER:
        ////console.log("inside software update action", START_TRANSFER);
        data = setUpTransferStart()
        ipcRenderer.send('device-write_data', data);
        return {
          type: REQUEST_TRANSFER_START,
          payload: ""
        };
      case PACKET_SEND:
        ////console.log("inside software update action", PACKET_SEND);
        data = setUpPacketData(update_status);
        ////console.log("sendSoftwareUpdateData", data);
        ipcRenderer.send('device-write_data', data);
        return {
          type: REQUEST_PACKET_SEND,
          payload: ""
        };
      case BLOCK_VALIDATE:
        ////console.log("inside software update action", BLOCK_VALIDATE);
        data = setUpBlockValidateData(update_status);
        ipcRenderer.send('device-write_data', data);
        return {
          type: REQUEST_VALIDATE_BLOCK_SEND,
          payload: ""
        };
      case SECTOR_WRITE:
        ////console.log("inside software update action", SECTOR_WRITE);
        data = setUpSectorWriteData(update_status);
        ipcRenderer.send('device-write_data', data);
        return {
          type: REQUEST_SECTOR_WRITE_SEND,
          payload: ""
        };
    }
}

export function requestSBL(){
  let arg = [0x00, 0x80, 0x00, 0x00, 0x00];
  notifyRemoved = false;
  ipcRenderer.send('device-sbl', arg);
  return {
    type: REQUEST_SBL,
    payload: ""
  };
}

export function clearSBL(){
  let arg = [];
  arg[0] = 0x00;
  arg[1] = 0x08;
  arg[2] = 0x00;
  arg[3] = 0x00;
  arg[4] = 0x00;
  ipcRenderer.send('device-sbl', arg);

  arg[0] = 0x00;
  arg[1] = 0x09;
  arg[2] = 0x00;
  arg[3] = 0x00;
  arg[4] = 0x00;
  ipcRenderer.send('device-sbl', arg);
}
