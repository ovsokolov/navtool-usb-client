import React, { Component} from 'react';


import { NO_DEVICE_STATUS, DEVICE_APP_STATUS, DEVICE_SBL_STATUS} from '../utils/device_utils';

var iconColor = '';

export default class DeviceInfo extends Component {

  constructor(props){
    super(props);
    this.renderDeviceStatus = this.renderDeviceStatus.bind(this);
    this.renderDeviceIcon = this.renderDeviceIcon.bind(this);
    this.renderDeviceInfo = this.renderDeviceInfo.bind(this);
    this.renderDevice = this.renderDevice.bind(this);
    this.renderSearchDevice = this.renderSearchDevice.bind(this);
    this.renderSoftwareVersion = this.renderSoftwareVersion.bind(this);
    this.renderMCU = this.renderMCU.bind(this);
    this.createCopyButton = this.createCopyButton.bind(this);
  }

  componentDidMount(){
    const clipboard = new Clipboard('.mcu')
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

  renderSoftwareVersion(){
      if(this.props.deviceStatus.app_status == DEVICE_APP_STATUS){
        return (
          <span>
            &nbsp;&nbsp;Software: {this.props.deviceStatus.device_sw_id}.{this.props.deviceStatus.device_sw_build}
          </span>
        );
      }else if (this.props.deviceStatus.app_status == DEVICE_SBL_STATUS) {
        return(
          <span />
        );
      }
  }

  renderMCU(){
      if(this.props.deviceStatus.app_status == DEVICE_APP_STATUS){
        return (
          <span>
            &nbsp;&nbsp;MCU: {this.props.deviceInfo.mcu_serial}
          </span>
        );
      }else if (this.props.deviceStatus.app_status == DEVICE_SBL_STATUS) {
        return(
          <span />
        );
      }   
  }

  createCopyButton(){
       if(this.props.deviceStatus.app_status == DEVICE_APP_STATUS){
        return (
          <button className="mcu" data-clipboard-text={this.props.deviceInfo.mcu_serial}>
               <i className="copy icon"></i>Copy MCU
          </button>
        );
      }else if (this.props.deviceStatus.app_status == DEVICE_SBL_STATUS) {
        return(
          <span />
        );
      }      
  }

  renderDeviceInfo(){
      return(
        <div className="thirteen wide column left aligned ">
            <div className="row">
                <div className={`ui ${iconColor} horizontal label`}>Vihecle Make:</div>{this.props.deviceInfo.vehicle_make}
            </div>
            <div>&nbsp;</div>
            <div className="row">
                <div className={`ui ${iconColor} horizontal label`}>Vihecle Model:</div>{this.props.deviceInfo.vehicle_model}
            </div>
            <div>&nbsp;</div>
            <div className="row">
                <div className={`ui ${iconColor} horizontal label`}>Vihecle Years:</div>{this.props.deviceStatus.device_sw_years}
            </div>
            <div>&nbsp;</div>
            <div className="row">
                <div className={`ui ${iconColor} horizontal label`}>Software Description::</div>{this.props.deviceStatus.device_sw_description}
                <br /><br/>
            </div>
            <div className="row">
                <div className={`ui ${iconColor} horizontal label`}>Device Model:</div>{this.props.deviceStatus.device_mfg_id}
                {this.renderSoftwareVersion()}
                {this.renderMCU()}
                &nbsp;&nbsp;
                {this.createCopyButton()}
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
