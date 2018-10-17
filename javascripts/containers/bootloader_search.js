import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchBootloader, setBootloader } from '../actions/get_bootloader';

import BootloaderList from './bootloader_list'



class BootloaderSearch extends Component {
  constructor(props){
    super(props);
    this.state = {mfg_id: '', vehicle_make: '', vehicle_model: '', vehicle_year: '', sw_id: ''};
    this.searchBootloader = this.searchBootloader.bind(this);
    this.setSelectedBootloader = this.setSelectedBootloader.bind(this);
  }

  searchBootloader(){
    console.log("searchBootloader");
    this.props.fetchBootloader();
  }


  setSelectedBootloader(id, path, target){
    console.log("Bootloader Search: ", id);
    console.log("Bootloader Search: ", path);
    console.log("Bootloader Search: ", target);
    this.props.setBootloader(id, path, target);
  }

  render(){
    return (
      <div>
        <div className="ui four column grid container">
          <div className="column">
            <button className="ui compact blue labeled icon button" onClick={this.searchBootloader} >
              <i className="search icon"></i>
              Search
            </button>
          </div>
          <div className="column">
                <button className="ui compact red labeled icon button" onClick={this.props.onInstallClick} >
                  <i className="download icon"></i>
                  Install Bootloader
                </button>
          </div>
          <div className="column">
                <button className="ui compact red labeled icon button" onClick={this.props.onInstallClick} >
                  <i className="download icon"></i>
                  Install Application
                </button>
          </div>
          <div className="column">
            <button className="ui compact blue labeled icon button" onClick={this.searchSoftware} >
              <i className="search icon"></i>
              Register Device
            </button>
          </div>
        </div>
        <div className="container">
            <BootloaderList
              onSelectBootloader={this.setSelectedBootloader}
            />
        </div>
      </div>
    );
  }
}



function mapDispatchToProps(dispatch){
  return bindActionCreators({fetchBootloader, setBootloader}, dispatch);
}

export default connect(null,mapDispatchToProps)(BootloaderSearch);