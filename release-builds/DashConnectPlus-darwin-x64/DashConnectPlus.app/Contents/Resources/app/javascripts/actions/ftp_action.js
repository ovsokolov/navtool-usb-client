import axios from 'axios';
import { NO_DEVICE_STATUS, DEVICE_APP_STATUS, DEVICE_SBL_STATUS } from '../utils/device_utils';
import { WEB_SERVICES_URL } from '../utils/constants';

import {requestSBL} from './hid_action'

//const ROOT_URL = "https://tranquil-mesa-29755.herokuapp.com/ftpload";
const ROOT_URL = WEB_SERVICES_URL + "/v1/ftpload";
//const ROOT_URL = "http://dashconnectplus.com/wp-content/themes/DashConnectPlus/dc_ftp_file_get.php"
export const FTP_LOAD_PROGRESS = 'FTP_LOAD_PROGRESS';
export const FTP_LOAD_SUCCESS = 'FTP_LOAD_SUCCESS';
export const FTP_LOAD_FAILURE = 'FTP_LOAD_FAILURE';
export const REQUEST_SBL_FOR_UPDATE = 'REQUEST_SBL_FOR_UPDATE';
export const START_SOFTWARE_UPDATE = 'START_SOFTWARE_UPDATE';

export function loadFTPFile(sw_id, device_status){
  const url = ROOT_URL + "?sw_id=" + sw_id;
  const request = axios.get(url);

  console.log('URL', url);
  console.log('sw_id', sw_id);
  console.log('status', device_status);

  return (dispatch) => {
    dispatch( { type: FTP_LOAD_PROGRESS, payload: "" } );
    request.then( ({data}) =>{
      let words  = CryptoJS.enc.Base64.parse(data.file);
      let fileMD5 = CryptoJS.MD5(words).toString();
      if(fileMD5 == data.md5){
        console.log("MD5 calculation is correct");

        dispatch( { type: FTP_LOAD_SUCCESS, payload: data } );
        if(device_status == DEVICE_APP_STATUS){
          dispatch( { type: REQUEST_SBL_FOR_UPDATE, payload: "" } );
          dispatch(requestSBL());
        }else{
          dispatch( { type: START_SOFTWARE_UPDATE, payload: data } );
        }
      }else{
        dispatch( { type: FTP_LOAD_FAILURE, payload: "File load failed check sum" } );
      }
    },
    error => {
      dispatch( { type: FTP_LOAD_FAILURE, payload: "File Load failed" } );
    });

  };
}
