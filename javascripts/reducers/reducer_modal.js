import { HIDE_MODAL } from '../actions/hide_modal';
import { FTP_LOAD_SUCCESS } from '../actions/ftp_action';
import { DEVICE_REMOVED, START_OBD_PROGRAMMING, SUCCESS_SETTINGS_UPDATE, DEVICE_OBD_SUCCESS, DEVICE_OBD_FAILED } from '../actions/hid_action';
import { OBD_COMPLETED } from '../utils/device_utils';
import { DEVICE_NOT_SUPPORTED } from '../utils/device_utils';
import { UPDATE_ERROR, DISPLAY_UPDATE_ERROR, DISPLAY_UPDATE_SETUP_ERROR } from '../utils/device_utils';
import { DOWNLOAD_TEAM_VIEWER } from '../utils/device_utils';

export default function(state = {hide: false, show_message: false}, action){
  switch (action.type){
    case HIDE_MODAL:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
    	return {hide: action.payload, show_message: false};
    case START_OBD_PROGRAMMING:
    	return {hide: false, show_message: false}; //obd starts
    case FTP_LOAD_SUCCESS:
    	return {hide: false, show_message: false}; //software install starts
    case SUCCESS_SETTINGS_UPDATE:
      return {show_message: true}; //settings updated
    case DEVICE_OBD_SUCCESS:
      return {hide: true, show_message: false}; //obd success
    case DEVICE_OBD_FAILED:
      return {hide: true, show_message: false}; //obd failed
    case OBD_COMPLETED:
      return {show_message: true}; //obd completed
    case DEVICE_REMOVED:
    	return {hide: false, show_message: false};
    case DEVICE_NOT_SUPPORTED:
      return {show_message: true}; //show not supporteed message
    case UPDATE_ERROR:
      return {hide: true, show_message: false};
    case DISPLAY_UPDATE_ERROR:
      return {show_message: true};
    case DISPLAY_UPDATE_SETUP_ERROR:
       console.log("Setup error DISPLAY_UPDATE_SETUP_ERROR");
       return {hide: false, show_message: true}; 
    case DOWNLOAD_TEAM_VIEWER:
      return {show_message: true};
  }
  return state;
}