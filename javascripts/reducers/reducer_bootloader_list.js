import { FETCH_BOOTLOADER } from '../actions/get_bootloader';
import { DEVICE_NOT_SUPPORTED } from '../utils/device_utils';


export default function(state = [], action){
  switch (action.type){
    case FETCH_BOOTLOADER:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      console.log("FETCH_BOOTLOADER");
      console.log(action.payload);
      return action.payload;
    case DEVICE_NOT_SUPPORTED:
      return [];
  }
  return state;
}