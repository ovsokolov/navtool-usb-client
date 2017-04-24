import { FETCH_MAKE } from '../actions/get_make';
import { DEVICE_REMOVED } from '../actions/hid_action';

const DEFAULT_DROPDOWN_VALUE = {make_id: 0, vehicle_make:"Select Make..."};

export default function(state = {list: [DEFAULT_DROPDOWN_VALUE]}, action){
  switch (action.type){
    case FETCH_MAKE:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      return {list: [DEFAULT_DROPDOWN_VALUE, ...action.payload.data]};
    case DEVICE_REMOVED:
      return {list: [DEFAULT_DROPDOWN_VALUE]};
  }
  return state;
}
