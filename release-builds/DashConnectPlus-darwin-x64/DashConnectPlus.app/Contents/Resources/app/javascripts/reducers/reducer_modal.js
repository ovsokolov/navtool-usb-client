import { HIDE_MODAL } from '../actions/hide_modal';
import { FTP_LOAD_SUCCESS } from '../actions/ftp_action';
import { DEVICE_REMOVED, START_OBD_PROGRAMMING } from '../actions/hid_action';


export default function(state = {hide: false}, action){
  switch (action.type){
    case HIDE_MODAL:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
    	return {hide: action.payload};
    case START_OBD_PROGRAMMING:
    	return {hide: false}; //obd starts
    case FTP_LOAD_SUCCESS:
    	return {hide: false}; //software install starts
    case DEVICE_REMOVED:
    	return {hide: false};
  }
  return state;
}