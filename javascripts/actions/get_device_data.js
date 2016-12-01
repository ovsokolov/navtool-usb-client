import axios from 'axios';

import { fetchMake } from './get_make';

const ROOT_URL = "https://tranquil-mesa-29755.herokuapp.com/";

export const FETCH_DEVICE_DB_DATA = 'FETCH_DEVICE_DB_DATA';

export function fetchDeviceDBData(serial_number){
  const url = ROOT_URL + "navtooldevices/" + serial_number;
  const request = axios.get(url);

  console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      console.log(data);
      console.log(data["mfg_id"])
      dispatch( { type: FETCH_DEVICE_DB_DATA, payload: data } )
      dispatch( fetchMake(data["mfg_id"]) )
    });
  };
}
