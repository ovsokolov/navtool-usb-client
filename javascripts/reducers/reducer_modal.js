import { HIDE_MODAL } from '../actions/hide_modal';
import { FTP_LOAD_SUCCESS } from '../actions/ftp_action';
import { DEVICE_REMOVED, START_OBD_PROGRAMMING, SUCCESS_SETTINGS_UPDATE } from '../actions/hid_action';


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
    case DEVICE_REMOVED:
    	return {hide: false, show_message: false};
  }
  return state;
}