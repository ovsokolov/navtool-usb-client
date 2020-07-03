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
import BootoaderListReducer from './reducer_bootloader_list'
import BootoaderSearchReducer from './reducer_bootloader_search'
import SoftwareUpdateReducer from './reducer_software_update'
import OBDFeaturesReducer from './reducer_obd_features'
import OSDSettingsReducer from './reducer_osd_settings'
import ApplicationSoftware from './reducer_application_software'
import Message from './reducer_message'
import ModalState from './reducer_modal'
import CanFilter from './reducer_can_filter'

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
  bootloader_list: BootoaderListReducer,
  bootloader_search: BootoaderSearchReducer,
  application_software: ApplicationSoftware,
  device_status: DeviceStatusReducer,
  software_update: SoftwareUpdateReducer,
  obd_features: OBDFeaturesReducer,
  osd_settings: OSDSettingsReducer,
  message: Message, 
  modal_state: ModalState,
  can_filter: CanFilter
});

export default rootReducer;
