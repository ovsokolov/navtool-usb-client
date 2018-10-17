import { SET_BOOTLOADER } from '../actions/get_bootloader';
import { DEVICE_REMOVED } from '../actions/hid_action';
import { DEVICE_NOT_SUPPORTED } from '../utils/device_utils';


const DEFAULT_STATE = {id: '', path: '', target: ''};

export default function(state = JSON.parse(JSON.stringify(DEFAULT_STATE)), action){
  let result = {};
  switch (action.type){
    case SET_BOOTLOADER:
      console.log("Reducer SET_BOOTLOADER");
      console.log(action.payload);
      return action.payload;
    case DEVICE_REMOVED:
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    case DEVICE_NOT_SUPPORTED:
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
  return state;
}