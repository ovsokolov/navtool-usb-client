import { SUCCESS_SETTINGS_UPDATE } from '../actions/hid_action';
import { FTP_LOAD_PROGRESS,FTP_LOAD_FAILURE } from '../actions/ftp_action';
export default function(state = "", action){
      console.log("In message reducer");
    console.log(action.type);
  switch (action.type){
    case SUCCESS_SETTINGS_UPDATE:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      return "Device Settings Updated";
    case FTP_LOAD_PROGRESS:
      return "Downloading File...";
    case FTP_LOAD_FAILURE:
      return "Error during file download";
    default:
      return "";
  }
  return state;
}