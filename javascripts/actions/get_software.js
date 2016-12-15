import axios from 'axios';

export const FETCH_SOFTWARE = 'FETCH_SOFTWARE';
export const SET_SOFTWARE = 'SET_SOFTWARE';

//const ROOT_URL = "https://tranquil-mesa-29755.herokuapp.com/navtoolsws/make";
const ROOT_URL = "http://localhost:3000/v1/navtoolsws?";

export function fetchSoftware(mfg_id, vehicle_make, vehicle_model, vehicle_year, automatic_transmission){
  let param_url = "mfg_id=" + mfg_id + "&sw_active=1";
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

  console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      console.log(data);
      dispatch( { type: FETCH_SOFTWARE, payload: data } );
    });
  };
}

export function setSoftware(software_id){
  return {
    type: SET_SOFTWARE,
    payload: software_id
  };
}
