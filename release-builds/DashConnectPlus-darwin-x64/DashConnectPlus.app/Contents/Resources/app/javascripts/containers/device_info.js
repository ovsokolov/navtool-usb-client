import React, { Component} from 'react';


import { NO_DEVICE_STATUS, DEVICE_APP_STATUS, DEVICE_SBL_STATUS} from '../utils/device_utils';

var MdImportantDevices = require('react-icons/lib/md/important-devices');

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
          <div className="mui-col-xs-12 mui--align-middle  mui--text-center">
            {deviceStatus}
          </div>
      );
  }

  renderDeviceIcon(){
      var iconColor = "white";
      if(this.props.deviceStatus.app_status == DEVICE_APP_STATUS){
        iconColor = "green";
      }else if (this.props.deviceStatus.app_status == DEVICE_SBL_STATUS) {
        iconColor = "red";
      }
      return (
          <div className="mui-col-xs-2">
              <div>&nbsp;</div>
              <div className="mui-row">
                <div className="mui-col-xs-1">&nbsp;</div>
                <div className="mui-col-xs-4 mui--align-middle  mui--text-left">
                  <MdImportantDevices color={iconColor} size={60} />
                </div>
              </div>
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
        <div className="mui-col-xs-10 mui--align-middle">
            <div className="mui-row">&nbsp;</div>
            <div className="mui-row">
              <div className="mui-col-xs-4 mui--align-middle">
                <button onClick={this.props.onDeviceSearch} className="mui-btn mui-btn--primary">Find Device</button>
              </div>
            </div>
        </div>
    );
  }
  renderDeviceInfo(){
      return(
        <div className="mui-col-xs-10">
          <div className="mui-row">
            <div className="mui-col-xs-4">
              <div className="mui--text-dark mui--text-left mui--text-body2">
                Device ID:
              </div>
            </div>
            <div className="mui-col-xs-8">
              <div className="mui--text-dark mui--text-left mui--text-body2">
                {this.props.deviceInfo.mcu_serial}
              </div>
            </div>
          </div>
          <div className="mui-row">
            <div className="mui-col-xs-4">
              <div className="mui--text-dark mui--text-left mui--text-body2">
                Device Model:
              </div>
            </div>
            <div className="mui-col-xs-8">
              <div className="mui--text-dark mui--text-left mui--text-body2">
                {this.props.deviceInfo.mfg_id}
              </div>
            </div>
          </div>
          <div className="mui-row">
            <div className="mui-col-xs-4">
              <div className="mui--text-dark mui--text-left mui--text-body2">
                Vihecle Make:
              </div>
            </div>
            <div className="mui-col-xs-8">
              <div className="mui--text-dark mui--text-left mui--text-body2">
                {this.props.deviceInfo.vehicle_make}
              </div>
            </div>
          </div>
          <div className="mui-row">
            <div className="mui-col-xs-4">
              <div className="mui--text-dark mui--text-left mui--text-body2">
                Vihecle Model:
              </div>
            </div>
            <div className="mui-col-xs-8">
              <div className="mui--text-dark mui--text-left mui--text-body2">
                {this.props.deviceInfo.vehicle_model}
              </div>
            </div>
          </div>
        </div>
      );
  }

  render(){
    return (
      <div>
        <div className="mui-row">
          { this.renderDeviceStatus() }
        </div>
        <div className="mui-row">
          { this.renderDeviceIcon() }
          { this.renderDevice() }
        </div>
      </div>
    );
  }
}
