import axios from 'axios';

import { fetchMake } from './get_make';
import { clearSBL } from './hid_action';
import { fetchOBDConfig} from './get_obdconfig'
import { WEB_SERVICES_URL } from '../utils/constants';

//const ROOT_URL = "https://tranquil-mesa-29755.herokuapp.com/";
const ROOT_URL = WEB_SERVICES_URL + "/v1/navtooldevices/";
export const FETCH_DEVICE_DB_DATA = 'FETCH_DEVICE_DB_DATA';
export const REQUEST_REBOOT_AFTER_UPDATE = 'REQUEST_REBOOT_AFTER_UPDATE';

export function fetchDeviceDBData(serial_number, obd){
  const url = ROOT_URL + serial_number;
  const request = axios.get(url);

  console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      console.log(data);
      console.log(data["mfg_id"])
      console.log("xxxxxxxxxxxxx")
      console.log(serial_number);
      dispatch( { type: FETCH_DEVICE_DB_DATA, payload: data } )
      if(obd.isOBDSupported){
        dispatch(fetchOBDConfig(data["mfg_id"], obd.softwareId));
      }
      dispatch( fetchMake(data["mfg_id"]) )
    });
  };
}

export function updateDeviceDBData(serial_number, update_date, reboot){
  const url = ROOT_URL + serial_number;
  const request = axios.put(url, {
    sw_id: update_date.sw_id,
    sw_build: update_date.sw_build,
    vehicle_make: update_date.vehicle_make,
    vehicle_model: update_date.vehicle_model
  });

  console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      console.log(data);
      console.log(data["mfg_id"])
      dispatch( { type: FETCH_DEVICE_DB_DATA, payload: data } )
      if(reboot){
        clearSBL()
        dispatch( { type: REQUEST_REBOOT_AFTER_UPDATE, payload: '' })
      }
    });
  };
}