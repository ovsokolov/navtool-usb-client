import axios from 'axios';
import { WEB_SERVICES_URL } from '../utils/constants';

//const ROOT_URL = "https://tranquil-mesa-29755.herokuapp.com/navtoolsws/model";
const ROOT_URL = WEB_SERVICES_URL + "/v1/labelconfigs";

export const FETCH_OBD_CONFIG = 'FETCH_OBD_CONFIG';

export function fetchOBDConfig(mfg_id, softwareId){
  const url = ROOT_URL + "?mfg_id=" + mfg_id + "&sw_id=" + softwareId;
  const request = axios.get(url);

  console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      let payload_data = data;
      console.log("+++++++++++fetchOBDConfig data");
      console.log(payload_data);
      dispatch( { type: FETCH_OBD_CONFIG, payload: payload_data } );
    });
  };
}