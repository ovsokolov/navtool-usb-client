import { FTP_LOAD_SUCCESS } from '../actions/ftp_action';
import { COMPLETE_UPDATE_REQUEST } from '../actions/hid_action'
import { REQUEST_DATA_SETUP_RESPONSE,
         REQUEST_TRANSFER_START_RESPONSE,
         REQUEST_PACKET_SEND_RESPONSE,
         REQUEST_VALIDATE_BLOCK_SEND_RESPONSE,
         REQUEST_SECTOR_WRITE_SEND_RESPONSE,
         REQUEST_REBOOT_AFTER_UPDATE } from '../actions/hid_action';

import { UPDATE_NOT_STARTED,
         GET_START_SECTOR,
         SET_UP_TRANSFER,
         START_TRANSFER,
         PACKET_SEND,
         BLOCK_VALIDATE,
         SECTOR_WRITE,
         TRANSFER_COMPLETED,
         DB_UPDATE_COMPLETED,
         UPDATE_ERROR,
         DISPLAY_UPDATE_ERROR,
         DISPLAY_UPDATE_SETUP_ERROR,
         DEVICE_START_SECTOR,
         DEVICE_SUPPORTED } from '../utils/device_utils'


const PACKET_SIZE = 16;
const BLOCK_SIZE = 256;
const SECTOR_SIZE = 4096;
const START_SECTOR = -1;

const SECTOR_WRITE_SUCCESS = 2;

const DEFAULT_UPDATE_STATE = { block_size: BLOCK_SIZE,
                               packet_size: PACKET_SIZE,
                               start_sector: START_SECTOR,
                               blocks_count: 0,
                               total_secotrs: 0,
                               software_file: '',
                               current_packet: 0,
                               current_block: 0,
                               current_sector: 0,
                               current_position: 0,
                               current_packet_data: [],
                               curerent_packet_sum: 0,
                               current_running_sum: 0,
                               file_check_sum: 0,
                               file_size: 0,
                               num_of_erorrs: 0,
                               sw_id: 0,
                               sw_build: 0,
                               vehicle_make: '',
                               vehicle_model: '',
                               update_progress_status: UPDATE_NOT_STARTED
                            };

export default function(state = DEFAULT_UPDATE_STATE, action){
  let new_state = {};
  let payload_data = {};
  switch (action.type){
    case DEVICE_SUPPORTED:
      console.log(action.payload);
      new_state = JSON.parse(JSON.stringify(state));
      //console.log("software update: DEVICE_SUPPORTED");
      //console.log(action.payload.start_sector);
      new_state.start_sector = action.payload.start_sector;
      //console.log(new_state);
      return new_state;
    case DEVICE_START_SECTOR:
      console.log(action.payload);
      new_state = JSON.parse(JSON.stringify(state));
      //console.log("software update: DEVICE_SUPPORTED");
      //console.log(action.payload.start_sector);
      new_state.start_sector = action.payload.start_sector;
      //console.log(new_state);
      return new_state;
    case FTP_LOAD_SUCCESS:
      ////console.log(action.payload);
      console.log("********* Some How here **********");
      new_state = JSON.parse(JSON.stringify(state));
      new_state.total_secotrs = Math.ceil(action.payload.size / SECTOR_SIZE);
      new_state.blocks_count = Math.ceil( SECTOR_SIZE /  BLOCK_SIZE );
      new_state.software_file = atob(action.payload.file);
      new_state.file_size = action.payload.size;
      new_state.sw_id = action.payload.sw_id;
      new_state.sw_build = action.payload.sw_build;
      new_state.vehicle_make = action.payload.vehicle_make;
      new_state.vehicle_model = action.payload.vehicle_model;
      var currentSum = 0;
      for (var i = 0; i < new_state.file_size; i++) {
        var el = new_state.software_file.charCodeAt(i);
        currentSum += el;
      }
      new_state.file_check_sum = currentSum;
      new_state.update_progress_status = SET_UP_TRANSFER;
      //new_state.update_progress_status = GET_START_SECTOR;
      ////console.log(new_state);
      return new_state
    case REQUEST_DATA_SETUP_RESPONSE:
      new_state = JSON.parse(JSON.stringify(state));
      payload_data = action.payload;
      if(new_state.block_size == payload_data.block_size &&
         new_state.blocks_count == payload_data.blocks_count &&
         new_state.packet_size == payload_data.packet_size &&
         new_state.start_sector == payload_data.start_sector &&
         new_state.total_secotrs == payload_data.total_secotrs){
            ////console.log("Setup Success !!");
            new_state.current_packet = 0;
            new_state.current_block = 0;
            new_state.current_sector = 0;
            new_state.curerent_packet_sum = 0;
            new_state.current_running_sum = 0;
            new_state.update_progress_status = START_TRANSFER;

      }else{
           //console.log("Setup Error !!");
           new_state.update_progress_status = UPDATE_ERROR;
      }
      ////console.log(new_state);
      return new_state
    case REQUEST_TRANSFER_START_RESPONSE:
      new_state = JSON.parse(JSON.stringify(state));
      return preparePacketData(new_state);
    case REQUEST_PACKET_SEND_RESPONSE:
      new_state = JSON.parse(JSON.stringify(state));
      payload_data = action.payload;
      if(payload_data.remaining_packets == 0){
        ////console.log("end of block");
        ////console.log(new_state.curerent_packet_sum);
        ////console.log(payload_data.check_sum)
        if(new_state.curerent_packet_sum == payload_data.check_sum ){
          new_state.num_of_erorrs = 0;
          new_state.current_running_sum = new_state.current_running_sum + new_state.curerent_packet_sum;
          new_state.update_progress_status = BLOCK_VALIDATE;
          ////console.log("BLOCK VALIDATE", new_state.current_running_sum);
        }else{
          new_state.curerent_packet_sum = 0;
          new_state.current_packet = 0;
          new_state.num_of_erorrs = new_state.num_of_erorrs  + 1;
          if(new_state.num_of_erorrs > 3){
            //console.log("Update Error !!");
            new_state.update_progress_status = UPDATE_ERROR;
          }
        }
      }else{
        new_state.current_packet = new_state.current_packet + 1;
        new_state = preparePacketData(new_state);
      }
      return new_state;
    case REQUEST_VALIDATE_BLOCK_SEND_RESPONSE:
      new_state = JSON.parse(JSON.stringify(state));
      payload_data = action.payload; //remaining blocks
      new_state.curerent_packet_sum = 0;
      new_state.current_packet = 0;
      if(payload_data == 0){ //no block remain in sector
        new_state.current_block = 0;
        new_state.num_of_erorrs = 0;
        new_state.update_progress_status = SECTOR_WRITE;
      }else{
        new_state.current_block = new_state.current_block + 1;
        new_state = preparePacketData(new_state);
      }
      return new_state;
    case REQUEST_SECTOR_WRITE_SEND_RESPONSE:
      new_state = JSON.parse(JSON.stringify(state));
      payload_data = action.payload; //sector write result
      if(payload_data == SECTOR_WRITE_SUCCESS){ // write success
        new_state.current_sector = new_state.current_sector + 1;
        if(new_state.current_sector == new_state.total_secotrs){
          console.log("Transfer Completed");
          console.log(new_state.current_running_sum);
          console.log(new_state.file_check_sum);
          if(new_state.file_check_sum != new_state.current_running_sum){
            new_state.update_progress_status = UPDATE_ERROR;
          }else{
            new_state.update_progress_status = TRANSFER_COMPLETED;
          }
        }else{
          new_state.update_progress_status = START_TRANSFER;
        }
      }else{
        new_state.num_of_erorrs = new_state.num_of_erorrs  + 1;
        new_state.update_progress_status = SECTOR_WRITE;
        if(new_state.num_of_erorrs > 3){
          new_state.update_progress_status = UPDATE_ERROR;
        }
      }
      return new_state;
    case REQUEST_REBOOT_AFTER_UPDATE:
      new_state = JSON.parse(JSON.stringify(state));
      new_state.update_progress_status = DB_UPDATE_COMPLETED;
      return new_state;
    case COMPLETE_UPDATE_REQUEST:
      new_state = JSON.parse(JSON.stringify(state));
      new_state.update_progress_status = UPDATE_NOT_STARTED;
      return new_state;
    case UPDATE_ERROR:
      new_state = JSON.parse(JSON.stringify(DEFAULT_UPDATE_STATE));
      new_state.update_progress_status = DISPLAY_UPDATE_ERROR;
      return new_state;
    case DISPLAY_UPDATE_ERROR:
      console.log('########## reset status UPDATE_NOT_STARTED #####');
      new_state = JSON.parse(JSON.stringify(state));
      new_state.update_progress_status = UPDATE_NOT_STARTED;
      return new_state;
    case DISPLAY_UPDATE_SETUP_ERROR:
      console.log('########## reset status DISPLAY_UPDATE_SETUP_ERROR #####');
      new_state = JSON.parse(JSON.stringify(state));
      new_state.update_progress_status = UPDATE_ERROR;
      return new_state;
  }
  return state;
}

function preparePacketData(new_state){
  var currentPacket = [];
  var currentSum = 0;
  var currentPosition = (SECTOR_SIZE * new_state.current_sector) + (BLOCK_SIZE * new_state.current_block) + (PACKET_SIZE * new_state.current_packet);
  for (var i = 0; i < PACKET_SIZE; i++) {
    if((currentPosition + i) < new_state.file_size){
      var el = new_state.software_file.charCodeAt(currentPosition + i);
      currentPacket.push(el);
      currentSum += el;
    }else{
      currentPacket.push(0);
    }
  }
  new_state.current_position = currentPosition;
  new_state.current_packet_data = currentPacket;
  new_state.curerent_packet_sum = new_state.curerent_packet_sum + currentSum;
  new_state.update_progress_status = PACKET_SEND;
  ////console.log(currentPacket);
  ////console.log(currentSum);
  ////console.log(new_state.curerent_packet_sum);
  ////console.log("Packet data in reducer", new_state);
  return new_state;
}
