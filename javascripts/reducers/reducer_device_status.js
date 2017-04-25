import { DEVICE_SBL_ARRIVED, DEVICE_APP_ARRIVED, DEVICE_REMOVED } from '../actions/hid_action';
import { REQUEST_DATA_SETUP, COMPLETE_UPDATE_REQUEST } from '../actions/hid_action';
import { START_OBD_PROGRAMMING, COMPLETE_OBD_PROGRAMMING } from '../actions/hid_action';
import { NO_DEVICE_STATUS, DEVICE_APP_STATUS, DEVICE_SBL_STATUS} from '../utils/device_utils';
import { WAITING_FOR_SBL, 
         WAITING_FOR_APP_UPDATE, 
         UPDATE_NOT_STARTED, 
         UPDATE_READY, 
         UPDATE_IN_PROGRESS,
         OBD_NOT_STARTED,
         OBD_IN_PROGRESS } from '../utils/device_utils';
import { REQUEST_SBL_FOR_UPDATE } from '../actions/ftp_action';
import { REQUEST_REBOOT_AFTER_UPDATE } from  '../actions/get_device_data';

export default function(state = {app_status: NO_DEVICE_STATUS, update_status: UPDATE_NOT_STARTED, obd_status: OBD_NOT_STARTED }, action){
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
    case DEVICE_REMOVED:
      return {app_status: NO_DEVICE_STATUS, update_status: UPDATE_NOT_STARTED, obd_status: OBD_NOT_STARTED };
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
    default:
      return state;
  }
  return state;
}
