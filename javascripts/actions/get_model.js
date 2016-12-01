import axios from 'axios';

const ROOT_URL = "https://tranquil-mesa-29755.herokuapp.com/navtoolsws/model";

export const FETCH_MODEL = 'FETCH_MODEL';

export function fetchModel(mfg_id, carMake){
  const url = ROOT_URL + "?mfg_id=" + mfg_id + "&vehicle_make=" + carMake;
  const request = axios.get(url);

  console.log('URL', url);
  console.log('Request', request);

  return {
    type: FETCH_MODEL,
    payload: request
  };
}
