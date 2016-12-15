import React, { Component} from 'react';
import SearchMake from '../containers/search_make'
import SoftwareSearch from '../containers/software_search'
import DeviceSettings from '../containers/device_settings'

import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { saveDeviceSettings, updateDeviceVichecleInfo, requestSBL, sendSoftwareUpdateData } from'../actions/hid_action';
import { hidAction } from '../actions/hid_action';

import { loadFTPFile } from '../actions/ftp_action';
import { updateDeviceDBData } from '../actions/get_device_data';

import { DEVICE_APP_STATUS } from '../utils/device_utils';

import { SYSTEM_SETTINGS } from '../utils/structures';

import { INIT_IPC } from '../actions/hid_action';
import { UPDATE_READY, UPDATE_IN_PROGRESS, AFTER_UPDATE_ACTION, UPDATE_COMPLETED } from '../utils/device_utils'
import { SET_UP_TRANSFER,
         START_TRANSFER,
         PACKET_SEND,
         BLOCK_VALIDATE,
         SECTOR_WRITE,
         TRANSFER_COMPLETED,
         WAITING_FOR_APP_UPDATE} from '../utils/device_utils'

const {ipcRenderer} = require('electron');

var MdImportantDevices = require('react-icons/lib/md/important-devices');

class Device extends Component {
  constructor(props){
    super(props);
    var init_system_settings = JSON.parse(JSON.stringify(SYSTEM_SETTINGS));
    this.state = {device_data: [], mfg_id: '', serial_number: '', system_settings: init_system_settings, device_update_status: ''}
    console.log(this.state);

    this.readDeviceSettings = this.readDeviceSettings.bind(this);
    this.checkDevice = this.checkDevice.bind(this);
    this.saveDeviceSettings = this.saveDeviceSettings.bind(this);
    this.requestSBL = this.requestSBL.bind(this);
    this.clearSBL = this.clearSBL.bind(this);
    this.installSoftware = this.installSoftware.bind(this);
    this.transferSetup = this.transferSetup.bind(this);
  }

  transferSetup(){
      console.log(this.props.device_data);
      console.log(this.props.software_update);
      this.props.updateDeviceVichecleInfo(this.props.device_data, this.props.software_update);
  }

  componentWillMount(){
    this.props.hidAction(INIT_IPC);
  }

  componentWillReceiveProps(nextProps){
    //console.log(this.state.device_update_status);
    //console.log(nextProps.software_update.update_progress_status);
    //console.log(nextProps.device_status.app_status);
    //console.log(this.props.device_status.update_status);
    if(nextProps.device_status.update_status == UPDATE_READY && this.state.device_update_status != UPDATE_READY){
      this.setState({device_update_status: UPDATE_READY});
    }
    if(nextProps.device_status.app_status == DEVICE_APP_STATUS && this.state.device_update_status == AFTER_UPDATE_ACTION){
      if(nextProps.device_data != this.props.device_data){
        this.setState({device_update_status: UPDATE_COMPLETED});
        this.props.updateDeviceVichecleInfo(nextProps.device_data, this.props.software_update);
      }
    }
    if(this.state.device_update_status == UPDATE_IN_PROGRESS && nextProps.software_update.update_progress_status == START_TRANSFER){
      console.log("Will start transfer");
      this.props.sendSoftwareUpdateData(START_TRANSFER, nextProps.software_update);
    }
    if(this.state.device_update_status == UPDATE_IN_PROGRESS && nextProps.software_update.update_progress_status == PACKET_SEND){
      //console.log("Will start packet send", nextProps.software_update);
      this.props.sendSoftwareUpdateData(PACKET_SEND, nextProps.software_update);
    }
    if(this.state.device_update_status == UPDATE_IN_PROGRESS && nextProps.software_update.update_progress_status == BLOCK_VALIDATE){
      //console.log("Will validate block", nextProps.software_update);
      this.props.sendSoftwareUpdateData(BLOCK_VALIDATE, nextProps.software_update);
    }
    if(this.state.device_update_status == UPDATE_IN_PROGRESS && nextProps.software_update.update_progress_status == SECTOR_WRITE){
      //console.log("Will write sector", nextProps.software_update);
      this.props.sendSoftwareUpdateData(SECTOR_WRITE, nextProps.software_update);
    }
    if(this.state.device_update_status == UPDATE_IN_PROGRESS && nextProps.software_update.update_progress_status == TRANSFER_COMPLETED){
      //console.log("Transfer completed", nextProps.software_update);
      this.setState({device_update_status: AFTER_UPDATE_ACTION});
      this.props.updateDeviceDBData(
        this.props.device_db_data.mcu_serial,
        nextProps.software_update,
        true);
    }
  }

  componentDidUpdate(){
    if(this.state.device_update_status == UPDATE_READY && this.props.software_update.update_progress_status == SET_UP_TRANSFER){
      this.setState({device_update_status: UPDATE_IN_PROGRESS});
      this.props.sendSoftwareUpdateData(SET_UP_TRANSFER,this.props.software_update);
    }
  }

  installSoftware(){
    var sw_id = this.props.software_search.sw_id;
    console.log("inside installSoftware", sw_id);
    this.props.loadFTPFile(sw_id, this.props.device_status.app_status);
  }

  readDeviceSettings(){
    console.log('Read Device System Data');
    ipcRenderer.send('device-read-settings', 0x1A);
  }

  checkDevice(){
    console.log('Checking device');
    ipcRenderer.send('check-device');
  }

  saveDeviceSettings(settings){
    let device_data = this.props.device_data;
    this.props.saveDeviceSettings(device_data, settings);
  }

  requestSBL(){
    console.log('Request SBL');
    this.setState({device_update_status: ''})
    this.props.requestSBL();
  }

  clearSBL(){
    this.setState({device_update_status: ''})
    console.log('Clear SBL');
    let arg = [];
    arg[0] = 0x00;
    arg[1] = 0x08;
    arg[2] = 0x00;
    arg[3] = 0x00;
    arg[4] = 0x00;
    //ipcRenderer.send('device-sbl', 0x08);
    ipcRenderer.send('device-sbl', arg);
    arg[0] = 0x00;
    arg[1] = 0x09;
    arg[2] = 0x00;
    arg[3] = 0x00;
    arg[4] = 0x00;
    //ipcRenderer.send('device-sbl', 0x09);
    ipcRenderer.send('device-sbl', arg);
  }

  render(){
    const x = function(){};

    return (
      <div>
        <div className="container-fluid">
          <div className="mui-row">
            <div className="mui-col-xs-2">
                <div>&nbsp;</div>
                <div className="mui-row">
                  <div className="mui-col-xs-1">&nbsp;</div>
                  <div className="mui-col-xs-4 mui--align-middle  mui--text-left">
                    <MdImportantDevices color='green' size={60} />
                  </div>
                </div>
            </div>
            <div className="mui-col-xs-10">
              <div className="mui--text-dark mui--text-left mui--text-body2">
                Device ID: {this.props.device_db_data.mcu_serial}
              </div>
              <div className="mui--text-dark mui--text-left mui--text-body2">
                Device Model: {this.props.device_db_data.mfg_id}
              </div>
              <div className="mui--text-dark mui--text-left mui--text-body2">
                Vihecle Make : {this.props.device_db_data.vehicle_make}
              </div>
              <div className="mui--text-dark mui--text-left mui--text-body2">
                Vihecle Model : {this.props.device_db_data.vehicle_model}
              </div>
            </div>
          </div>
          <button onClick={this.requestSBL} className="mui-btn mui-btn--danger">Request SBL</button>
          <button onClick={this.clearSBL} className="mui-btn mui-btn--primary">Clear SBL</button>
          <button onClick={this.readDeviceSettings} className="mui-btn mui-btn--primary">Read Setting</button>
          <button onClick={this.checkDevice} className="mui-btn mui-btn--primary">Find Device</button>
          <button onClick={this.installSoftware} className="mui-btn mui-btn--danger">Install Siftware</button>
          <button onClick={this.transferSetup} className="mui-btn mui-btn--danger">Update DB</button>
        </div>
        <ul className="mui-tabs__bar">
          <li className="mui--is-active"><a data-mui-toggle="tab" data-mui-controls="pane-default-1">Device Data</a></li>
          <li><a data-mui-toggle="tab" data-mui-controls="pane-default-2">Software Update</a></li>
          <li><a data-mui-toggle="tab" data-mui-controls="pane-default-3">Tab-3</a></li>
        </ul>
        <div className="mui-tabs__pane mui--is-active" id="pane-default-1">
          <DeviceSettings
            systemSettings = {this.props.system_settings}
            onDeviceSettingsSave={this.saveDeviceSettings}
          />
        </div>
        <div className="mui-tabs__pane" id="pane-default-2">
          <SoftwareSearch />
        </div>
        <div className="mui-tabs__pane" id="pane-default-3">Pane-3</div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return { device_db_data: state.device_db_data,
           device_data: state.device_data,
           device_status: state.device_status,
           system_settings: state.system_settings,
           software_update: state.software_update,
           software_search: state.software_search
         };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ hidAction, saveDeviceSettings, updateDeviceVichecleInfo, requestSBL, loadFTPFile, sendSoftwareUpdateData, updateDeviceDBData }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Device);
