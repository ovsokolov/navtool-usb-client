import React, { Component } from 'react';

import { SYSTEM_SETTINGS } from '../utils/structures';

export default class DeviceSettings extends Component {
  constructor(props){
    super(props);
    let system_settings = JSON.parse(JSON.stringify(SYSTEM_SETTINGS));
    this.state = {system_settings: system_settings};
    this.saveSettings = this.saveSettings.bind(this);
  }

  saveSettings(){
    this.props.onDeviceSettingsSave(this.state.system_settings);
  }

  onIputChange(term, name){
    let system_settings = this.state.system_settings;
    system_settings[name] = term;
    this.setState({system_settings});
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.systemSettings != this.state.system_settings){
      let system_settings = JSON.parse(JSON.stringify(nextProps.systemSettings));
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
        This is settings
        {settings}
        <br/>
        <button onClick={this.saveSettings} className="mui-btn mui-btn--danger">Save Settings</button>
      </div>
    );
  }
}
