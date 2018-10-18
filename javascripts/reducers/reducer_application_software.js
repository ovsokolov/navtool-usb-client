import { DEVICE_SUPPORTED } from '../utils/device_utils'
import { DEVICE_REMOVED } from '../actions/hid_action';
import { DEVICE_NOT_SUPPORTED } from '../utils/device_utils';


const DEFAULT_STATE = {id: '', path: '', target: ''};

export default function(state = JSON.parse(JSON.stringify(DEFAULT_STATE)), action){
  let result = {};
  switch (action.type){
    case DEVICE_SUPPORTED:
      console.log("Application Software DEVICE_SUPPORTED");
      result = Object.assign({}, state, {id: action.payload.id, path: action.payload.project_path, target: action.payload.target_name});
      console.log("result: ", result)
      return result;
    case DEVICE_REMOVED:
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    case DEVICE_NOT_SUPPORTED:
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
  return state;
}