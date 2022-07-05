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
import { getOSDSettings, initDeviceSettings, updateImageFlag, completeUpdateImage} from '../actions/hid_action';
import { getSerialNumber } from '../utils/device_utils';
import { runBootloader, runApplication, loadImages } from '../actions/get_bootloader';

import { loadFTPFile } from '../actions/ftp_action';
import { updateDeviceDBData, updateDeviceOBDData, checkDeviceStartSector,assembleInterface } from '../actions/get_device_data';

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

import { DEVICE_OBD_SUCCESS, DEVICE_OBD_FAILED, IMAGE_FLASH_SUCCESS, IMAGE_FLASH_ERROR  } from '../actions/hid_action';

const {ipcRenderer} = require('electron');
const shell = require('electron').shell;
const dialog = require('electron').remote.dialog 

class Device extends Component {
  constructor(props){
    super(props);
    var init_system_settings = JSON.parse(JSON.stringify(SYSTEM_SETTINGS));
    this.state = {device_data: [], 
                  mfg_id: '', 
                  serial_number: '', 
                  system_settings: init_system_settings, 
                  device_update_status: '',
                  interfaces_list: []}

    this.renderDeviceSettings = this.renderDeviceSettings.bind(this);

    this.readDeviceSettings = this.readDeviceSettings.bind(this);
    this.checkDevice = this.checkDevice.bind(this);
    this.saveDeviceSettings = this.saveDeviceSettings.bind(this);
    this.installSoftware = this.installSoftware.bind(this);
    this.installBootloader = this.installBootloader.bind(this);
    this.flashImage = this.flashImage.bind(this);
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

    this.startRemoteSupport = this.startRemoteSupport.bind(this);
    this.startIntercom=this.startIntercom.bind(this);

    this.setFilter = this.setFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.getFilterData = this.getFilterData.bind(this);
    this.clearFilterResult = this.clearFilterResult.bind(this);

    this.setTestEvent = this.setTestEvent.bind(this);

    this.selectTab = this.selectTab.bind(this);
    this.showErrorDialog = this.showErrorDialog.bind(this);

    this.printLabel = this.printLabel.bind(this);
    this.assembleProduct = this.assembleProduct.bind(this);

    ipcRenderer.on('interfaces-list',(event, data) => {
      console.log(data);
      this.setState({interfaces_list: data});
    });      

  }

  showErrorDialog(msg){
    const options = {
        type: 'error',
        title: 'Error'
    }; 
    options.message = msg;
    dialog.showMessageBox(null, options);   
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

  closeModal(){
    //console.log("close modal function");
    this.props.hideModal(true);
  }

  componentWillMount(){
    this.props.hidAction(INIT_IPC);
  }

  componentDidMount(){
    ipcRenderer.send('load-interfaces-list');   
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

    if(nextProps.device_status.update_status == IMAGE_FLASH_ERROR){
      console.log("Image Flush Error");
      this.props.completeUpdateImage();
      this.showErrorDialog("Error Flashing Image");
    }  
    if(nextProps.modal_state.show_message == true && nextProps.message != ''){
      console.log("Show Message");
      this.props.hideModal(true);
      this.showErrorDialog(nextProps.message);      
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

  installBootloader(btl_id){
    console.log(this.props.device_db_data);
    if(btl_id == ''){
      this.showErrorDialog("Please scan Device ID");
    //}else if(this.props.device_db_data.image_flash == 0){
    //  this.showErrorDialog("Please Flash Images First");
    }else{
      this.props.runBootloader(btl_id);   
    }         
  }

  installApplication(mfg_id){
    console.log(this.props.device_db_data);
    if(mfg_id == ''){
      this.showErrorDialog("Please scan Device ID");
    //}else if(this.props.device_db_data.image_flash == 0){
    //  this.showErrorDialog("Please Flash Images First");
    }else{
      this.props.runApplication(mfg_id);  
    }
  }

  flashImage(){
    if(this.props.device_db_data.mfg_id != 'UMBTLR'){
      this.showErrorDialog("Please Flash Bootloader First");
    }else{
      this.props.loadImages(this.props.device_db_data.mcu_serial); 
    }      
  }

  registerDevice(){ 
    if(this.props.device_db_data.mfg_id != 'UMBTLR'){
      this.showErrorDialog("Please Flash Bootloader First");
    }else{
      let mcu_serial = this.props.device_db_data.mcu_serial;
      this.props.updateImageFlag(mcu_serial); 
    }    
  }

  readDeviceSettings(){
    ipcRenderer.send('device-read-settings', 0x1A);
  }

  checkDevice(){
    ipcRenderer.send('check-device');
  }

  printLabel(){    
    let carplayModule = this.props.system_settings.CarPlayModule;
    let mfgId = this.props.device_status.device_mfg_id;
    let deviceId = this.props.device_db_data.device_id;

    mfgId = 'NBT-' + mfgId; 

    if(carplayModule){
      mfgId = mfgId + '-CP';
    }
    console.log(mfgId, deviceId);
    ipcRenderer.send('print-label', {mfgId, deviceId});
  }

  assembleProduct(){
    let carplayModule = this.props.system_settings.CarPlayModule;
    let mfgId = this.props.device_status.device_mfg_id;
    let deviceId = this.props.device_db_data.device_id;
    //assembly part
    var result = this.state.interfaces_list.filter(obj => {
      return obj.firmware == mfgId
    });
    let assemblyKit = '';
    if(carplayModule){
      assemblyKit = result[0].data[0].cpkit;
    }else{
      assemblyKit = result[0].data[0].kit;
    } 
    console.log(assemblyKit);  
    this.props.assembleInterface(assemblyKit, deviceId);  
    //assembly part    
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
    console.log('can Msg setFilter');
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
            onSelectTab={this.selectTab}
          />
        </div>
        <div className="ui top attached tabular menu">
          <a className="active item" data-tab="first">Keil Flash</a>
        </div>
        <div className="ui bottom attached active tab segment" data-tab="first">
          <BootloaderSearch
            deviceInfo = {this.props.device_db_data}
            onInstallClick={this.installBootloader}
            onApplicationInstallClick={this.installApplication}
            onFlashImage={this.flashImage}
            onRegisterDevice={this.registerDevice}
            onPrintLabel={this.printLabel}
            onAssembleProduct={this.assembleProduct}
          />
        </div>
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
  return bindActionCreators({ hidAction, saveDeviceSettings, updateDeviceVichecleInfo, loadFTPFile, sendSoftwareUpdateData, updateDeviceDBData, updateDeviceOBDData, startOBDProgramming, hideModal, showDownloadTeamViewer, getOSDSettings, saveDeviceOSDSettings, rebootAfterUpdate, softwareUpdateError, checkDeviceStartSector, requestSBL, clearSBL, setCanFilter, clearCanFilter, getCanFilterData, clearCanFilterResult, setTestEvent,runBootloader, runApplication, initDeviceSettings, updateImageFlag, loadImages, completeUpdateImage, assembleInterface  }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Device);
