import { FETCH_DEVICE_DB_DATA } from '../actions/get_device_data';
import { DEVICE_REMOVED } from '../actions/hid_action';
import { DEVICE_NOT_SUPPORTED } from '../utils/device_utils';

export default function(state = {}, action){
  switch (action.type){
    case FETCH_DEVICE_DB_DATA:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      //console.log('Action recieved', FETCH_DEVICE_DB_DATA);
      //console.log(action.payload);
      return action.payload;
    case DEVICE_REMOVED:
      return {};
    case DEVICE_NOT_SUPPORTED:
      return {};
  }
  return state;
}
