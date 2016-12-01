import { combineReducers } from 'redux';
import CarMakeReducer from './reducer_make'
import CarModelReducer from './reducer_model'
import DeviceDBDataReducer from './reducer_device'

const rootReducer = combineReducers({
  //state: (state = {}) => state
  device_db_data: DeviceDBDataReducer,
  car_make: CarMakeReducer,
  car_model: CarModelReducer
});

export default rootReducer;
