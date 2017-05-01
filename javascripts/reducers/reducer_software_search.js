import { FETCH_MAKE } from '../actions/get_make';
import { FETCH_MODEL } from '../actions/get_model';
import { FETCH_YEAR, SET_YEAR } from '../actions/get_year';
import { DEVICE_REMOVED, DEVICE_MFG_ID_RECIEVED } from '../actions/hid_action';
import { SET_TRANSMISSION_TYPE } from '../actions/set_transmission';
import { SET_SOFTWARE } from '../actions/get_software';


const DEFAULT_STATE = {mfg_id: '', vehicle_make: '', vehicle_model: '', vehicle_year: '', sw_id: '', sw_valid_status: 1, automatic_transmission: 1};

export default function(state = JSON.parse(JSON.stringify(DEFAULT_STATE)), action){
  let result = {};
  switch (action.type){
    case DEVICE_MFG_ID_RECIEVED:
    case FETCH_MAKE:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      result = Object.assign({}, state, {mfg_id: action.payload.mfg_id});
      return result;
    case FETCH_MODEL:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      result = Object.assign({}, state, {vehicle_make: action.payload.vehicle_make});
      //console.log(result);
      return result;
    case FETCH_YEAR:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      result = Object.assign({}, state, {vehicle_model: action.payload.vehicle_model});
      //console.log(result);
      return result;
    case SET_TRANSMISSION_TYPE:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      result = Object.assign({}, state, {automatic_transmission: action.payload});
      //console.log(result);
      return result;
    case SET_YEAR:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      //console.log("Software reducer");
      result = Object.assign({}, state, {vehicle_year: action.payload});
      //console.log(result);
      return result;
    case SET_SOFTWARE:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      result = Object.assign({}, state, {sw_id: action.payload});
      //console.log(result);
      return result;
    case DEVICE_REMOVED:
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
  return state;
}
