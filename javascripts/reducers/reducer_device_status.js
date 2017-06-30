import { DEVICE_SBL_ARRIVED, DEVICE_APP_ARRIVED, DEVICE_MFG_ID_RECIEVED, DEVICE_DATA_SETTINGS, DEVICE_REMOVED } from '../actions/hid_action';
import { REQUEST_DATA_SETUP, COMPLETE_UPDATE_REQUEST } from '../actions/hid_action';
import { START_OBD_PROGRAMMING, COMPLETE_OBD_PROGRAMMING, REQUEST_REBOOT_AFTER_UPDATE } from '../actions/hid_action';
import { DEVICE_OBD_SUCCESS,DEVICE_OBD_FAILED } from '../actions/hid_action';
import { NO_DEVICE_STATUS, DEVICE_APP_STATUS, DEVICE_SBL_STATUS} from '../utils/device_utils';
import { WAITING_FOR_SBL, 
         WAITING_FOR_APP_UPDATE, 
         UPDATE_NOT_STARTED, 
         UPDATE_READY, 
         UPDATE_IN_PROGRESS,
         OBD_NOT_STARTED,
         OBD_IN_PROGRESS,
         OBD_COMPLETED } from '../utils/device_utils';
import { REQUEST_SBL_FOR_UPDATE, START_SOFTWARE_UPDATE } from '../actions/ftp_action';
import {FETCH_SETTINGS_TYPE} from  '../actions/get_software'
import {getSoftwareId} from '../utils/device_utils';

export default function(state = {app_status: NO_DEVICE_STATUS, update_status: UPDATE_NOT_STARTED, obd_status: OBD_NOT_STARTED, device_mfg_id: '', device_sw_id: '', device_sw_build: '', device_settings_type: '' }, action){
  let result = {};
  switch (action.type){
    case DEVICE_APP_ARRIVED:
      result = Object.assign({}, state, {app_status: DEVICE_APP_STATUS});
      return result;
    case DEVICE_SBL_ARRIVED:
      result = Object.assign({}, state, {app_status: DEVICE_SBL_STATUS});
      if(result.update_status == WAITING_FOR_SBL){
        result.update_status = UPDATE_READY;
      }
      //test for now to force update
      //result.update_status = UPDATE_READY;
      //*******
      return result;
    case DEVICE_MFG_ID_RECIEVED:
      result = Object.assign({}, state, {device_mfg_id: action.payload.mfg_id.trim()});
      return result;
    case DEVICE_DATA_SETTINGS:
      var software = getSoftwareId(action.payload);
      result = Object.assign({}, state, {device_sw_id: software.softwareId, device_sw_build:  software.softwareBuild});
      //console.log(DEVICE_DATA_SETTINGS, ": ", software.softwareId, ".", software.softwareBuild);
      return result;
    case FETCH_SETTINGS_TYPE:
      result = Object.assign({}, state, {device_settings_type: action.payload});
      console.log(FETCH_SETTINGS_TYPE, ": ", action.payload);
      return result;    
    case START_SOFTWARE_UPDATE:
      result = Object.assign({}, state, {update_status: UPDATE_READY});
      return result;
    case DEVICE_REMOVED:
      return {app_status: NO_DEVICE_STATUS, update_status: UPDATE_NOT_STARTED, obd_status: OBD_NOT_STARTED, device_mfg_id: '', device_sw_id: '', device_sw_build: '', device_settings_type: '' };
    case REQUEST_SBL_FOR_UPDATE:
      result = Object.assign({}, state, {update_status: WAITING_FOR_SBL });
      return result;
    case REQUEST_REBOOT_AFTER_UPDATE:
      result = Object.assign({}, state, {update_status: WAITING_FOR_APP_UPDATE });
      return result;
    case REQUEST_DATA_SETUP:
      result = Object.assign({}, state, {update_status: UPDATE_IN_PROGRESS });
      return result;
    case COMPLETE_UPDATE_REQUEST:
      result = Object.assign({}, state, {update_status: UPDATE_NOT_STARTED });
      return result;
    case START_OBD_PROGRAMMING:
      //console.log("******* START_OBD_PROGRAMMING ******");
      result = Object.assign({}, state, {obd_status: OBD_IN_PROGRESS });
      //console.log(result);
      return result;
    case DEVICE_OBD_SUCCESS:
      result = Object.assign({}, state, {obd_status: DEVICE_OBD_SUCCESS });
      //console.log(result);
      return result;
    case DEVICE_OBD_FAILED:
      result = Object.assign({}, state, {obd_status: DEVICE_OBD_FAILED });
      //console.log(result);
      return result;
    case OBD_COMPLETED:
      result = Object.assign({}, state, {obd_status: OBD_NOT_STARTED });
      //console.log(result);
      return result;
    default:
      return state;
  }
  return state;
}
