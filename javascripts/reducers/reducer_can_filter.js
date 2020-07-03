import { SET_CAN_FILTER, SET_CAN_FILTER_SUCCESS, CAN_FILTER_NOT_SET, CLEAR_CAN_FILTER, GET_CAN_FILTER_DATA_RESULT, CLEAR_CAN_FILTER_RESULT} from '../actions/hid_action';
import { DEVICE_REMOVED } from '../actions/hid_action';
import { DEVICE_NOT_SUPPORTED } from '../utils/device_utils';

export default function(state = JSON.parse(JSON.stringify({filter_status: CAN_FILTER_NOT_SET, filter_data: [], filter_result: []})), action){
  let result = {};
  switch (action.type){
    case SET_CAN_FILTER:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      //console.log('Action recieved', FETCH_DEVICE_DB_DATA);
      //console.log(action.payload);
      result = Object.assign({}, state, {filter_data: action.payload});
      //console.log(result);
      return result;
    case SET_CAN_FILTER_SUCCESS:
      //console.log('Action recieved', FETCH_DEVICE_MCU);
      //console.log(action.payload);
      result = Object.assign({}, state, {filter_status: action.payload});
      return result;
    case CLEAR_CAN_FILTER:
      return {filter_status: CAN_FILTER_NOT_SET, filter_data: [], filter_result: []};
    case GET_CAN_FILTER_DATA_RESULT:
      console.log('here');
      let current_data = state.filter_result;
      console.log(current_data);
      let new_data = [...action.payload]
      console.log(new_data);
      console.log(state);
      current_data[current_data.length] = new_data;
      console.log(current_data);
      result = Object.assign({}, state, {filter_result: current_data });
      console.log(result);
      return result;
    case CLEAR_CAN_FILTER_RESULT:
      result = Object.assign({}, state, {filter_result: [] });
      return result;
    case DEVICE_REMOVED:
      return {filter_status: CAN_FILTER_NOT_SET, filter_data: [], filter_result: []};
    case DEVICE_NOT_SUPPORTED:
      return {filter_status: CAN_FILTER_NOT_SET, filter_data: [], filter_result: []};
  }
  return state;
}