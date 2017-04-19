import React, { Component} from 'react';
import SearchMake from '../containers/search_make'
import SoftwareSearch from '../containers/software_search'
import DeviceSettings from '../containers/device_settings'
import DeviceInfo from  '../containers/device_info'
import OBDFeatures from '../containers/obd_features'
import OSDSettings from '../containers/osd_settings'
import Modal from '../components/modal'
import UpdateProgress from '../containers/update_progress'
import ProgrammingProgress from '../containers/programming_progress'

import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { saveDeviceSettings, updateDeviceVichecleInfo, requestSBL, sendSoftwareUpdateData, saveDeviceOSDSettings } from'../actions/hid_action';
import { hidAction } from '../actions/hid_action';
import { startOBDProgramming } from '../actions/hid_action';
import { getOSDSettings } from '../actions/hid_action';


import { loadFTPFile } from '../actions/ftp_action';
import { updateDeviceDBData } from '../actions/get_device_data';

import { hideModal } from '../actions/hide_modal';

import { DEVICE_APP_STATUS } from '../utils/device_utils';

import { SYSTEM_SETTINGS } from '../utils/structures';

import { INIT_IPC } from '../actions/hid_action';
import { UPDATE_READY, UPDATE_IN_PROGRESS, AFTER_UPDATE_ACTION, UPDATE_COMPLETED } from '../utils/device_utils'
import { UPDATE_NOT_STARTED,
         SET_UP_TRANSFER,
         START_TRANSFER,
         PACKET_SEND,
         BLOCK_VALIDATE,
         SECTOR_WRITE,
         TRANSFER_COMPLETED,
         WAITING_FOR_APP_UPDATE,
         OBD_NOT_STARTED, 
         OBD_IN_PROGRESS } from '../utils/device_utils'

const {ipcRenderer} = require('electron');

var MdImportantDevices = require('react-icons/lib/md/important-devices');

class Device extends Component {
  constructor(props){
    super(props);
    var init_system_settings = JSON.parse(JSON.stringify(SYSTEM_SETTINGS));
    this.state = {device_data: [], mfg_id: '', serial_number: '', system_settings: init_system_settings, device_update_status: ''}

    this.readDeviceSettings = this.readDeviceSettings.bind(this);
    this.checkDevice = this.checkDevice.bind(this);
    this.saveDeviceSettings = this.saveDeviceSettings.bind(this);
    this.installSoftware = this.installSoftware.bind(this);
    this.saveDeviceOSDSettings = this.saveDeviceOSDSettings.bind(this);

    this.requestSBL = this.requestSBL.bind(this);
    this.clearSBL = this.clearSBL.bind(this);
    this.displayModal = this.displayModal.bind(this);

    this.onHidePane = this.onHidePane.bind(this);

    this.renderOBDFeatures = this.renderOBDFeatures.bind(this);

    this.submitOBD = this.submitOBD.bind(this);

    this.closeModal = this.closeModal.bind(this);
  }

  renderOBDFeatures(){
    if(this.props.obd_features.obd_enabled){
      return (
          <div id="obd-pane">
            <OBDFeatures 
              OBDSettings = {this.props.obd_features}
              onSubmitOBD = {this.submitOBD}
            />
          </div> 
      ); 
    }else{
      return (
          <div id="obd-pane">
            Programming Features not available
          </div>  
      );     
    }
  }

  displayModal(device_status, obd_status, update_status){
    console.log("displayModal", this.props.modal_state);
    if(update_status.update_progress_status != UPDATE_NOT_STARTED && !this.props.modal_state.hide){
      console.log("Inside modal function", update_status.update_progress_status);
      return (
        <Modal
          onCloseModal={this.closeModal}
        >
          <UpdateProgress
            progress_status={update_status}
          />
        </Modal>
      );
    }
    if(obd_status != OBD_NOT_STARTED && !this.props.modal_state.hide){
      console.log("Inside modal function obd_status", obd_status);
      return (
        <Modal
          onCloseModal={this.closeModal}
        >
          <ProgrammingProgress />
        </Modal>
      );
    }
  }

  closeModal(){
    console.log("close modal function");
    this.props.hideModal(true);
  }

  componentWillMount(){
    this.props.hidAction(INIT_IPC);
  }

  componentDidMount(){
    $('.menu .item')
      .tab();
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

  submitOBD(obd){
    console.log("in device");
    console.log(obd);
    this.props.startOBDProgramming();
  }

  installSoftware(){
    var sw_id = this.props.software_search.sw_id;
    this.props.loadFTPFile(sw_id, this.props.device_status.app_status);
  }

  readDeviceSettings(){
    ipcRenderer.send('device-read-settings', 0x1A);
  }

  checkDevice(){
    ipcRenderer.send('check-device');
  }

  saveDeviceSettings(settings){
    let device_data = this.props.device_data;
    this.props.saveDeviceSettings(device_data, settings);
  }

  saveDeviceOSDSettings(settings){
    console.log(settings)
    this.props.saveDeviceOSDSettings(settings);
  }

  onHidePane(panelname1, panelname2){
    //console.log(panelname);
    let first = document.getElementById(panelname1);
    //console.log(x.style.display);
    if (first.style.display == 'block') {
        first.style.display = 'none';
    } else {
        first.style.display = 'block';
    }
    let second = document.getElementById(panelname2);
    second.style.display = 'none';
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
          <DeviceInfo
            deviceInfo = {this.props.device_db_data}
            deviceStatus = {this.props.device_status}
            onDeviceSearch={this.checkDevice}
          />
          <button onClick={this.props.getOSDSettings} className="mui-btn mui-btn--primary">Read OSD</button>
        </div>
        <ul className="mui-tabs__bar">
          <li className="mui--is-active"><a data-mui-toggle="tab" data-mui-controls="pane-default-1">Device Settings</a></li>
          <span className="mui--divider-right">&nbsp;</span>
          <li><a data-mui-toggle="tab" data-mui-controls="pane-default-2">Software Update</a></li>
          <span className="mui--divider-right">&nbsp;</span>
          <li><a data-mui-toggle="tab" data-mui-controls="pane-default-3">Features Activation</a></li>
        </ul>
        <div className="mui-tabs__pane mui--is-active" id="pane-default-1">
          <div className="mui-appbar">
            <table width="100%">
              <tr>
                <td className="mui--appbar-height mui--text-left nv-padding">Camera Configuration</td>
                <td className="mui--appbar-height mui--text-right"><a className="sidedrawer-toggle" onClick={()=>this.onHidePane('settings-pane', 'osd-pane')}>☰</a></td>
              </tr>
            </table>
          </div>
          <div id="settings-pane">
            <DeviceSettings
              systemSettings = {this.props.system_settings}
              onDeviceSettingsSave={this.saveDeviceSettings}
            />
          </div>
          <div className="mui-divider">
            &nbsp;&nbsp;
          </div>
          <div className="mui-appbar">
            <table width="100%">
              <tr>
                <td className="mui--appbar-height mui--text-left nv-padding">OSD Configuration</td>
                <td className="mui--appbar-height mui--text-right"><a className="sidedrawer-toggle" onClick={()=>this.onHidePane('osd-pane','settings-pane')}>☰</a></td>
              </tr>
            </table>
          </div>
          <div id="osd-pane">
            <OSDSettings
              osdSettings = {this.props.osd_settings}
              onOSDSettingsSave={this.saveDeviceOSDSettings}
            />
          </div>
        </div>
        <div className="mui-tabs__pane" id="pane-default-2">
          <SoftwareSearch
            onInstallClick={this.installSoftware}
          />
        </div>
        <div className="mui-tabs__pane" id="pane-default-3">
          { this.renderOBDFeatures() }
        </div>
        {this.displayModal(this.props.device_status.app_status, this.props.device_status.obd_status, this.props.software_update)}
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
           software_search: state.software_search,
           obd_features: state.obd_features,
           osd_settings: state.osd_settings,
           modal_state: state.modal_state
         };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ hidAction, saveDeviceSettings, updateDeviceVichecleInfo, requestSBL, loadFTPFile, sendSoftwareUpdateData, updateDeviceDBData, startOBDProgramming, hideModal, getOSDSettings, saveDeviceOSDSettings }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Device);
