import React, { Component} from 'react';
import SearchMake from '../containers/search_make'
import CarMakeList from '../containers/make_list'
import DeviceSettings from '../containers/device_settings'

import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchDeviceDBData } from '../actions/get_device_data';
import { hidAction } from '../actions/hid_action';

import { SYSTEM_SETTINGS } from '../utils/structures';
import { INIT_IPC } from '../actions/hid_action';

const {ipcRenderer} = require('electron');

class Device extends Component {
  constructor(props){
    super(props);
    var init_system_settings = JSON.parse(JSON.stringify(SYSTEM_SETTINGS));
    this.state = {device_data: [], mfg_id: '', serial_number: '', system_settings: init_system_settings}
    console.log(this.state);
    this.handleDeviceArrived = this.handleDeviceArrived.bind(this);

    this.readDeviceSettings = this.readDeviceSettings.bind(this);
    this.readDeviceSBLStatus = this.readDeviceSBLStatus.bind(this);

    this.checkDevice = this.checkDevice.bind(this);

    this.handleDeviceSBLStatus = this.handleDeviceSBLStatus.bind(this);
    this.handleDeviceDataResult = this.handleDeviceDataResult.bind(this);

    ipcRenderer.on('device-arrived',this.handleDeviceArrived);
    ipcRenderer.on('device-sbl-status',this.handleDeviceSBLStatus);
    ipcRenderer.on('device-data-result',this.handleDeviceDataResult);

    this.saveDeviceSettings = this.saveDeviceSettings.bind(this);
  }

  componentWillMount(){
    //this.props.hidAction(INIT_IPC);
  }

  handleDeviceArrived(event, data){
      console.log('Device Arrived Handling....');
      console.log(data);
      this.readDeviceSBLStatus()
  }

  handleDeviceSBLStatus(event, data){
      console.log('SBL Status handling');
      console.log(data);
      console.log('XXXXXXXXXXXXX');
      let msg = data["msg"]
      if(msg[1] == 0){
        console.log("SBL");
      }else{
        console.log("APP");
        this.readDeviceSettings()
      }
  }

  handleDeviceDataResult(event, data){
      console.log('Handle Device settings');
      console.log(data);
      let msg = data["msg"];
      this.setState({device_data: msg});
      console.log("in device 1");
      console.log(this.state);
      console.log("in device 2");
      let action = msg[0];
      let usbResult = msg[1];
      let serial_number = ""
      let hexStringFrmt = "00"
      let binaryStringFrmt = "00000000"
      let softwareId = ""; //[19][18]
      let softwareBuild = ""; //[20]
      let bareNum;
      console.log("action:", action)
      switch(action) {
        case 0x1A:
          //build serial number
          for (var i = 0; i < 16; i++) {
            if (i % 4 == 0 && i > 0) {
              serial_number += "-";
            }
            bareNum = msg[2+i].toString(16);
            serial_number += hexStringFrmt.substring((bareNum).length, 2) + bareNum;
          }
          serial_number = serial_number.toUpperCase();
          this.setState({serial_number});
          console.log(this.state);
          console.log("Serial Number",serial_number);
          //build software id (reverse 2 bytes)
          for(var i=0; i < 2; i++){
            bareNum = msg[19-i].toString(10);
            softwareId += hexStringFrmt.substring((bareNum).length, 2) + bareNum;

          }
          console.log("Software Id",softwareId);
          //build siftwareBuild
          bareNum = msg[20].toString(10);
          softwareBuild += hexStringFrmt.substring((bareNum).length, 2) + bareNum;
          console.log("Software Build",softwareBuild);

          //get system settings
          let system_settings = JSON.parse(JSON.stringify(SYSTEM_SETTINGS));
          console.log("System Settings Byte 1", binaryStringFrmt.substring((msg[21].toString(2)).length, 8) + msg[21].toString(2));
          let byte_1 = binaryStringFrmt.substring((msg[21].toString(2)).length, 8) + msg[21].toString(2);
          console.log("System Settings Byte 2", binaryStringFrmt.substring((msg[22].toString(2)).length, 8) + msg[22].toString(2));
          let byte_2 = binaryStringFrmt.substring((msg[22].toString(2)).length, 8) + msg[22].toString(2);
          console.log("System Settings Byte 3", binaryStringFrmt.substring((msg[23].toString(2)).length, 8) + msg[23].toString(2));
          let byte_3 = binaryStringFrmt.substring((msg[23].toString(2)).length, 8) + msg[23].toString(2);
          console.log("System Settings Byte 4", binaryStringFrmt.substring((msg[24].toString(2)).length, 8) + msg[24].toString(2));
          let byte_4 = binaryStringFrmt.substring((msg[24].toString(2)).length, 8) + msg[24].toString(2);


          //byte 1
          system_settings["SoundSupported"] = byte_1.substring(7,8);
          system_settings["ObdSupported"] = byte_1.substring(6,7);
          system_settings["ConfigSupported"] = byte_1.substring(5,6);
          system_settings["RearCameraSupported"] = byte_1.substring(4,5);
          system_settings["FrontCameraSupported"] = byte_1.substring(3,4);
          system_settings["LeftCameraSupported"] = byte_1.substring(2,3);
          system_settings["RightCameraSupported"] = byte_1.substring(1,2);
          system_settings["ReservedSupported"] = byte_1.substring(0,1);
          //byte_2
          system_settings["SoundEnabled"] = byte_2.substring(7,8);
          system_settings["RearCameraEnabled"] = byte_2.substring(6,7);
          system_settings["FrontCameraEnabled"] = byte_2.substring(5,6);
          system_settings["LeftCameraEnabled"] = byte_2.substring(4,5);
          system_settings["RightCameraEnabled"] = byte_2.substring(3,4);
          system_settings["FactoryRearCamera"] = byte_2.substring(2,3);
          system_settings["FactoryFrontCamera"] = byte_2.substring(1,2);
          system_settings["FactoryLeftCamera"] = byte_2.substring(0,1);
          //byte_3;
          system_settings["HDMIEnabled"] = byte_3.substring(7,8);
          system_settings["RGBEnabled"] = byte_3.substring(6,7);
          system_settings["Input1Enabled"] = byte_3.substring(5,6);
          system_settings["Input2Enabled"] = byte_3.substring(4,5);
          system_settings["Input3Enabled"] = byte_3.substring(3,4);
          system_settings["Input4Enabled"] = byte_3.substring(2,3);
          system_settings["NotUsed"] = byte_3.substring(0,2);
          //byte_4;
          system_settings["FactoryRightCamera"] = byte_4.substring(7,8);
          system_settings["FrontCameraMode"] = byte_4.substring(5,7);
          system_settings["SideCameraMode"] = byte_4.substring(2,5);
          system_settings["ResrvedBits"] = byte_4.substring(0,2);
          this.setState({system_settings});
          console.log(this.state);
          console.log(SYSTEM_SETTINGS);
          console.log("ZZZZZZZZZZZZZZZZ")
          var vihicleMake = "";
          var vihicleModel = "";
          for (var i = 0; i < msg[57]; i++) {
            vihicleMake += String.fromCharCode(msg[29+i]);
          }
          for (var i = 0; i < msg[58]; i++) {
            vihicleModel += String.fromCharCode(msg[43+i]);
          }
          console.log(vihicleMake);
          console.log(vihicleModel);
          for (var i = 0; i < 14; i++) {
            console.log(vihicleModel.charCodeAt(i));
          }
          this.props.fetchDeviceDBData(serial_number);
          break;
        case 0x1B:
          console.log("!!!!!!!!!!!!!!data updateds");
          break;
      }
  }

  readDeviceSettings(){
    console.log('Read Device System Data');
    ipcRenderer.send('device-read-settings', 0x1A);

  }

  readDeviceSBLStatus(){
    console.log('Read SBL Status');
    ipcRenderer.send('device-sbl-status', 0x01);
  }

  checkDevice(){
    console.log('Checking device');
    ipcRenderer.send('check-device');
  }

  saveDeviceSettings(settings){
    console.log(settings);
    let device_data = this.state.device_data;
    console.log(device_data);
    //byte 1
    let byte1 = "";
    byte1 = settings["SoundSupported"] + byte1;
    byte1 = settings["ObdSupported"] + byte1;
    byte1 = settings["ConfigSupported"] + byte1;
    byte1 = settings["RearCameraSupported"] + byte1;
    byte1 = settings["FrontCameraSupported"] + byte1;
    byte1 = settings["LeftCameraSupported"] + byte1;
    byte1 = settings["RightCameraSupported"] + byte1;
    byte1 = settings["ReservedSupported"] + byte1;
    console.log(byte1);
    //byte 2
    let byte2 = "";
    byte2 = settings["SoundEnabled"] + byte2;
    byte2 = settings["RearCameraEnabled"] + byte2;
    byte2 = settings["FrontCameraEnabled"] + byte2;
    byte2 = settings["LeftCameraEnabled"] + byte2;
    byte2 = settings["RightCameraEnabled"] + byte2;
    byte2 = settings["FactoryRearCamera"] + byte2;
    byte2 = settings["FactoryFrontCamera"] + byte2;
    byte2 = settings["FactoryLeftCamera"] + byte2;
    console.log(byte2);
    //byte_3;
    let byte3 = "";
    byte3 = settings["HDMIEnabled"] + byte3;
    byte3 = settings["RGBEnabled"] + byte3;
    byte3 = settings["Input1Enabled"] + byte3;
    byte3 = settings["Input2Enabled"] + byte3;
    byte3 = settings["Input3Enabled"] + byte3;
    byte3 = settings["Input4Enabled"] + byte3;
    byte3 = settings["NotUsed"] + byte3;
    console.log(byte3);
    //byte_4;
    let byte4 = "";
    byte4 = settings["FactoryRightCamera"] + byte4;
    byte4 = settings["FrontCameraMode"] + byte4;
    byte4 = settings["SideCameraMode"] + byte4;
    byte4 = settings["ResrvedBits"] + byte4;
    console.log(byte4);

    device_data[21] = parseInt(byte1,2);
    device_data[22] = parseInt(byte2,2);
    device_data[23] = parseInt(byte3,2);
    device_data[24] = parseInt(byte4,2);
    let new_data = [];
    new_data[0] = 0x00;
    new_data[1] = 0x1B;
    for(var i = 0; i < 43; i++){
      new_data[2 + i] =   device_data[21 + i];
    }
    console.log(new_data);
    console.log(new_data.length);
    this.setState({system_settings: settings});
    ipcRenderer.send('device-write_data', new_data);

  }

  requestSBL(){
    console.log('Request SBL');
    let arg = [];
    arg[0] = 0x00;
    arg[1] = 0x80;
    arg[2] = 0x00;
    arg[3] = 0x00;
    arg[4] = 0x00;
    ipcRenderer.send('device-sbl', arg);
    //ipcRenderer.send('device-sbl', 0x80);
  }

  clearSBL(){
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
          Device ID: {this.state.serial_number}
          <br/>
          Device Model: {this.props.device_db_data.mfg_id}
          <br/>
          Vihecle Make : {this.props.device_db_data.vehicle_make}
          <br/>
          Vihecle Model : {this.props.device_db_data.vehicle_model}
          <br />
          <button onClick={this.requestSBL} className="mui-btn mui-btn--danger">Request SBL</button>
          <button onClick={this.clearSBL} className="mui-btn mui-btn--primary">Clear SBL</button>
          <button onClick={this.readDeviceSettings} className="mui-btn mui-btn--primary">Read Setting</button>
          <button onClick={this.checkDevice} className="mui-btn mui-btn--primary">Find Device</button>
        </div>
        <ul className="mui-tabs__bar">
          <li className="mui--is-active"><a data-mui-toggle="tab" data-mui-controls="pane-default-1">Device Data</a></li>
          <li><a data-mui-toggle="tab" data-mui-controls="pane-default-2">Software Update</a></li>
          <li><a data-mui-toggle="tab" data-mui-controls="pane-default-3">Tab-3</a></li>
        </ul>
        <div className="mui-tabs__pane mui--is-active" id="pane-default-1">
          <DeviceSettings
            systemSettings = {this.state.system_settings}
            onDeviceSettingsSave={this.saveDeviceSettings}
          />
        </div>
        <div className="mui-tabs__pane" id="pane-default-2">Pane-2
          <SearchMake />
          <CarMakeList />
        </div>
        <div className="mui-tabs__pane" id="pane-default-3">Pane-3</div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return { device_db_data: state.device_db_data };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({fetchDeviceDBData, hidAction}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Device);
