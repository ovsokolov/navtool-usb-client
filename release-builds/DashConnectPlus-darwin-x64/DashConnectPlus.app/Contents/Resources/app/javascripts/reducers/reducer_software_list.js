import { FETCH_SOFTWARE } from '../actions/get_software';
import { DEVICE_REMOVED } from '../actions/hid_action';


export default function(state = [], action){
  switch (action.type){
    case FETCH_SOFTWARE:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      return action.payload;
    case DEVICE_REMOVED:
      return [];
  }
  return state;
}
