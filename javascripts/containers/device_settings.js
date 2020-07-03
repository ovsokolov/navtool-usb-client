import React, { Component } from 'react';

import { SYSTEM_SETTINGS } from '../utils/structures';
import { FRONT_REAR_CAMERA_DROPDOWN, SIDE_CAMERA_DROPDOWN, SYNC_POLARITY_DROPDOWN } from '../utils/structures';

export default class DeviceSettings extends Component {
  constructor(props){
    super(props);
    let system_settings = JSON.parse(JSON.stringify(this.props.systemSettings));
    //console.log("~~~~~~~~~~~~~~~~~~~~~~~~");
    this.state = {system_settings: system_settings};
    this.saveSettings = this.saveSettings.bind(this);
    this.onCameraChange = this.onCameraChange.bind(this);
    this.onOEMCameraChange = this.onOEMCameraChange.bind(this);
    this.setDropdwonValue = this.setDropdwonValue.bind(this);
    this.renderDropdown = this.renderDropdown.bind(this);
    this.renderRadioBatton = this.renderRadioBatton.bind(this);
    this.onRadioBattonChange = this.onRadioBattonChange.bind(this);
    this.onIputChange = this.onIputChange.bind(this);

    this.renderSettings = this.renderSettings.bind(this);
    this.renderHDMISettings = this.renderHDMISettings.bind(this)
    this.renderAfterMarketCameras = this.renderAfterMarketCameras.bind(this);
    this.renderOEMCameras = this.renderOEMCameras.bind(this);
    this.renderFrontCameraSettings = this.renderFrontCameraSettings.bind(this);
    this.renderLaneWatchCameraSettings = this.renderLaneWatchCameraSettings.bind(this);
    this.renderSync = this.renderSync.bind(this);
  }

  saveSettings(){
    this.props.onDeviceSettingsSave(this.state.system_settings);
  }

  renderDropdown(option, index){
    ////console.log("here ", value);
    if(option.value == this.state.system_settings[option.setting]){
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

  renderRadioBatton(option, index){
    let system_settings = this.state.system_settings;
    //console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz');
    //console.log(option.value);
    //console.log(option.setting);
    //console.log(this.state.system_settings[option.setting]);
    return (
          <div>
          <div className="inline field">
                <input type="radio"
                       name={option.key}
                       value={option.value}
                       checked={option.value == this.state.system_settings[option.setting]}                       
                       onChange={event => this.onRadioBattonChange(event.target.checked, event.target.value, option.setting)}
                />
                <div className="ui left pointing label">
                  {option.label}
                </div>
                <br/>
                <div className="ui red basic label">
                  {option.description.map( (elem, index) => { return <div dangerouslySetInnerHTML={{__html: elem}} />; } )}
                </div>                         
          </div>
          <br />
          </div>
    );
  }

  setDropdwonValue(event){
    let system_settings = this.state.system_settings;
    system_settings[event.target.id] = event.target.value;
    ////console.log(system_settings);
    this.setState({system_settings});
  }

  onIputChange(checked, name){
    let system_settings = this.state.system_settings;
    if(checked){
      system_settings[name] = "1";
    }else{
      system_settings[name] = "0";
    }
    ////console.log(system_settings);
    this.setState({system_settings});
  }

  onRadioBattonChange(checked, value, name){
    //console.log(checked);
    //console.log(value);
    //console.log(name);
    let system_settings = this.state.system_settings;
    system_settings[name] = value;
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
    ////console.log(system_settings);
    this.setState({system_settings});
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.systemSettings) != JSON.stringify(this.state.system_settings)){
    //if(nextProps.systemSettings != this.state.system_settings){
      let system_settings = JSON.parse(JSON.stringify(nextProps.systemSettings));
      //console.log("systemSettings", nextProps.systemSettings);
      //console.log("state", this.state.system_settings);
      this.setState({system_settings: system_settings});
    }
  }


  renderSettings(){
    //console.log('renderSettingsFunction');
    //console.log(this.state);
    return (
      <div className="ui two column grid">
        { this.renderHDMISettings() }
        { this.renderAfterMarketCameras() }
        { this.renderOEMCameras() }
        <div className="column">
          { this.renderFrontCameraSettings() }
        </div>
        { this.props.settingsType == "1" &&
            <div className="column">
              { this.renderLaneWatchCameraSettings() }
            </div>
        }
        { this.props.settingsType == "2" &&
            <div className="column">
              { this.renderSync() }
            </div>
        }
      </div>
    )
  }

  renderHDMISettings(){
    if(this.state.system_settings["HDMICapacity"] == "1"){
      return (
        <div className="row">
          <div className="column">
            <div className="ui raised segment">
              <a className="ui blue ribbon label">ACTIVATE MIRRORING/HDMI INPUT</a>
                <div className="inline field">
                  <input type="checkbox"
                         checked={this.state.system_settings["HDMIEnabled"] == "1" ? 'checked':''}
                         onChange={event => this.onIputChange(event.target.checked,'HDMIEnabled')}
                         />
                        <div className="ui left pointing label">
                          Turn On HDMI / Wireless Mirroring / Carplay / Android Auto Video Input
                        </div>                          
                </div>
            </div>
          </div>
          <div className="column">
              <div className="ui raised segment">
                <div className="ui red basic huge label">
                    IF YOU DO NOT SEE &quot;SAVE SETTINGS&quot; BUTTON ON THE SCREEN PLEASE SCROLL DOWN
                </div>  
              </div>
          </div>
        </div>
      );
    }
  }

  renderAfterMarketCameras(){
    //console.log('renderAfterMarketCamerasFunction');
    return (
            <div className="column">
              <div className="ui raised segment">
                <a className="ui blue ribbon label">SET CHECKMARK ONLY FOR CAMERAS THAT YOU HAVE ADDED TO THE VEHICLE</a>
                <div className="inline field">
                    <input type="checkbox"
                           checked={this.state.system_settings["Input1Enabled"] == "1" ? 'checked':''}
                           onChange={event => this.onCameraChange(event.target.checked,'FactoryRearCamera','RearCameraEnabled','Input1Enabled')}
                           />
                    <div className="ui left pointing label">
                          Aftermarket Rear View Camera
                    </div>
                </div>
                <br />
                <div className="inline field">
                  <input type="checkbox"
                    checked={this.state.system_settings["Input2Enabled"] == "1" ? 'checked':''}
                    onChange={event => this.onCameraChange(event.target.checked,'FactoryFrontCamera','FrontCameraEnabled','Input2Enabled')}
                    />
                    <div className="ui left pointing label">
                        Aftermarket Forward Facing Camera
                    </div>
                </div>
                <br />
                <div>
                  <div className="inline field">
                    <input type="checkbox"
                      checked={this.state.system_settings["Input3Enabled"] == "1" ? 'checked':''}
                      onChange={event => this.onCameraChange(event.target.checked,'FactoryLeftCamera','LeftCameraEnabled','Input3Enabled')}
                      />
                      <div className="ui left pointing label">
                         Aftermarket Left Lane Watch Camera   
                      </div>
                  </div>
                  <br />
                  <div className="inline field">
                    <input type="checkbox"
                      checked={this.state.system_settings["Input4Enabled"] == "1" ? 'checked':''}
                      onChange={event => this.onCameraChange(event.target.checked,'FactoryRightCamera','RightCameraEnabled','Input4Enabled')}
                      />
                      <div className="ui left pointing label">
                           Aftermarket Right Lane Watch Camera   
                      </div>
                  </div>
                </div>
              </div>
            </div>
    );

  }

  renderOEMCameras(){
    return (
            <div className="column">
              <div className="ui raised segment">
                <a className="ui blue ribbon label">SET CHECKMARK ONLY FOR CAMERAS THAT ARE FACTORY INSTALLED</a>
                <div className="inline field">
                      <input type="checkbox"
                         checked={this.state.system_settings["FactoryRearCamera"] == "1"? 'checked':''}
                         onChange={event => this.onOEMCameraChange(event.target.checked,'FactoryRearCamera','RearCameraEnabled','Input1Enabled')}
                         />
                          <div className="ui left pointing label">
                            Factory Equiped Rear View Camera
                          </div>                          
                </div>
                <br />
                {this.props.settingsType == "1" &&
                  <div>
                    <div className="inline field">
                          <input type="checkbox"
                            checked={this.state.system_settings["FactoryFrontCamera"] == "1"? 'checked':''}
                            onChange={event => this.onOEMCameraChange(event.target.checked,'FactoryFrontCamera','FrontCameraEnabled','Input2Enabled')}
                            />
                              <div className="ui left pointing label">
                                Factory Equiped Forward Facing Camera                               
                              </div>
                              <div className="ui red basic label">
                                  DO NOT SET CHECKMARK FOR VEHICLES EQUIPPED WITH FACTORY 360 CAMERA OR FACTORY SIDEVIEW PARKING CAMERAS
                              </div>                            
                    </div>
                    <br />
                    <div className="inline field">
                        <input type="checkbox"
                          checked={this.state.system_settings["FactoryLeftCamera"] == "1"? 'checked':''}
                          onChange={event => this.onOEMCameraChange(event.target.checked,'FactoryLeftCamera','LeftCameraEnabled','Input3Enabled')}
                          />
                              <div className="ui left pointing label">
                                Factory Equiped Left Lane Watch Camera
                              </div> 
                              <div className="ui red basic label">
                                  DO NOT SET CHECKMARK FOR VEHICLES EQUIPPED WITH FACTORY 360 CAMERA OR FACTORY SIDEVIEW PARKING CAMERAS
                              </div>                           
                    </div>
                    <br />
                    <div className="inline field">
                        <input type="checkbox"
                          checked={this.state.system_settings["FactoryRightCamera"] == "1"? 'checked':''}
                          onChange={event => this.onOEMCameraChange(event.target.checked,'FactoryRightCamera','RightCameraEnabled','Input4Enabled')}
                          />
                              <div className="ui left pointing label">
                                Factory Equiped Right Lane Watch Camera
                              </div> 
                              <div className="ui red basic label">
                                  DO NOT SET CHECKMARK FOR VEHICLES EQUIPPED WITH FACTORY 360 CAMERA OR FACTORY SIDEVIEW PARKING CAMERAS
                              </div>                           
                    </div>
                  </div>
                }
              </div>
            </div>
    );
  }

  renderFrontCameraSettings(){
    return(
          <div className="ui raised segment">
            <a className="ui blue ribbon label">FORWARD FACING CAMERA SETTINGS</a>
              <div>&nbsp;</div>
              <div className="ui red basic label">
                  SETTINGS BELOW ONLY NEEDS TO BE CONFIGURED IF ADDING AN AFTERMARKET FORWARD FACING CAMERA
              </div>
              <div>&nbsp;</div> 
              { FRONT_REAR_CAMERA_DROPDOWN["values"].map( (elem, index) => {return this.renderRadioBatton(elem,index)})}                      
          </div>
    );
  }

  renderLaneWatchCameraSettings(){
    return (
        <div className="ui raised segment">
          <a className="ui blue ribbon label">LEFT/RIGHT LANE CAMERA SETTINGS</a>
            <div>&nbsp;</div>
            <div className="ui red basic label">
                SETTINGS BELOW ONLY NEEDS TO BE CONFIGURED IF ADDING AN AFTERMARKET LANE WATCH CAMERA
            </div>
            <div>&nbsp;</div> 
            { SIDE_CAMERA_DROPDOWN["values"].map( (elem, index) => {return this.renderRadioBatton(elem,index)})}                      
        </div>
    );
  }

  renderSync(){
    return (
      <div className="ui raised segment">
          <a className="ui blue ribbon label">SYNC POLARITY</a>
          <div className="inline field">
              <select onChange={this.setDropdwonValue} id={SYNC_POLARITY_DROPDOWN["id"]} className="ui dropdown">
                { SYNC_POLARITY_DROPDOWN["values"].map( (elem, index) => {return this.renderDropdown(elem,index)})} 
              </select> 
          </div>   
          <br /> 
          <div className="inline field">
            <input type="checkbox"
              checked={this.state.system_settings["SOGEnabled"] == "1" ? 'checked':''}
              onChange={event => this.onIputChange(event.target.checked,'SOGEnabled')}
              />
              <div className="ui left pointing label">
                  Sync on Green
              </div>
          </div> 
          <br />     
          <div className="inline field">
            <input type="checkbox"
              checked={this.state.system_settings["ParkingLinesDisabled"] == "0" ? 'checked':''}
              onChange={event => this.onIputChange(!(event.target.checked),'ParkingLinesDisabled')}
              />
              <div className="ui left pointing label">
                  Rear Camera Parking Lines
              </div>
          </div>          
      </div>
    );
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
        { this.renderSettings() }
        <br/>
        <button onClick={this.saveSettings} className="ui primary button">
          Save Settings
        </button>
      </div>
    );
  }
}
