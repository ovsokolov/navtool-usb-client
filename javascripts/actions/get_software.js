import axios from 'axios';
import { WEB_SERVICES_URL } from '../utils/constants';
import { fetchOBDConfig} from './get_obdconfig'
import { getOSDSettings } from './hid_action';

export const FETCH_SOFTWARE = 'FETCH_SOFTWARE';
export const SET_SOFTWARE = 'SET_SOFTWARE';

//const ROOT_URL = "https://tranquil-mesa-29755.herokuapp.com/navtoolsws/make";
const ROOT_URL = WEB_SERVICES_URL + "/v1/navtoolsws";

export function fetchSoftware(mfg_id, vehicle_make, vehicle_model, vehicle_year, automatic_transmission){
  let param_url = "?mfg_id=" + mfg_id + "&sw_active=1";
  if(vehicle_make != null && vehicle_make != 0){
    param_url += "&vehicle_make=" + vehicle_make;
  }
  if(vehicle_model != null && vehicle_model != 0){
    param_url += "&vehicle_model=" + vehicle_model;
  }
  if(vehicle_year != null && vehicle_year != 0){
    param_url += "&vehicle_year=" + vehicle_year;
  }
  if(automatic_transmission == null || automatic_transmission == "0"){
    param_url += "&manual_transmission=1";
  }
  const url = ROOT_URL + param_url;
  const request = axios.get(url);

  //console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      //console.log(data);
      dispatch( { type: FETCH_SOFTWARE, payload: data } );
    });
  };
}

export function fetchSoftwareConfig(mfg_id,sw_id, sw_build){
  let param_url = "/sw?mfg_id=" + mfg_id + "&sw_id=" + sw_id + "&sw_build=" + sw_build; 

  const url = ROOT_URL + param_url;
  const request = axios.get(url);

  //console.log('fetchSoftwareConfig URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      //console.log("fetchSoftwareConfig data");
      //console.log(data);
      //console.log("fetchSoftwareConfig data");
      var sw_config = data[0];
      if(sw_config["sw_obd_support"] == "1"){
        dispatch(fetchOBDConfig(mfg_id, sw_id));
      }
      if(sw_config["sw_osd_support"] == "1"){
        dispatch(getOSDSettings());
      }
    });
  };
}

export function setSoftware(software_id){
  return {
    type: SET_SOFTWARE,
    payload: software_id
  };
}
