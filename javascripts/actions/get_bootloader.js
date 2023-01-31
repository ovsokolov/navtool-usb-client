const {ipcRenderer} = require('electron');

import axios from 'axios';
import { WEB_SERVICES_URL } from '../utils/constants';

export const FETCH_BOOTLOADER = 'FETCH_BOOTLOADER';
export const SET_BOOTLOADER = 'SET_BOOTLOADER';
export const RUN_BOOTLOADER = 'RUN_BOOTLOADER';
export const INSTALL_IMAGES = 'INSTALL_IMAGES';

//const ROOT_URL = "https://tranquil-mesa-29755.herokuapp.com/navtoolsws/make";
const ROOT_URL = WEB_SERVICES_URL + "/v1/navtoolbtls";

export function fetchBootloader(){
  const url = ROOT_URL;
  const request = axios.get(url);

  //console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      //console.log(data);
      dispatch( { type: FETCH_BOOTLOADER, payload: data } );
    });
  };
}


export function setBootloader(id, path, target){
  console.log("in setBootloader ", id);
  console.log("in setBootloader ", path);
  console.log("in setBootloader ", target);
  return {
    type: SET_BOOTLOADER,
    payload: {id, path, target}
  };
}

export function runBootloader(target){
  ipcRenderer.send('install-bootloader', {target});
  return {
    type: RUN_BOOTLOADER,
    payload: ''
  };
}

export function runApplication(target, mcu_type){
  ipcRenderer.send('install-application', {target, mcu_type});
  return {
    type: RUN_BOOTLOADER,
    payload: ''
  };
}

export function loadImages(mcu_serial){
  ipcRenderer.send('install-images', {mcu_serial});
  return {
    type: INSTALL_IMAGES,
    payload: ''
  };
}