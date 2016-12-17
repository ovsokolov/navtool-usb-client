import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchModel } from '../actions/get_model';
import { fetchYear, setYear } from '../actions/get_year';
import { setTransmissionType } from '../actions/set_transmission';
import { fetchSoftware, setSoftware } from '../actions/get_software';

import CarMakeList from './make_list';
import CarModelList from './model_list'
import CarYearList from './year_list'
import SoftwareList from './software_list'

class SoftwareSearch extends Component {
  constructor(props){
    super(props);
    this.state = {mfg_id: '', vehicle_make: '', vehicle_model: '', vehicle_year: '', sw_id: ''};
    this.setVehicleMake = this.setVehicleMake.bind(this);
    this.setVehicleModel = this.setVehicleModel.bind(this);
    this.setVehicleYear = this.setVehicleYear.bind(this);
    this.handleTransmissionChange = this.handleTransmissionChange.bind(this);
    this.searchSoftware = this.searchSoftware.bind(this);
    this.setSelectedSoftware = this.setSelectedSoftware.bind(this);
  }

  searchSoftware(){
    this.props.fetchSoftware(
      this.props.software_search.mfg_id,
      this.props.software_search.vehicle_make,
      this.props.software_search.vehicle_model,
      this.props.software_search.vehicle_year,
      this.props.software_search.automatic_transmission
    );
  }

  handleTransmissionChange(event){
    this.props.setTransmissionType(event.target.value);
  }

  setVehicleMake(vehicle_make){
    this.props.fetchModel(this.props.software_search.mfg_id, vehicle_make);
  }

  setVehicleModel(vehicle_model){
    this.props.fetchYear(this.props.software_search.mfg_id,
                         this.props.software_search.vehicle_make,
                         vehicle_model);
  }

  setVehicleYear(vehicle_year){
    this.props.setYear(vehicle_year);
  }

  setSelectedSoftware(software_id){
    console.log("Software Slected: ", software_id);
    this.props.setSoftware(software_id);
  }

  render(){
    return (
      <div>
        <div className="mui-row">
        <div className="mui-col-xs-1"></div>
        <div className="mui-col-xs-5">
            <div className="mui-row">
              <div className="mui-col-xs-12">
                Transmission:
              </div>
            </div>
            <div className="mui-row">
              <div className="mui-col-xs-6">
                <input type="radio"
                       name="transmission_type"
                       value="1"
                       checked={this.props.software_search.automatic_transmission == 1}
                       onChange={this.handleTransmissionChange}
                /><span className="radio-opt-desc">Automatic</span>
              </div>
              <div className="mui-col-xs-6">
                <input type="radio"
                       name="transmission_type"
                       value="0"
                       checked={this.props.software_search.automatic_transmission == 0}
                       onChange={this.handleTransmissionChange}
                /><span className="radio-opt-desc">Manual</span>
              </div>
            </div>
          </div>
          <div className="mui-col-xs-6">
            <div className="mui-row">
              <button onClick={this.searchSoftware} className="mui-btn mui-btn--danger">Search Software</button>
              <button onClick={this.props.onInstallClick} className="mui-btn mui-btn--danger">Install</button>
            </div>
          </div>
        </div>
        <div className="mui-row">
          <div className="mui-col-xs-1">&nbsp;</div>
          <div className="mui-col-xs-4">
            <div className="mui-row">
              <div className="mui-col-xs-12">
                Vehicle Make
              </div>
            </div>
            <div className="mui-row">
              <div className="mui-col-xs-12">
                <CarMakeList
                  onSelectVehicleMake={this.setVehicleMake}
                />
              </div>
            </div>
          </div>
          <div className="mui-col-xs-4">
            <div className="mui-row">
              <div className="mui-col-xs-12">
                Vehicle Model
              </div>
            </div>
            <div className="mui-row">
              <div className="mui-col-xs-12">
                <CarModelList
                  onSelectVehicleModel={this.setVehicleModel}
                />
              </div>
            </div>
          </div>
          <div className="mui-col-xs-3">
            <div className="mui-row">
              <div className="mui-col-xs-12">
                Vehicle Year
              </div>
            </div>
            <div className="mui-row">
              <div className="mui-col-xs-12">
                <CarYearList
                  onSelectVehicleYear={this.setVehicleYear}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mui-row">
          <div className="mui-col-xs-12">
            <SoftwareList
              onSelectSoftware={this.setSelectedSoftware}
            />
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state){
  return { software_search: state.software_search };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({fetchModel, fetchYear, setTransmissionType, setYear, fetchSoftware, setSoftware}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(SoftwareSearch);
