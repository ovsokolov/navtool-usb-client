import { DEVICE_DATA_SETTINGS, DEVICE_REMOVED } from '../actions/hid_action';
import { DEVICE_NOT_SUPPORTED } from '../utils/device_utils';

export default function(state = {}, action){
  switch (action.type){
    case DEVICE_DATA_SETTINGS:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      //console.log('reducer_device.js#Action recieved', DEVICE_DATA_SETTINGS);
      //console.log(action.payload);
      return action.payload;
    case DEVICE_REMOVED:
      return {};
    case DEVICE_NOT_SUPPORTED:
      return {};
  }
  return state;
}
