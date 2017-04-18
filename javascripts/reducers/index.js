import { combineReducers } from 'redux';
import CarMakeReducer from './reducer_make'
import CarModelReducer from './reducer_model'
import CarYearReducer from './reducer_year'
import DeviceDBDataReducer from './reducer_db_device'
import DeviceDataReducer from './reducer_device'
import DeviceStatusReducer from './reducer_device_status'
import DeviceSettingsReducer from './reducer_device_settings'
import SoftwareSearchReducer from './reducer_software_search'
import SoftwareListReducer from './reducer_software_list'
import SoftwareUpdateReducer from './reducer_software_update'
import OBDFeaturesReducer from './reducer_obd_features'
import Message from './reducer_message'
import ModalState from './reducer_modal'

const rootReducer = combineReducers({
  //state: (state = {}) => state
  device_db_data: DeviceDBDataReducer,
  device_data: DeviceDataReducer,
  system_settings: DeviceSettingsReducer,
  car_make: CarMakeReducer,
  car_model: CarModelReducer,
  car_year: CarYearReducer,
  software_search: SoftwareSearchReducer,
  software_list: SoftwareListReducer,
  device_status: DeviceStatusReducer,
  software_update: SoftwareUpdateReducer,
  obd_features: OBDFeaturesReducer,
  message: Message, 
  modal_state: ModalState
});

export default rootReducer;
