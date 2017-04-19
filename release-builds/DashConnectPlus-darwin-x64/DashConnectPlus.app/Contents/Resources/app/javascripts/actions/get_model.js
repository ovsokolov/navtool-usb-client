import axios from 'axios';
import { WEB_SERVICES_URL } from '../utils/constants';

//const ROOT_URL = "https://tranquil-mesa-29755.herokuapp.com/navtoolsws/model";
const ROOT_URL = WEB_SERVICES_URL + "/v1/navtoolsws/model";

export const FETCH_MODEL = 'FETCH_MODEL';

export function fetchModel(mfg_id, vehicle_make){
  const url = ROOT_URL + "?mfg_id=" + mfg_id + "&vehicle_make=" + vehicle_make;
  const request = axios.get(url);

  console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      console.log(data);
      let payload_data = {mfg_id, vehicle_make, data};
      dispatch( { type: FETCH_MODEL, payload: payload_data } );
    });
  };
}
