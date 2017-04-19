import React, { Component } from 'react';

import { OBD_FEATURES } from '../utils/structures';

export default class OBDFeatures extends Component {
  constructor(props){
    super(props);
    let obd_features = {};
    this.state = {obd_features: obd_features};
    this.onFeatureChange = this.onFeatureChange.bind(this);
    this.onDisableAll = this.onDisableAll.bind(this);
    this.submitOBD = this.submitOBD.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.OBDSettings) != JSON.stringify(this.state.obd_features)){
      let obd_features = JSON.parse(JSON.stringify(nextProps.OBDSettings));
      console.log("OBDSettings", nextProps.OBDSettings);
      console.log("state", this.state.obd_features);
      console.log("Update OBDSettings");
      this.setState({obd_features: obd_features});
    }
  }

  submitOBD(){
    this.props.onSubmitOBD(this.state.obd_features);
  }

  onFeatureChange(checked,featureName){
    let obd_features = this.state.obd_features;
    if(checked){
      obd_features[featureName] = "1"
      obd_features["obd_disable_all"] = "0";
    }else{
      obd_features[featureName] = "0"
    }
    //console.log(system_settings);
    this.setState({obd_features});
    console.log(this.state.obd_features)
  }

  onDisableAll(checked){
    let obd_features = this.state.obd_features;
    if(checked){
        obd_features["obd_feature_idx1"] = "0";
        obd_features["obd_feature_idx2"] = "0";
        obd_features["obd_feature_idx3"] = "0";
        obd_features["obd_disable_all"] = "1";
    }else{
        obd_features["obd_disable_all"] = "0";
    }
    this.setState({obd_features});
    console.log(this.state.obd_features)
  }

  render() {
    return (
      <div>
        <div className="mui-container">
          <div className="mui-row">
            <div className="mui-col-xs-1"></div>
            <div className="mui-col-xs-5">
              <label>
                <input type="checkbox"
                       checked={this.state.obd_features["obd_feature_idx1"] == "1" ? 'checked':''}
                       onChange={event => this.onFeatureChange(event.target.checked,'obd_feature_idx1')}
                       />
                      { this.state.obd_features["obd_label_idx1"] }
              </label>
            </div>
            <div className="mui-col-xs-1"></div>
            <div className="mui-col-xs-5">
              <label>
                <input type="checkbox"
                       checked={this.state.obd_features["obd_disable_all"] == "1" ? 'checked':''}
                       onChange={event => this.onDisableAll(event.target.checked)}
                       />
                      Turn Off All Previously Activated Features
              </label>
            </div>
          </div>
          <div className="mui-row">
            <div className="mui-col-xs-1"></div>
            <div className="mui-col-xs-11">
              <label>
                <input type="checkbox"
                       checked={this.state.obd_features["obd_feature_idx2"] == "1" ? 'checked':''}
                       onChange={event => this.onFeatureChange(event.target.checked,'obd_feature_idx2')}/>
                      { this.state.obd_features["obd_label_idx2"] }
              </label>
            </div>
          </div>
          <div className="mui-row">
            <div className="mui-col-xs-1"></div>
            <div className="mui-col-xs-11">
              <label>
                <input type="checkbox"
                       checked={this.state.obd_features["obd_feature_idx3"] == "1" ? 'checked':''}
                       onChange={event => this.onFeatureChange(event.target.checked,'obd_feature_idx3')}/>
                      { this.state.obd_features["obd_label_idx3"] }
              </label>
            </div>
          </div>
        </div>
        <br />
        <button onClick={this.submitOBD} className="mui-btn mui-btn--danger">Configure</button>
      </div>
    )
  }
}