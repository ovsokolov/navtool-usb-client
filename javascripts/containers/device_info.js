import React, { Component} from 'react';


import { NO_DEVICE_STATUS, DEVICE_APP_STATUS, DEVICE_SBL_STATUS} from '../utils/device_utils';

var MdImportantDevices = require('react-icons/lib/md/important-devices');
var iconColor = '';

export default class DeviceInfo extends Component {

  constructor(props){
    super(props);
    this.renderDeviceStatus = this.renderDeviceStatus.bind(this);
    this.renderDeviceIcon = this.renderDeviceIcon.bind(this);
    this.renderDeviceInfo = this.renderDeviceInfo.bind(this);
    this.renderDevice = this.renderDevice.bind(this);
    this.renderSearchDevice = this.renderSearchDevice.bind(this);
  }

  renderDeviceStatus(){
      var deviceStatus = "Device Not Found";
      if(this.props.deviceStatus.app_status == DEVICE_APP_STATUS){
        deviceStatus = "Application Mode";
      }else if (this.props.deviceStatus.app_status == DEVICE_SBL_STATUS) {
        deviceStatus = "Bootloader Mode";
      }
      return (
          <div className="row">
            {deviceStatus}
          </div>
      );
  }

  renderDeviceIcon(){
      iconColor = "white";
      if(this.props.deviceStatus.app_status == DEVICE_APP_STATUS){
        iconColor = "blue";
      }else if (this.props.deviceStatus.app_status == DEVICE_SBL_STATUS) {
        iconColor = "red";
      }
      return (
          <div className="three wide column">
              <i className={`huge ${iconColor} desktop icon`}></i>
              { this.renderDeviceStatus() }
          </div>
      );
  }
  renderDevice(){
    if(this.props.deviceStatus.app_status == NO_DEVICE_STATUS){
      return this.renderSearchDevice();
    }else{
      return this.renderDeviceInfo();
    }
  }

  renderSearchDevice(){
    return(
        <div className="thirteen wide column">
            <button onClick={this.props.onDeviceSearch} className="ui primary button">Find Device</button>
        </div>
    );
  }
  renderDeviceInfo(){
      return(
        <div className="thirteen wide column left aligned ">
            <div className="row">
                <div className={`ui ${iconColor} horizontal label`}>Device ID:</div>{this.props.deviceInfo.mcu_serial}
                <br /><br/>
            </div>
            <div className="row">
                <div className={`ui ${iconColor} horizontal label`}>Device Model:</div>{this.props.deviceInfo.mfg_id}
                <br /><br/>
            </div>
            <div className="row">
                <div className={`ui ${iconColor} horizontal label`}>Vihecle Make:</div>{this.props.deviceInfo.vehicle_make}
            </div>
            <div>&nbsp;</div>
            <div className="row">
                <div className={`ui ${iconColor} horizontal label`}>Vihecle Model:</div>{this.props.deviceInfo.vehicle_model}
            </div>
        </div>
      );
  }

  render(){
    return (
      <div>
        <div className="ui center aligned page grid">
            <div className="row"/>
            <div className="sixteen column row">
              { this.renderDeviceIcon() }
              { this.renderDevice() }
            </div>
        </div>
      </div>
    );
  }
}
