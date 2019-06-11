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
import OSDSettingsReducer from './reducer_osd_settings'
import Message from './reducer_message'
import ModalState from './reducer_modal'
import OrderStatusList from './reducer_order_status_list'
import OrderList from './reducer_order_list'
import OrderItems from './reducer_order'

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
  osd_settings: OSDSettingsReducer,
  message: Message, 
  modal_state: ModalState,
  status_list: OrderStatusList,
  order_list: OrderList,
  order_items: OrderItems
});

export default rootReducer;
