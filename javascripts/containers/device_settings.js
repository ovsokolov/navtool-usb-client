import React, { Component } from 'react';

import { SYSTEM_SETTINGS } from '../utils/structures';
import { FRONT_REAR_CAMERA_DROPDOWN } from '../utils/structures';
import { SIDE_CAMERA_DROPDOWN } from '../utils/structures';

export default class DeviceSettings extends Component {
  constructor(props){
    super(props);
    let system_settings = JSON.parse(JSON.stringify(SYSTEM_SETTINGS));
    this.state = {system_settings: system_settings};
    this.saveSettings = this.saveSettings.bind(this);
    this.onCameraChange = this.onCameraChange.bind(this);
    this.onOEMCameraChange = this.onOEMCameraChange.bind(this);
    this.setDropdwonValue = this.setDropdwonValue.bind(this);
    this.renderDropdown = this.renderDropdown.bind(this);
  }

  saveSettings(){
    this.props.onDeviceSettingsSave(this.state.system_settings);
  }

  renderDropdown(option, index, value){
    console.log("here ", value);
    if(option.value == value){
      return (
        <option key={option.key}
                value={option.value}
                selected
                data-name={option.setting}
        >
        {option.label}
        </option>
      );
    }else {
      return (
        <option key={option.key}
                value={option.value}
                data-name={option.setting}
        >
        {option.label}
        </option>
      );
    }
  }

  setDropdwonValue(event){
    let system_settings = this.state.system_settings;
    system_settings[event.target.id] = event.target.value;
    console.log(system_settings);
    this.setState({system_settings});
  }

  onIputChange(checked, name){
    let system_settings = this.state.system_settings;
    if(checked){
      system_settings[name] = "1";
    }else{
      system_settings[name] = "0";
    }
    console.log(system_settings);
    this.setState({system_settings});
  }

  onCameraChange(checked,factoryCamera,camera,inputName){
    let system_settings = this.state.system_settings;
    if(checked){
      if(system_settings[factoryCamera] == "1"){
        system_settings[camera] = "0";
        system_settings[inputName] = "1";
      }else{
        system_settings[camera] = "1";
        system_settings[inputName] = "1";
      }
    }else{
      system_settings[camera] = "0";
      system_settings[inputName] = "0";
    }
    console.log(system_settings);
    this.setState({system_settings});
  }

  onOEMCameraChange(checked,factoryCamera,camera,inputName){
    let system_settings = this.state.system_settings;
    if(checked){
      system_settings[factoryCamera] = "1";
      system_settings[camera] = "0";
    }else{
      system_settings[factoryCamera] = "0";
      system_settings[camera] = system_settings[inputName];
    }
    console.log(system_settings);
    this.setState({system_settings});
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.systemSettings != this.state.system_settings){
      let system_settings = JSON.parse(JSON.stringify(nextProps.systemSettings));
      console.log(system_settings);
      this.setState({system_settings});
    }
  }


  render() {
    var settings = [];
    for (let property in this.state.system_settings) {
      let div_key = "div_" + property;
      settings.push(<div key={div_key}>{property} :<input type="text"
                                            key={property}
                                            ref={property}
                                            //ref={(input) => this.input = input}
                                            value={this.state.system_settings[property]}
                                            onChange={event => this.onIputChange(event.target.value,property)}
                                      />
                    </div>);
    }
    return (
      <div>
        <div className="mui-container">
          <div className="mui-row">
            <div className="mui-col-xs-1"></div>
            <div className="mui-col-xs-11">
              <label>
                <input type="checkbox"
                       checked={this.state.system_settings["HDMIEnabled"] == "1" ? 'checked':''}
                       onChange={event => this.onIputChange(event.target.checked,'HDMIEnabled')}
                       />
                      HDMI Input
              </label>
            </div>
          </div>
          <div className="mui-row">
            <div className="mui-col-xs-1"></div>
            <div className="mui-col-xs-5">
              <label>
                <input type="checkbox"
                       checked={this.state.system_settings["Input1Enabled"] == "1" ? 'checked':''}
                       onChange={event => this.onCameraChange(event.target.checked,'FactoryRearCamera','RearCameraEnabled','Input1Enabled')}
                       />
                      Rear View Camera
              </label>
            </div>
            <div className="mui-col-xs-1"></div>
            <div className="mui-col-xs-5">
              <label>
                <input type="checkbox"
                       checked={this.state.system_settings["FactoryRearCamera"] == "1"? 'checked':''}
                       onChange={event => this.onOEMCameraChange(event.target.checked,'FactoryRearCamera','RearCameraEnabled','Input1Enabled')}
                       />
                              OEM Rear View Camera
              </label>
            </div>
          </div>
          <div className="mui-row">
            <div className="mui-col-xs-1"></div>
            <div className="mui-col-xs-5">
              <label>
                <input type="checkbox"
                  checked={this.state.system_settings["Input2Enabled"] == "1" ? 'checked':''}
                  onChange={event => this.onCameraChange(event.target.checked,'FactoryFrontCamera','FrontCameraEnabled','Input2Enabled')}
                  />
                     Front View Camera
              </label>
            </div>
            <div className="mui-col-xs-1"></div>
            <div className="mui-col-xs-5">
              <label>
                <input type="checkbox"
                  checked={this.state.system_settings["FactoryFrontCamera"] == "1"? 'checked':''}
                  onChange={event => this.onOEMCameraChange(event.target.checked,'FactoryFrontCamera','FrontCameraEnabled','Input2Enabled')}
                  />
                              OEM Front View Camera
              </label>
            </div>
          </div>
          <div className="mui-row">
            <div className="mui-col-xs-1"></div>
            <div className="mui-col-xs-5">
              <label>
                <input type="checkbox"
                  checked={this.state.system_settings["Input3Enabled"] == "1" ? 'checked':''}
                  onChange={event => this.onCameraChange(event.target.checked,'FactoryLeftCamera','LeftCameraEnabled','Input3Enabled')}
                  />
                     Left View Camera
              </label>
            </div>
            <div className="mui-col-xs-1"></div>
            <div className="mui-col-xs-5">
              <label>
                <input type="checkbox"
                  checked={this.state.system_settings["FactoryLeftCamera"] == "1"? 'checked':''}
                  onChange={event => this.onOEMCameraChange(event.target.checked,'FactoryLeftCamera','LeftCameraEnabled','Input3Enabled')}
                  />
                              OEM Left View Camera
              </label>
            </div>
          </div>
          <div className="mui-row">
            <div className="mui-col-xs-1"></div>
            <div className="mui-col-xs-5">
              <label>
                <input type="checkbox"
                  checked={this.state.system_settings["Input4Enabled"] == "1" ? 'checked':''}
                  onChange={event => this.onCameraChange(event.target.checked,'FactoryRightCamera','RightCameraEnabled','Input4Enabled')}
                  />
                     Right View Camera
              </label>
            </div>
            <div className="mui-col-xs-1"></div>
            <div className="mui-col-xs-5">
              <label>
                <input type="checkbox"
                  checked={this.state.system_settings["FactoryRightCamera"] == "1"? 'checked':''}
                  onChange={event => this.onOEMCameraChange(event.target.checked,'FactoryRightCamera','RightCameraEnabled','Input4Enabled')}
                  />
                              OEM Right View Camera
              </label>
            </div>
          </div>
          <div className="mui-row">
            <div className="mui-col-xs-2">Rear/Front</div>
            <div className="mui-col-xs-10">
              <select onChange={this.setDropdwonValue} id={FRONT_REAR_CAMERA_DROPDOWN["id"]} className="mySelect">
                { FRONT_REAR_CAMERA_DROPDOWN["values"].map( (elem, index) => {return this.renderDropdown(elem,index,this.state.system_settings["FrontCameraMode"]);} ) }
              </select>
            </div>
          </div>
          <div className="mui-row">
            <div className="mui-col-xs-2">Left/Right</div>
            <div className="mui-col-xs-10">
              <select onChange={this.setDropdwonValue} id={SIDE_CAMERA_DROPDOWN["id"]} className="mySelect">
                { SIDE_CAMERA_DROPDOWN["values"].map( (elem, index) => {return this.renderDropdown(elem,index,this.state.system_settings["SideCameraMode"]);} ) }
              </select>
            </div>
          </div>
        </div>
        <br/>
        <button onClick={this.saveSettings} className="mui-btn mui-btn--danger">Save Settings</button>
      </div>
    );
  }
}
