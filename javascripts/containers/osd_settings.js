import React, { Component } from 'react';

import { OSD_SETTINGS,
         OSD_INPUT_1_DROPDOWN,
         OSD_INPUT_2_DROPDOWN, 
         OSD_INPUT_3_DROPDOWN,
         OSD_INPUT_4_DROPDOWN } from '../utils/structures';


export default class OSDSettings extends Component {
  constructor(props){
    super(props);
    let osd_settings = JSON.parse(JSON.stringify(OSD_SETTINGS));
    this.state = {osd_settings: osd_settings};
    this.saveOSDSettings = this.saveOSDSettings.bind(this);
    this.onOverlayChange = this.onOverlayChange.bind(this);
    this.setOSDDropdwonValue = this.setOSDDropdwonValue.bind(this);
    this.renderChanelTextDropdown = this.renderChanelTextDropdown.bind(this);
  }

  saveOSDSettings(){
    this.props.onOSDSettingsSave(this.state.osd_settings);
  }

  renderChanelTextDropdown(option, index, value){
    //console.log("here ", value);
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

  setOSDDropdwonValue(event){
    let osd_settings = this.state.osd_settings;
    osd_settings[event.target.id] = event.target.value;
    console.log(osd_settings);
    this.setState({osd_settings});
  }


  onOverlayChange(checked,inputName){
    let osd_settings = this.state.osd_settings;
    if(checked){
        osd_settings[inputName] = "01";
    }else{
        osd_settings[inputName] = "00";  
    }
    console.log(osd_settings);
    this.setState({osd_settings});
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.osdSettings) != JSON.stringify(this.state.osd_settings)){
      let osd_settings = JSON.parse(JSON.stringify(nextProps.osdSettings));
      console.log("osdSettings", nextProps.osdSettings);
      console.log("state", this.state.osdSettings);
      this.setState({osd_settings: osd_settings});
    }
  }


  render() {
    return (
      <div>
        <div className="ui raised segment">
          <a className="ui blue ribbon large label">You can enable/disable overaly text by clicking check mark. If overaly enabled you can select overlay text from corresponding dropdown</a>
          <div className="ui grid">
            <div className="ten wide column">
              <div className="inline field">
                <input type="checkbox"
                       checked={this.state.osd_settings["OsdCVBS1"] == "01" ? 'checked':''}
                       onChange={event => this.onOverlayChange(event.target.checked,'OsdCVBS1')}
                       />
                <div className="ui left pointing label">
                  Enable Aftermarket Rear View Camera Input Text Overlay
                </div>
              </div>
            </div>
            <div className="six wide column">
              <div className="inline field">
                <select onChange={this.setOSDDropdwonValue} id={OSD_INPUT_1_DROPDOWN["id"]} className="ui dropdown">
                  { OSD_INPUT_1_DROPDOWN["values"].map( (elem, index) => {return this.renderChanelTextDropdown(elem,index,this.state.osd_settings["TextMenuCh1"]);} ) }
                </select>
                <div className="ui left pointing label">
                  Overly Text
                </div>
              </div>
            </div>
            <div className="ten wide column">
              <div className="inline field">
                <input type="checkbox"
                       checked={this.state.osd_settings["OsdCVBS2"] == "01" ? 'checked':''}
                       onChange={event => this.onOverlayChange(event.target.checked,'OsdCVBS2')}
                       />
                <div className="ui left pointing label">
                      Enable Aftermarket Front View Camera Input Text Overlay
                </div>
              </div>
            </div>
            <div className="six wide column">
              <div className="inline field">
                <select onChange={this.setOSDDropdwonValue} id={OSD_INPUT_2_DROPDOWN["id"]} className="ui dropdown">
                  { OSD_INPUT_2_DROPDOWN["values"].map( (elem, index) => {return this.renderChanelTextDropdown(elem,index,this.state.osd_settings["TextMenuCh2"]);} ) }
                </select>
                <div className="ui left pointing label">
                  Overly Text
                </div>
              </div>
            </div>
            <div className="ten wide column">
              <div className="inline field">
                <input type="checkbox"
                       checked={this.state.osd_settings["OsdCVBS3"] == "01" ? 'checked':''}
                       onChange={event => this.onOverlayChange(event.target.checked,'OsdCVBS3')}
                       />
                <div className="ui left pointing label">
                  Enable Aftermarket Left Lane Watch Camera Input Text Overlay
                </div>
              </div>
            </div>
            <div className="six wide column">
              <div className="inline field">
                <select onChange={this.setOSDDropdwonValue} id={OSD_INPUT_3_DROPDOWN["id"]} className="ui dropdown">
                  { OSD_INPUT_3_DROPDOWN["values"].map( (elem, index) => {return this.renderChanelTextDropdown(elem,index,this.state.osd_settings["TextMenuCh3"]);} ) }
                </select>
                <div className="ui left pointing label">
                  Overly Text
                </div>
              </div>
            </div>
            <div className="ten wide column">
              <div className="inline field">
                <input type="checkbox"
                       checked={this.state.osd_settings["OsdCVBS4"] == "01" ? 'checked':''}
                       onChange={event => this.onOverlayChange(event.target.checked,'OsdCVBS4')}
                       />
                <div className="ui left pointing label">
                  Enable Aftermarket Right Lane Watch Camera Input Text Overlay
                </div>
              </div>
            </div>
            <div className="six wide column">
              <div className="inline field">
                <select onChange={this.setOSDDropdwonValue} id={OSD_INPUT_4_DROPDOWN["id"]} className="ui dropdown">
                  { OSD_INPUT_4_DROPDOWN["values"].map( (elem, index) => {return this.renderChanelTextDropdown(elem,index,this.state.osd_settings["TextMenuCh4"]);} ) }
                </select>
                <div className="ui left pointing label">
                  Overly Text
                </div>
              </div>
            </div>
            <br/>
          </div>
        </div>
        <button onClick={this.saveOSDSettings} className="ui primary button">Save Settings</button>
      </div>
    );
  }
}