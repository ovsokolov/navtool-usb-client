import { DEVICE_DATA_SETTINGS, DEVICE_REMOVED } from '../actions/hid_action';

export default function(state = {}, action){
  switch (action.type){
    case DEVICE_DATA_SETTINGS:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      console.log('Action recieved', DEVICE_DATA_SETTINGS);
      console.log(action.payload);
      return action.payload;
    case DEVICE_REMOVED:
      return {};
  }
  return state;
}
