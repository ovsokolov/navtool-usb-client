import axios from 'axios';

import { fetchMake } from './get_make';
import { clearSBL } from './hid_action';
import { fetchOBDConfig} from './get_obdconfig'
import { fetchSoftwareConfig } from './get_software'
import { WEB_SERVICES_URL } from '../utils/constants';
import { OBD_COMPLETED } from '../utils/device_utils';
import { DEVICE_OBD_SUCCESS, DEVICE_OBD_FAILED } from './hid_action';
import { DEVICE_SUPPORTED, DEVICE_NOT_SUPPORTED, DEVICE_START_SECTOR } from '../utils/device_utils';

//const ROOT_URL = "https://tranquil-mesa-29755.herokuapp.com/";
const ROOT_URL = WEB_SERVICES_URL + "/v1/navtooldevices/";
export const FETCH_DEVICE_DB_DATA = 'FETCH_DEVICE_DB_DATA';
export const FETCH_DEVICE_MCU = 'FETCH_DEVICE_MCU';


export function fetchDeviceDBData(serial_number, software){

  //console.log('URL', url);

  return (dispatch) => {
    dispatch( { type: FETCH_DEVICE_MCU, payload: serial_number } )
    const url = ROOT_URL + serial_number;
    const request = axios.get(url);
    request.then( ({data}) =>{
      console.log("xxxxxxxxxxxxx")
      console.log(data);
      //console.log(data["mfg_id"])
      console.log("xxxxxxxxxxxxx")
      //console.log(serial_number);
      dispatch( { type: FETCH_DEVICE_DB_DATA, payload: data } )
      if (software !== undefined){
        //console.log("%%%%%%%%Software parameter exists")
        dispatch(fetchSoftwareConfig(data["mfg_id"],software.softwareId,software.softwareBuild,data.vehicle_make,data.vehicle_model))
        //dispatch(fetchOBDConfig(data["mfg_id"], obd.softwareId));
        //dispatch( fetchMake(data["mfg_id"]) )
      }
    });
  };
}

export function updateDeviceDBData(serial_number, update_date){
  const url = ROOT_URL + serial_number;
  const request = axios.put(url, {
    sw_id: update_date.sw_id,
    sw_build: update_date.sw_build,
    vehicle_make: update_date.vehicle_make,
    vehicle_model: update_date.vehicle_model
  });

  //console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      //console.log(data);
      //console.log(data["mfg_id"])
      dispatch( { type: FETCH_DEVICE_DB_DATA, payload: data } )
    });
  };
}

export function updateDeviceOBDData(serial_number, obd_status){
  if(obd_status == DEVICE_OBD_SUCCESS){
    const url = WEB_SERVICES_URL + '/v1/obdupdate/' + "?mcu_id=" + serial_number;
    const request = axios.get(url);

    //console.log('OBD MCU ', serial_number);

    return (dispatch) => {
      request.then( ({data}) =>{
        //console.log(data);
        //console.log(data["mfg_id"])
        dispatch( { type: OBD_COMPLETED, payload: 'Programming Completed' } )
        dispatch(fetchDeviceDBData(serial_number))
      });
    };
  }else{
    return { 
      type: OBD_COMPLETED, 
      payload: 'Programming Failed' 
    }; 
  }
}

export function checkDeviceSupport(mfg_id){
    const url = WEB_SERVICES_URL + '/v1/navtoolhws/' + "?mfg_id=" + mfg_id;
    const request = axios.get(url);

    return (dispatch) => {
      request.then( ({data}) =>{
        //console.log("checkDeviceSupport");
        //console.log(data[0]["hw_hid"]);
        if(data[0]["hw_hid"] == 1 || data[0]["hw_hid"] == 2){
          //console.log("Supported");
          dispatch( { type: DEVICE_SUPPORTED, payload: data[0] } )
        }else{
          //console.log("Not Supported");
          dispatch( { type: DEVICE_NOT_SUPPORTED, payload: '' } )
        }
      });
    };

}

export function checkDeviceStartSector(mfg_id){
    const url = WEB_SERVICES_URL + '/v1/navtoolhws/' + "?mfg_id=" + mfg_id;
    const request = axios.get(url);

    return (dispatch) => {
      request.then( ({data}) =>{
        //console.log("checkDeviceStartSector");
        //console.log("Supported");
        dispatch( { type: DEVICE_START_SECTOR, payload: data[0] } )
      });
    };

}

