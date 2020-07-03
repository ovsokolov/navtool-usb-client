import React, { Component} from 'react';
import SoftwareSearch from '../containers/software_search'

import BootloaderSearch from '../containers/bootloader_search'

import Diagnostic from '../containers/diagnostic'
import EventTest from '../containers/event_test'
import DeviceSettings from '../containers/device_settings'
import DeviceInfo from  '../containers/device_info'
import OBDFeatures from '../containers/obd_features'
import OSDSettings from '../containers/osd_settings'
import Modal from '../components/modal'
import UpdateProgress from '../containers/update_progress'
import ProgrammingProgress from '../containers/programming_progress'
import ModalMessage from '../containers/modal_messages'

import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';


import { saveDeviceSettings, updateDeviceVichecleInfo, sendSoftwareUpdateData, saveDeviceOSDSettings, rebootAfterUpdate, softwareUpdateError, setCanFilter, clearCanFilter, getCanFilterData, clearCanFilterResult, setTestEvent} from'../actions/hid_action';

import { hidAction, requestSBL, clearSBL } from '../actions/hid_action';
import { startOBDProgramming } from '../actions/hid_action';
import { getOSDSettings } from '../actions/hid_action';
import { getSerialNumber } from '../utils/device_utils';
import { runBootloader } from '../actions/get_bootloader';

import { loadFTPFile } from '../actions/ftp_action';
import { updateDeviceDBData, updateDeviceOBDData, checkDeviceStartSector } from '../actions/get_device_data';

import { hideModal, showDownloadTeamViewer } from '../actions/hide_modal';

import { DEVICE_APP_STATUS } from '../utils/device_utils';

import { SYSTEM_SETTINGS } from '../utils/structures';

import { INIT_IPC } from '../actions/hid_action';
import { UPDATE_READY, UPDATE_IN_PROGRESS, AFTER_UPDATE_ACTION, UPDATE_COMPLETED } from '../utils/device_utils'
import { UPDATE_NOT_STARTED,
         WAITING_START_SECTOR,
         SET_UP_TRANSFER,
         START_TRANSFER,
         PACKET_SEND,
         BLOCK_VALIDATE,
         SECTOR_WRITE,
         TRANSFER_COMPLETED,
         WAITING_FOR_APP_UPDATE,
         OBD_NOT_STARTED, 
         OBD_IN_PROGRESS,
         UPDATE_ERROR,
         DISPLAY_UPDATE_ERROR } from '../utils/device_utils'

import { DEVICE_OBD_SUCCESS, DEVICE_OBD_FAILED } from '../actions/hid_action';

const {ipcRenderer} = require('electron');
const shell = require('electron').shell;

class Device extends Component {
  constructor(props){
    super(props);
    var init_system_settings = JSON.parse(JSON.stringify(SYSTEM_SETTINGS));
    this.state = {device_data: [], mfg_id: '', serial_number: '', system_settings: init_system_settings, device_update_status: ''}

    this.renderDeviceSettings = this.renderDeviceSettings.bind(this);

    this.readDeviceSettings = this.readDeviceSettings.bind(this);
    this.checkDevice = this.checkDevice.bind(this);
    this.saveDeviceSettings = this.saveDeviceSettings.bind(this);
    this.installSoftware = this.installSoftware.bind(this);
    this.installBootloader = this.installBootloader.bind(this);
    this.installApplication = this.installApplication.bind(this);
    this.registerDevice = this.registerDevice.bind(this);
    this.saveDeviceOSDSettings = this.saveDeviceOSDSettings.bind(this);
    this.renderOSDSettings = this.renderOSDSettings.bind(this);

    this.requestSBL = this.requestSBL.bind(this);
    this.clearSBL = this.clearSBL.bind(this);
    //this.onHidePane = this.onHidePane.bind(this);

    this.renderOBDFeatures = this.renderOBDFeatures.bind(this);
    this.submitOBD = this.submitOBD.bind(this);

    this.closeModal = this.closeModal.bind(this);
    this.displayModal = this.displayModal.bind(this);

    this.startRemoteSupport = this.startRemoteSupport.bind(this);
    this.startIntercom=this.startIntercom.bind(this);

    this.setFilter = this.setFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.getFilterData = this.getFilterData.bind(this);
    this.clearFilterResult = this.clearFilterResult.bind(this);

    this.setTestEvent = this.setTestEvent.bind(this);

    this.selectTab = this.selectTab.bind(this);

  }



  renderDeviceSettings(){
    //console.log("Device Settings");
    //console.log(this.props.device_status);
    if(this.props.device_status.device_settings_type){
      return(
            <DeviceSettings
              systemSettings = {this.props.system_settings}
              settingsType = {this.props.device_status.device_settings_type}
              onDeviceSettingsSave={this.saveDeviceSettings}
            />
      );
    }else{
      return (
          <div id="settings-pane">
            Settings options not available for your vehicle
          </div>  
      );       
    }
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
            NOT APPLICABLE FOR THIS VEHICLE
          </div>  
      );     
    }
  }

  renderOSDSettings(){
    if(this.props.osd_settings.osd_enabled){
      return (
          <div id="osd-pane">
            <OSDSettings
              osdSettings = {this.props.osd_settings}
              onOSDSettingsSave={this.saveDeviceOSDSettings}
            />
          </div> 
      ); 
    }else{
      return (
          <div id="osd-pane">
            NOT APPLICABLE FOR THIS VEHICLE
          </div>  
      );     
    }
  }

  displayModal(device_status, obd_status, update_status, message){
    console.log("displayModal", this.props.modal_state, update_status, update_status.update_progress_status, this.props.modal_state.hide );
    if(update_status.update_progress_status != UPDATE_NOT_STARTED && !this.props.modal_state.hide){
      console.log("@@@@@@@Inside modal function", update_status.update_progress_status);
      return (
        <Modal
          showCloseButton={false}
          onCloseModal={this.closeModal}
        >
          <UpdateProgress
            progress_status={update_status}
          />
          <br/><br/>
          <ModalMessage 
            display_message='PROGRAMMING IN PROGRESS! DO NOT DISCONNECT DEVICE OR CLOSE PROGRAM!!'
            show_flush={true}/>
        </Modal>
      );
    }
    if(obd_status != OBD_NOT_STARTED && !this.props.modal_state.hide){
      //console.log("Inside modal function obd_status", obd_status);
      return (
        <Modal
          showCloseButton={false}
          onCloseModal={this.closeModal}
        >
          <ProgrammingProgress />
        </Modal>
      );
    }

    if(this.props.modal_state.show_message){
      console.log("ZzzzzzzzInside modal function message");
      return (
        <Modal
          showCloseButton={true}
          onCloseModal={this.closeModal}
        >
          <ModalMessage 
            display_message={message}
            show_flush={false}/>
        </Modal>
      );
    }
  }

  closeModal(){
    //console.log("close modal function");
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
    if(this.state.device_update_status == AFTER_UPDATE_ACTION){
      console.log('%%%%%%%%%%%%%%AFTER_UPDATE_ACTION%%%%%%%%%%%%%%%%%%%%');
      console.log(this.state.device_update_status);
      console.log(nextProps.software_update.update_progress_status);
      console.log(nextProps.device_status.app_status);
      console.log(this.props.device_status.update_status);
    }
    if(nextProps.software_update.update_progress_status == UPDATE_ERROR) {
      console.log('$$$$$$$$$$ERRRROR$$$$$$$$$$$$$$$$$');
      this.props.softwareUpdateError(UPDATE_ERROR);
    }
    if(nextProps.software_update.update_progress_status == DISPLAY_UPDATE_ERROR) {
      //console.log('$$$$$$$$$$DISPLAY ERRRROR$$$$$$$$$$$$$$$$$');
      this.props.softwareUpdateError(DISPLAY_UPDATE_ERROR);
    }
    if(nextProps.device_status.update_status == WAITING_START_SECTOR && this.state.device_update_status != WAITING_START_SECTOR){
      //console.log('$$$$$$$$$$ WAITING_START_SECTOR $$$$$$$$$$$$$$$$$');
      this.setState({device_update_status: WAITING_START_SECTOR});
      this.props.checkDeviceStartSector(this.props.device_status.device_mfg_id);
    }
    if(nextProps.device_status.update_status == UPDATE_READY && this.state.device_update_status != UPDATE_READY){
      this.setState({device_update_status: UPDATE_READY});
    }
    if(nextProps.device_status.app_status == DEVICE_APP_STATUS && this.state.device_update_status == AFTER_UPDATE_ACTION){
      console.log('&&&&&&&& IN AFTER UPDATE');
      console.log(nextProps.device_status.app_status);
      console.log(this.state.device_update_status);
      console.log(nextProps.device_data);
      console.log(this.props.device_data);
      if(nextProps.device_data != this.props.device_data){
        this.setState({device_update_status: UPDATE_COMPLETED});
        this.props.updateDeviceDBData(getSerialNumber(nextProps.device_data), nextProps.software_update);
        this.props.updateDeviceVichecleInfo(nextProps.device_data, this.props.software_update);
      }
    }
    if(this.state.device_update_status == UPDATE_IN_PROGRESS && nextProps.software_update.update_progress_status == START_TRANSFER){
      this.props.sendSoftwareUpdateData(START_TRANSFER, nextProps.software_update);
    }
    if(this.state.device_update_status == UPDATE_IN_PROGRESS && nextProps.software_update.update_progress_status == PACKET_SEND){
      ////console.log("Will start packet send", nextProps.software_update);
      this.props.sendSoftwareUpdateData(PACKET_SEND, nextProps.software_update);
    }
    if(this.state.device_update_status == UPDATE_IN_PROGRESS && nextProps.software_update.update_progress_status == BLOCK_VALIDATE){
      ////console.log("Will validate block", nextProps.software_update);
      this.props.sendSoftwareUpdateData(BLOCK_VALIDATE, nextProps.software_update);
    }
    if(this.state.device_update_status == UPDATE_IN_PROGRESS && nextProps.software_update.update_progress_status == SECTOR_WRITE){
      ////console.log("Will write sector", nextProps.software_update);
      this.props.sendSoftwareUpdateData(SECTOR_WRITE, nextProps.software_update);
    }
    if(this.state.device_update_status == UPDATE_IN_PROGRESS && nextProps.software_update.update_progress_status == TRANSFER_COMPLETED){
      ////console.log("Transfer completed", nextProps.software_update);
      this.setState({device_update_status: AFTER_UPDATE_ACTION});
      this.props.rebootAfterUpdate();
    }
    //console.log("########Current#######", this.props.device_status.obd_status)
    //console.log("########Next#######", nextProps.device_status.obd_status)
    if(this.props.device_status.obd_status == OBD_IN_PROGRESS && nextProps.device_status.obd_status != OBD_IN_PROGRESS){
      this.props.updateDeviceOBDData(getSerialNumber(nextProps.device_data),nextProps.device_status.obd_status);
    }
  }

  componentDidUpdate(){
    if(this.state.device_update_status == UPDATE_READY && this.props.software_update.update_progress_status == SET_UP_TRANSFER){
      //console.log("+++++++  SET_UP_TRANSFER  ++++++");
      this.setState({device_update_status: UPDATE_IN_PROGRESS});
      this.props.sendSoftwareUpdateData(SET_UP_TRANSFER,this.props.software_update);
    }
  }

  submitOBD(obd){
    //console.log("in device");
    //console.log(obd);
    this.props.startOBDProgramming(obd);
  }

  installSoftware(){
    var sw_id = this.props.software_search.sw_id;
    //console.log(this.props.software_search.sw_id.length);
    //console.log(this.props.software_search.sw_id);
    if(this.props.software_search.sw_id.length == 0) {
      alert("Please select software from the list");
    }else{
      this.props.loadFTPFile(sw_id, this.props.device_status.app_status);     
    }
  }

  installBootloader(){
    var btl_id = this.props.bootloader_search.id;
    console.log("installBootloader ", this.props.bootloader_search.id);
    console.log("installBootloader ", this.props.bootloader_search.path);
    console.log("installBootloader ", this.props.bootloader_search.target);
    if(this.props.bootloader_search.id.length == 0) {
      alert("Please select bootloader from the list");
    }else{
      this.props.runBootloader(this.props.bootloader_search);     
    }   
  }

  installApplication(){
    var app_id = this.props.application_software.id;
    console.log("installApplication ", this.props.application_software.id);
    console.log("installApplication ", this.props.application_software.path);
    console.log("installApplication ", this.props.application_software.target);
    if(this.props.application_software.id.length == 0) {
      alert("Device Not Conneted");
    }else{
      this.props.runBootloader(this.props.application_software);     
    } 
  }

  registerDevice(){ 
    console.log("IN registerDevice");
    console.log(this.props.device_status);
    console.log(this.props.device_db_data);
    console.log(device_data);
    console.log(this.props.system_settings);
    let device_data = this.props.device_data;
    let system_settings = this.props.system_settings;
    let osd_setting = this.props.osd_settings;
    let mfg_id = this.props.device_status.device_mfg_id;
    let sw_id = this.props.device_status.device_sw_id;
    let sw_build = this.props.device_status.device_sw_build;
    let mcu_serial = this.props.device_db_data.mcu_serial;
    this.props.initDeviceSettings(mfg_id, sw_id, sw_build, mcu_serial, device_data, system_settings, osd_setting);
  }

  readDeviceSettings(){
    ipcRenderer.send('device-read-settings', 0x1A);
  }

  checkDevice(){
    ipcRenderer.send('check-device');
  }

  startRemoteSupport(){
    console.log('download');
    //window.open('https://get.teamviewer.com/d7pbq93');
   //shell.openExternal('https://get.teamviewer.com/d7pbq93');
   ipcRenderer.send('start-support');  
   //this.props.showDownloadTeamViewer();  
  }

  startIntercom(){
    console.log('startIntercom');
    ipcRenderer.send('start-intercom');  
  }

  saveDeviceSettings(settings){
    let device_data = this.props.device_data;
    this.props.saveDeviceSettings(device_data, settings);
  }

  saveDeviceOSDSettings(settings){
    //console.log(settings)
    this.props.saveDeviceOSDSettings(settings);
  }

  selectTab(tabname){
    $(".tabular.menu .item").removeClass("active");
    $(".tab.segment").removeClass("active");
    $(this).addClass("active");
    var tab = $(this).attr("data-tab");
    $(".tab.segment").removeClass("active");
    //$(".tabular.menu[data-tab=\"" + tab + "\"]").addClass("active");
    $(".tabular.menu .item[data-tab=\"" + tabname  + "\"]").addClass("active");
    $(".tab.segment[data-tab=\"" + tabname  + "\"]").addClass("active");
  }

  requestSBL(){
    this.props.requestSBL();
  }

  clearSBL(){
    this.props.clearSBL();
  }

  setFilter(canMsg){
    console.log('canMsg setFilter');
    console.log(canMsg);
    this.props.setCanFilter(canMsg);
  }

  clearFilter(){
    this.props.clearCanFilter();    
  }

  getFilterData(){
   this.props.getCanFilterData();    
  }

  clearFilterResult(){
    this.props.clearCanFilterResult();
  }

  setTestEvent(eventType, inputType){
    console.log('@@@@@@@@@@@@@@@');
    console.log(eventType, inputType);
    this.props.setTestEvent(eventType, inputType);
  }
  /*
  <button className="ui compact red labeled icon button" onClick={this.props.requestSBL} >
    Request SBL
  </button>
  <button className="ui compact red labeled icon button" onClick={this.props.clearSBL} >
    Clear SBL
  </button>
  */
  render(){
    const x = function(){};

    return (
      <div>
        <div>
          <DeviceInfo
            deviceInfo = {this.props.device_db_data}
            deviceStatus = {this.props.device_status}
            onDeviceSearch={this.checkDevice}
            onStartRemoteSupport={this.startRemoteSupport}
            onStartIntercom={this.startIntercom}
            onSelectTab={this.selectTab}
          />
        </div>
        <div className="ui top attached tabular menu">
          <a className="active item" data-tab="first">Software Loader</a>
          <a className="item" data-tab="second">Camera Settings</a>
          <a className="item" data-tab="third">OSD Settings</a>
          <a className="item" data-tab="fourth">Features Activation</a>

          <a className="item" data-tab="fifth">Keil Flash</a>

          <a className="item" data-tab="sixth">Diagnostic</a>
          <a className="item" data-tab="seventh">Event Test</a>
        </div>
        <div className="ui bottom attached active tab segment" data-tab="first">
          <SoftwareSearch
            onInstallClick={this.installSoftware}
          />
        </div>
        <div className="ui bottom attached tab segment" data-tab="second">
            { this.renderDeviceSettings() }
        </div>
        <div className="ui bottom attached tab segment" data-tab="third">
            { this.renderOSDSettings() }
        </div>
        <div className="ui bottom attached tab segment" data-tab="fourth">
            { this.renderOBDFeatures() }
        </div>
        <div className="ui bottom attached tab segment" data-tab="fifth">
          <BootloaderSearch
            onInstallClick={this.installBootloader}
            onApplicationInstallClick={this.installApplication}
            onRegisterDevice={this.registerDevice}
          />
        </div>
        <div className="ui bottom attached tab segment" data-tab="sixth">
            <Diagnostic
              onSetFilter={this.setFilter}
              onClearFilter={this.clearFilter}
              onGetFilterData={this.getFilterData}
              onClearFilterResult={this.clearFilterResult}
            />
        </div>
        <div className="ui bottom attached tab segment" data-tab="seventh">
            <EventTest
              onSetTestEvent={this.setTestEvent}
            />
        </div>        
        {this.displayModal(this.props.device_status.app_status, this.props.device_status.obd_status, this.props.software_update, this.props.message)}
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
           bootloader_search: state.bootloader_search,
           application_software: state.application_software,
           obd_features: state.obd_features,
           osd_settings: state.osd_settings,
           modal_state: state.modal_state,
           message: state.message
         };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ hidAction, saveDeviceSettings, updateDeviceVichecleInfo, loadFTPFile, sendSoftwareUpdateData, updateDeviceDBData, updateDeviceOBDData, startOBDProgramming, hideModal, showDownloadTeamViewer, getOSDSettings, saveDeviceOSDSettings, rebootAfterUpdate, softwareUpdateError, checkDeviceStartSector, requestSBL, clearSBL, setCanFilter, clearCanFilter, getCanFilterData, clearCanFilterResult, setTestEvent }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Device);
