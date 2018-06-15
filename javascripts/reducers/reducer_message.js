import { SUCCESS_SETTINGS_UPDATE } from '../actions/hid_action';
import { DEVICE_OBD_SUCCESS,DEVICE_OBD_FAILED } from '../actions/hid_action';
import { FTP_LOAD_PROGRESS,FTP_LOAD_FAILURE } from '../actions/ftp_action';
import { HIDE_MODAL } from '../actions/hide_modal';
import { OBD_COMPLETED } from '../utils/device_utils';
import { DEVICE_NOT_SUPPORTED } from '../utils/device_utils';
import { DISPLAY_UPDATE_ERROR} from '../utils/device_utils';
import { DOWNLOAD_TEAM_VIEWER } from '../utils/device_utils';

export default function(state = "", action){
      //console.log("In message reducer");
    //console.log(action.type);
  switch (action.type){
    case SUCCESS_SETTINGS_UPDATE:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      return "Device Settings Updated";
    case FTP_LOAD_PROGRESS:
      return "Downloading File...";
    case FTP_LOAD_FAILURE:
      return "Error during file download";
    case DEVICE_OBD_SUCCESS:
      return "Activation Completed";
    case DEVICE_OBD_FAILED:
      return "Activation Failed";
    case DEVICE_NOT_SUPPORTED:
      return "Device Not Supported with this software version. Please use Windows Updater"
    case OBD_COMPLETED:
      return action.payload;
    case DISPLAY_UPDATE_ERROR:
      return action.payload;
    case DOWNLOAD_TEAM_VIEWER:
      return "Please Wait. Downloading TeamViewer. This window will be closed automatically"
    case HIDE_MODAL:
      //console.log("XXXXXXremoveMessageXXXXX");
      return "";
    default:
      return state;
  }
  return state;
}
