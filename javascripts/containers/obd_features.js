import React, { Component } from 'react';

import { OBD_FEATURES } from '../utils/structures';

export default class OBDFeatures extends Component {
  constructor(props){
    super(props);
    let obd_features = JSON.parse(JSON.stringify(this.props.OBDSettings));;
    this.state = {obd_features: obd_features};
    this.onFeatureChange = this.onFeatureChange.bind(this);
    this.onDisableAll = this.onDisableAll.bind(this);
    this.submitOBD = this.submitOBD.bind(this);
    this.renderSubmitButton = this.renderSubmitButton.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.OBDSettings) != JSON.stringify(this.state.obd_features)){
      let obd_features = JSON.parse(JSON.stringify(nextProps.OBDSettings));
      //console.log("OBDSettings", nextProps.OBDSettings);
      //console.log("state", this.state.obd_features);
      //console.log("Update OBDSettings");
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
    ////console.log(system_settings);
    this.setState({obd_features});
    //console.log(this.state.obd_features)
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
    //console.log(this.state.obd_features)
  }

  renderSubmitButton(){
    let obd_features = this.state.obd_features;
    console.log("OBD BUTTON ", obd_features);
    let todaysDate = new Date();
    let expireDate = new Date(obd_features["obd_expired"]);
    console.log(todaysDate);
    console.log(expireDate);
    if( todaysDate < expireDate ){
      console.log("Not Expired");
    }else{
      console.log("Expired");
    }
    if(obd_features["obd_count"] >= 10 || ( expireDate < todaysDate )){
      return(
        <div>
          Activation Locked
        </div>
      );
    }else{
      return(
        <div>
          <button onClick={this.submitOBD} className="ui primary button">
           Configure
          </button>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div className="ui two column grid">
          <div className="column">
            <div className="ui raised segment">
                <div className="inline field">
                  <input type="checkbox"
                         checked={this.state.obd_features["obd_feature_idx1"] == "1" ? 'checked':''}
                         onChange={event => this.onFeatureChange(event.target.checked,'obd_feature_idx1')}
                         />
                          <div className="ui left pointing label">
                            { this.state.obd_features["obd_label_idx1"] }
                          </div>                          
                </div>
                <br />
                <div className="inline field">
                  <input type="checkbox"
                         checked={this.state.obd_features["obd_feature_idx2"] == "1" ? 'checked':''}
                         onChange={event => this.onFeatureChange(event.target.checked,'obd_feature_idx2')}/>
                    <div className="ui left pointing label">
                          { this.state.obd_features["obd_label_idx2"] }
                    </div>
                </div>
                <br />
                <div className="inline field">
                  <input type="checkbox"
                         checked={this.state.obd_features["obd_feature_idx3"] == "1" ? 'checked':''}
                         onChange={event => this.onFeatureChange(event.target.checked,'obd_feature_idx3')}/>
                    <div className="ui left pointing label">
                          { this.state.obd_features["obd_label_idx3"] }
                    </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="ui raised segment">
                <div className="inline field">
                    <input type="checkbox"
                       checked={this.state.obd_features["obd_disable_all"] == "1" ? 'checked':''}
                       onChange={event => this.onDisableAll(event.target.checked)}
                       />
                    <div className="ui left pointing label">
                          Turn Off All Previously Activated Features
                    </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          { this.renderSubmitButton() }
      </div>
    )
  }
}