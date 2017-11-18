import React, { Component } from 'react';

import { SYSTEM_SETTINGS } from '../utils/structures';
import { SYNC_POLARITY_DROPDOWN } from '../utils/structures';


export default class DeviceSettingsType2 extends Component {
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
    //console.log(system_settings);
    this.setState({system_settings});
  }

  onIputChange(checked, name){
    let system_settings = this.state.system_settings;
    if(checked){
      system_settings[name] = "1";
    }else{
      system_settings[name] = "0";
    }
    //console.log("XXXXX");
    //console.log(system_settings);
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
    ////console.log(system_settings);
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
        <div className="ui two column grid">
            <div className="column">
              <div className="ui raised segment">
                <a className="ui blue ribbon label">SET CHECKMARK FOR AFTERMARKET INSTALLED CAMERA</a>
                <div className="inline field">
                    <input type="checkbox"
                           checked={this.state.system_settings["HDMIEnabled"] == "1" ? 'checked':''}
                           onChange={event => this.onIputChange(event.target.checked,'HDMIEnabled')}
                           />
                          <div className="ui left pointing label">
                            Turn On HDMI Video Input
                          </div>                          
                </div>
                <br />
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
              </div>
            </div>
            <div className="column">
              <div className="ui raised segment">
                <a className="ui blue ribbon label">SET CHECKMARK FOR FACTORY INSTALLED CAMERA</a>
                <div className="inline field">
                      <input type="checkbox"
                         checked={this.state.system_settings["FactoryRearCamera"] == "1"? 'checked':''}
                         onChange={event => this.onOEMCameraChange(event.target.checked,'FactoryRearCamera','RearCameraEnabled','Input1Enabled')}
                         />
                          <div className="ui left pointing label">
                            Factory Equiped Rear View Camera
                          </div>                          
                </div>
              </div>
            </div>
            <div className="column">
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
            </div>
        </div>
        <br/>
        <button onClick={this.saveSettings} className="ui primary button">
          Save Settings
        </button>
      </div>
    );
  }
}
