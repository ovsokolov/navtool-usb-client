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
export const DEVICE_MFG_ID_RECIEVED = 'DEVICE_MFG_ID_RECIEVED';
export const REQUEST_REBOOT_AFTER_UPDATE = 'REQUEST_REBOOT_AFTER_UPDATE';
export const DEVICE_OBD_RESULT = 'DEVICE_OBD_RESULT';
export const DEVICE_OBD_RUNING = 'DEVICE_OBD_RUNING';
export const DEVICE_OBD_SUCCESS = 'DEVICE_OBD_SUCCESS';
export const DEVICE_OBD_FAILED = 'DEVICE_OBD_FAILED';
export const SET_CAN_FILTER = 'SET_CAN_FILTER';
export const SET_CAN_FILTER_SUCCESS = 'SET_CAN_FILTER_SUCCESS';
export const CAN_FILTER_NOT_SET = 'CAN_FILTER_NOT_SET';
export const CLEAR_CAN_FILTER = 'CLEAR_CAN_FILTER';
export const GET_CAN_FILTER_DATA = 'GET_CAN_FILTER_DATA';
export const GET_CAN_FILTER_DATA_RESULT = 'GET_CAN_FILTER_DATA_RESULT';
export const CLEAR_CAN_FILTER_RESULT = 'CLEAR_CAN_FILTER_RESULT';


export const IMAGE_FLASH_SUCCESS = 'IMAGE_FLASH_SUCCESS';
export const IMAGE_FLASH_ERROR = 'IMAGE_FLASH_ERROR';

export const WRITE_SUCESS = 44;
export const WRITE_FAILED = 55;
export const READ_SUCESS = 22;
export const READ_FAILED = 33;

export const OBD_NO_ERROR = 0;
export const OBD_RUNNING = 1;
export const OBD_SUCCESS = 2;
export const OBD_FAILED = 3;

import axios from 'axios';
import { FETCH_DEVICE_DB_DATA, FETCH_DEVICE_MCU } from './get_device_data';
import { fetchDeviceDBData, checkDeviceSupport } from './get_device_data';
import { fetchMake } from './get_make';
import { getSerialNumber,
         checkOBDSupport,
         getSoftwareId,
         setDeviceSettings,
         initDeviceSetting,
         setDeviceOSDSettings,
         initDeviceOSDSettings,
         setDeviceOBDSettings,
         setVehicleInfo,
         initVehicleInfo,
         initDeviceSettingsData,
         setUpTransferData,
         parseTransferDataResponse,
         setUpTransferStart,
         setUpPacketData,
         parsePacketDataResponse,
         setUpBlockValidateData,
         parseSectorWriteResponse,
         setUpSectorWriteData,
         parseOBDStatus,
         setCanFilterMessage,} from '../utils/device_utils';

import { SET_UP_TRANSFER,
         START_TRANSFER,
         PACKET_SEND,
         BLOCK_VALIDATE,
         SECTOR_WRITE,
         UPDATE_ERROR ,
         DISPLAY_UPDATE_ERROR,
         DISPLAY_UPDATE_SETUP_ERROR} from '../utils/device_utils'

import { HIDE_MODAL } from '../actions/hide_modal';
import { WEB_SERVICES_URL } from '../utils/constants';

var notifyRemoved = true;
var g_MFG_ID =""

export function hidAction(hid_action){
  return dispatch => {
    dispatch(handleDeviceArrived());
    dispatch(handleDeviceSBLStatus());
    dispatch(handleDeviceDataResult());
    dispatch(handleDeviceRemoved());
    dispatch(handleDeviceMfgId());
    dispatch(handleOBDUpdateStatus());
    dispatch(handleInitSettings());
    dispatch(handleImageFlush());
    dispatch({
      type: INIT_IPC,
      payload: ''
    });
  };
}



export function handleOBDUpdateStatus(){
    return dispatch => {
        ipcRenderer.on('device-obd-status',(event, data) => {
            //console.log('Device OBD Status Result...', data);
            let result = parseOBDStatus(data["msg"]);
            let obdStatus = "";
            //console.log(result);
            if(result.obdReadStatus == READ_SUCESS){
              if(result.obdStatus == OBD_RUNNING){
                const getStatus = () => ipcRenderer.send('device-obd-status', 0x62);
                obdStatus = DEVICE_OBD_RUNING;
                setTimeout(getStatus, 1000);
                //obdStatus = DEVICE_OBD_SUCCESS;
              }
              if(result.obdStatus == OBD_SUCCESS){
                obdStatus = DEVICE_OBD_SUCCESS;
                //console.log('OBD Success');
              }
              if(result.obdStatus == OBD_FAILED){
                obdStatus = DEVICE_OBD_FAILED;
                //console.log('OBD FAILED');
              }
              if(result.obdStatus == OBD_NO_ERROR){
                obdStatus = DEVICE_OBD_SUCCESS;
                //console.log('OBD FAILED');
              }
              
            }
            dispatch({
              type: obdStatus,
              payload: ''
            });
        });
    }; 
}


export function handleDeviceArrived(){
    return dispatch => {
        ipcRenderer.on('device-arrived',(event, data) => {
            console.log('Device Arrived Handling Action....', data);
            ipcRenderer.send('device-read-settings', 0x90);

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

export function handleImageFlush(){
    return dispatch => {
        ipcRenderer.on('image-flash',(event, data) => {
            let msg = data["msg"];
            let mcu = data["mcu"];
            console.log(data);
            if(msg == 'SUCCESS'){
              let update_param_url = "?mcu_id=" + mcu ; 
              const UPDATE_ROOT_URL = WEB_SERVICES_URL + "/v1/setimageflag";
              const update_url = UPDATE_ROOT_URL + update_param_url;
              const update_request = axios.get(update_url);
              update_request.then( ({data}) =>{
                  console.log(data);
                  dispatch( { type: FETCH_DEVICE_DB_DATA, payload: data } )
                  dispatch( { type: COMPLETE_UPDATE_REQUEST, payload: '' } )
              });            
            }else{
              //console.log('Device reset by user....', data);
              dispatch({ type: IMAGE_FLASH_ERROR, payload: '' });
            }
        });
    };
}

export function completeUpdateImage(){
    return {
      type: COMPLETE_UPDATE_REQUEST,
      payload: ""
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
            ipcRenderer.send('device-read-settings', 0x90);
          }
          //console.log('SBL Status handling Data Action....', data);
          dispatch({
            type: READ_DEVICE_SETTINGS,
            payload: ""
          });
      });
  };
}


function handleDeviceMfgId(){
  //console.log('Handle device sbl init....');
  return dispatch => {
      ipcRenderer.on('device-mfg-id',(event, data) => {
          //console.log('SBL Status handling Action');
          //TODO need to change return to read mfg_id and store it somewhere. 
          let mfg_id = data["mfgid"];
          console.log("MFG ID: ", mfg_id);
          g_MFG_ID = mfg_id;
          dispatch({
            type: DEVICE_MFG_ID_RECIEVED,
            payload: {mfg_id}
          });
          dispatch(checkDeviceSupport(mfg_id));
          dispatch(fetchMake(mfg_id));
      });
  };
}

export function getOSDSettings(){
  console.log('Reading OSD settings');
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
      console.log('Handle Device Data Action',data);
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
        case 0x90: //data settings response
          console.log("DATA SETTINGS XXXXXX");
          serial_number = getSerialNumber(msg);
          //obdsupport = checkOBDSupport(msg);
          softwareIdResult = getSoftwareId(msg);
          //console.log("*******************************");
          console.log(msg);
          console.log(serial_number);
          console.log(softwareIdResult);
          let device = data["device"];
          let mcu_type = data["mcu_type"];
          //MFG_ID USE LATER WITH LPC MIX
          let mfg_id = device.concat(mcu_type.suffix!==undefined?mcu_type.suffix:'');
          if(device != ''){
            let sofware = data["software"];
            console.log("******************************* regiter device   ******************");
            console.log(mfg_id,sofware.sw_id,sofware.sw_build,serial_number);
            console.log("******************************* regiter device   ******************");
            dispatch(registerDevice(mfg_id,sofware.sw_id,sofware.sw_build,serial_number));
          }else{
            dispatch(fetchDeviceDBData(serial_number,softwareIdResult));
          }
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
          console.log('SUCCESS_SETTINGS_UPDATE 0x1B');
          ipcRenderer.send('device-read-settings', 0x90);
          break;
        case 0x66:
          dispatch({
            type: SUCCESS_SETTINGS_UPDATE,
            payload: ""
          });
          getOSDSettings();
          break;
        case 0x65: //read osd settings response
          console.log("+++++++++ OSD RESULT +++++++++++++");
          console.log(msg);
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
        case 0x61: //validate block response
          //console.log("OBD Status Handler");
          result = msg[1]; //result
          //console.log(result);
          if(result == WRITE_SUCESS){
            //console.log('OBD Write Success');
            ipcRenderer.send('device-obd-status', 0x62);
          }else if(result == WRITE_FAILED){
            //console.log('OBD Write Failed');
          }
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
        /*
        case 0x90: //set can filter response
          console.log("set can filter response");
          result = msg[1]; //result
          console.log(msg);
          console.log(result);
          dispatch({
            type: SET_CAN_FILTER_SUCCESS,
            payload: SET_CAN_FILTER_SUCCESS
          });
          break;
        case 0x91: //get can filter response data
          console.log("get can filter response data");
          result = msg.slice(2,10); //result
          console.log(msg);
          console.log(result);
          dispatch({
            type: GET_CAN_FILTER_DATA_RESULT,
            payload: result
          });
          break;
        */
      }
    });
  };
}

export function saveDeviceSettings(data, settings){
    //console.log('@@@@@@saveDeviceSettings@@@@@@');
    let result = setDeviceSettings(data,settings);
    //console.log(result);
    //console.log('@@@@@@saveDeviceSettings@@@@@@');
    ipcRenderer.send('device-write_data', result);
    return {
      type: SAVE_DEVICE_SETTINGS,
      payload: ""
    };
}

export function updateImageFlag(mcu_serial){
  let update_param_url = "?mcu_id=" + mcu_serial ; 
  const UPDATE_ROOT_URL = WEB_SERVICES_URL + "/v1/setimageflag";
  const update_url = UPDATE_ROOT_URL + update_param_url;
  const update_request = axios.get(update_url);
  return (dispatch) => {
    update_request.then( ({data}) =>{
      //console.log(data);
      //console.log(data["mfg_id"])
      dispatch( { type: FETCH_DEVICE_DB_DATA, payload: data } )
    });
  };
}

export function initDeviceSettings(mfg_id,sw_id,sw_build,mcu_serial, device_data, settings, osd_setting){
  let param_url = "/sw?mfg_id=" + mfg_id + "&sw_id=" + sw_id + "&sw_build=" + sw_build; 
  const ROOT_URL = WEB_SERVICES_URL + "/v1/navtoolsws";
  const url = ROOT_URL + param_url;
  const request = axios.get(url);
  console.log("OSD initDeviceSettings");
  console.log(osd_setting);
  console.log('initDeviceSettings URL', url);

  return dispatch => {
    request.then( ({data}) =>{
        //console.log("fetchSoftwareConfig data");
        //console.log(data);
        //console.log("fetchSoftwareConfig data");
        let sw_data = data[0];
        console.log(sw_data);
        let update_param_url = "?mcu_id=" + mcu_serial + "&mfg_id=" + mfg_id + "&sw_id=" + sw_id + "&sw_build=" + sw_build + "&vehicle_make=" + sw_data.vehicle_make + "&vehicle_model=" + sw_data.vehicle_model; 
        const UPDATE_ROOT_URL = WEB_SERVICES_URL + "/v1/registerdevice";
        const update_url = UPDATE_ROOT_URL + update_param_url;
        const update_request = axios.get(update_url);
        update_request.then( ({data}) =>{
          let init_settings = initDeviceSettingsData(settings);
          console.log("initDeviceSettings");
          console.log(init_settings);
          console.log(device_data);
          let init_data = setDeviceSettings(device_data,init_settings)
          console.log(init_data);
          let settings_result = initVehicleInfo(init_data, {vehicle_make: sw_data.vehicle_make, vehicle_model: sw_data.vehicle_model});
          console.log(settings_result);
          ipcRenderer.send('device-write_data', settings_result);
          let init_osd_settings = initDeviceOSDSettings(osd_setting);
          let init_osd_data = setDeviceOSDSettings(init_osd_settings);
          ipcRenderer.send('device-write_data', init_osd_data);
          return {
            type: SAVE_DEVICE_SETTINGS,
            payload: ""
          };
        });
    });
  }
}

export function registerDevice(mfg_id,sw_id,sw_build,mcu_serial){
  let param_url = "/sw?mfg_id=" + mfg_id + "&sw_id=" + sw_id + "&sw_build=" + sw_build; 
  const ROOT_URL = WEB_SERVICES_URL + "/v1/navtoolsws";
  const url = ROOT_URL + param_url;
  console.log(url);
  const request = axios.get(url);

  return dispatch => {
    request.then( ({data}) =>{
        console.log("registerDevice data");
        console.log(data);
        console.log("fetchSoftwareConfig data");
        let sw_data = data[0];
        console.log(sw_data);
        let update_param_url = "?mcu_id=" + mcu_serial + "&mfg_id=" + mfg_id + "&sw_id=" + sw_id + "&sw_build=" + sw_build + "&vehicle_make=" + sw_data.vehicle_make + "&vehicle_model=" + sw_data.vehicle_model; 
        const UPDATE_ROOT_URL = WEB_SERVICES_URL + "/v1/registerdevice";
        const update_url = UPDATE_ROOT_URL + update_param_url;
        const update_request = axios.get(update_url);
        update_request.then( ({data}) =>{
          let arg = [];
          arg[0] = 0x00;
          arg[1] = 0x1B;  
          arg[2] = 0x00;
          arg[3] = 0x00;
          arg[4] = 0x00;
          ipcRenderer.send('device-write_data', arg);
          return {
            type: SAVE_DEVICE_SETTINGS,
            payload: ""
          };
        });
    });
  }
}

export function handleInitSettings(){
  return dispatch => {
      ipcRenderer.on('device-init-settings',(event, data) => {
          console.log('Device Arrived handleInitSettings', data);
          let result = setDeviceOSDSettings(settings);
          ipcRenderer.send('device-write_data', result);
          return {
            type: SAVE_DEVICE_OSD_SETTINGS,
            payload: ""
          };
      });
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

export function startOBDProgramming(settings){
    let result = setDeviceOBDSettings(settings);
    //console.log(result);
    ipcRenderer.send('device-write_data', result);
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
        if(update_status.start_sector == -1){
          console.log("ERROR SeCTOR");
          return dispatch => {
            dispatch({
              type: DISPLAY_UPDATE_SETUP_ERROR,
              payload: "Error During Software Update Setup"
            });
          };
        } else {
          data = setUpTransferData(update_status);
          ////console.log(data);
          ipcRenderer.send('device-write_data', data);
          return {
            type: REQUEST_DATA_SETUP,
            payload: ""
          };
        }
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
  console.log("HID request SBL");
  let arg = [0x00, 0x80, 0x00, 0x00, 0x00];
  notifyRemoved = false;
  ipcRenderer.send('device-sbl', arg);
  return {
    type: REQUEST_SBL,
    payload: ""
  };
}

export function rebootAfterUpdate(){
    clearSBL();
    return { 
      type: REQUEST_REBOOT_AFTER_UPDATE, 
      payload: ""
    };
}


export function clearSBL(){
  console.log("HID clear SBL");
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

export function softwareUpdateError(status){
    if(status == UPDATE_ERROR){
      return {
        type: UPDATE_ERROR,
        payload: ""
      };
    }else{
      //console.log("dispatching DISPLAY_UPDATE_ERROR");
      return {
        type: DISPLAY_UPDATE_ERROR,
        payload: "Error During Software Update"
      };      
    }
}

export function setCanFilter(canMsg){
    let result = setCanFilterMessage(canMsg);
    ipcRenderer.send('device-write_data', result);
    return {
      type: SET_CAN_FILTER,
      payload: result.slice(2)
    };
}

export function clearCanFilter(){
    return {
      type: CLEAR_CAN_FILTER,
      payload: ''
    };
}

export function clearCanFilterResult(){
    return {
      type: CLEAR_CAN_FILTER_RESULT,
      payload: ''
    };  
}

export function getCanFilterData(){
  console.log("getCanFilterData");
  let arg = [];
  arg[0] = 0x00;
  arg[1] = 0x91;  
  arg[2] = 0x00;
  arg[3] = 0x00;
  arg[4] = 0x00;
  ipcRenderer.send('device-write_data', arg);
  return {
    type: GET_CAN_FILTER_DATA,
    payload: ''
  };
}

export function setTestEvent(eventType, inputType){
  console.log("setTestEvent");
  let arg = [];
  arg[0] = 0x00;
  arg[1] = 0x42;  
  arg[2] = parseInt(eventType, 10);
  arg[3] =  parseInt(inputType, 10);
  console.log(arg)
  ipcRenderer.send('device-write-test-event', arg);
  return {
    type: "SET_TEST_DATA",
    payload: ''
  };
}

