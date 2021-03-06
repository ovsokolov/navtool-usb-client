import axios from 'axios';
import { WEB_SERVICES_URL } from '../utils/constants';

//const ROOT_URL = "https://tranquil-mesa-29755.herokuapp.com/navtoolsws/make";
const ROOT_URL = WEB_SERVICES_URL + "/v1/navtoolsws/make";
export const FETCH_MAKE = 'FETCH_MAKE';

export function fetchMake(mfg_id){
  //console.log("In fetchMake ", mfg_id);
  const url = ROOT_URL + "?mfg_id=" + mfg_id;
  const request = axios.get(url);

  //console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      //console.log(data);
      data.sort((a, b) => a.make_id.localeCompare(b.make_id));
      let payload_data = {mfg_id, data};
      //console.log("FETCH MAKE");
      //console.log(mfg_id);
      //console.log(data);
      dispatch( { type: FETCH_MAKE, payload: payload_data } );
    });
  };
}
