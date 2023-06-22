import { HIDE_MODAL } from '../actions/hide_modal';
import { FTP_LOAD_SUCCESS } from '../actions/ftp_action';
import { DEVICE_REMOVED, START_OBD_PROGRAMMING, SUCCESS_SETTINGS_UPDATE, DEVICE_OBD_SUCCESS, DEVICE_OBD_FAILED } from '../actions/hid_action';
import { OBD_COMPLETED } from '../utils/device_utils';
import { DEVICE_NOT_SUPPORTED } from '../utils/device_utils';
import { UPDATE_ERROR, DISPLAY_UPDATE_ERROR, DISPLAY_UPDATE_SETUP_ERROR } from '../utils/device_utils';
import { DOWNLOAD_TEAM_VIEWER, ASSEMBLY_MESSAGE, ASSEMBLY_SUCCESS } from '../utils/device_utils';

export default function(state = {hide: false, show_message: false, message_type: '' }, action){
  switch (action.type){
    case HIDE_MODAL:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
    	return {hide: action.payload, show_message: false, message_type: ''};
    case START_OBD_PROGRAMMING:
    	return {hide: false, show_message: false, message_type: ''}; //obd starts
    case FTP_LOAD_SUCCESS:
    	return {hide: false, show_message: false, message_type: ''}; //software install starts
    case SUCCESS_SETTINGS_UPDATE:
      return {show_message: true, message_type: 'info'}; //settings updated
    case DEVICE_OBD_SUCCESS:
      return {hide: true, show_message: false, message_type: ''}; //obd success
    case DEVICE_OBD_FAILED:
      return {hide: true, show_message: false, message_type: ''}; //obd failed
    case OBD_COMPLETED:
      return {show_message: true, message_type: 'info'}; //obd completed
    case DEVICE_REMOVED:
    	return {hide: false, show_message: false, message_type: ''};
    case DEVICE_NOT_SUPPORTED:
      return {show_message: true, message_type: 'error'}; //show not supporteed message
    case UPDATE_ERROR:
      return {hide: true, show_message: false, message_type: ''};
    case DISPLAY_UPDATE_ERROR:
      return {show_message: true, message_type: 'error'};
    case DISPLAY_UPDATE_SETUP_ERROR:
       console.log("Setup error DISPLAY_UPDATE_SETUP_ERROR");
       return {hide: false, show_message: true, message_type: 'error'}; 
    case DOWNLOAD_TEAM_VIEWER:
      return {show_message: true, message_type: 'info'};
    case ASSEMBLY_MESSAGE:
      return {show_message: true, message_type: 'error'};   
    case ASSEMBLY_SUCCESS:
      return {show_message: true, message_type: 'info'};  
       
  }
  return state;
}