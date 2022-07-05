import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchBootloader, setBootloader } from '../actions/get_bootloader';

import BootloaderList from './bootloader_list'



class BootloaderSearch extends Component {
  constructor(props){
    super(props);
    this.state = {btl_id: '', mfg_id: '', vehicle_make: '', vehicle_model: '', vehicle_year: '', sw_id: ''};
    this.searchBootloader = this.searchBootloader.bind(this);
    this.setSelectedBootloader = this.setSelectedBootloader.bind(this);
    this.renderFlashImageButton = this.renderFlashImageButton.bind(this);
    this.renderApplicationButton = this.renderApplicationButton.bind(this);
    this.installApplication = this.installApplication.bind(this);
    this.installBootloader = this.installBootloader.bind(this);    
    this.flashImage = this.flashImage.bind(this);
  }

  deviceIdChange(value){
    console.log(value);
    this.setState({mfg_id: value});    
  }

  bootloaderIdChange(value){
    console.log(value);
    this.setState({btl_id: value});    
  }  

  installApplication(){
    console.log(this.state);
    this.props.onApplicationInstallClick(this.state.mfg_id);
    this.setState({mfg_id: ''});  
  }

  installBootloader(){
    console.log(this.state);
    this.props.onInstallClick(this.state.btl_id);
    this.setState({btl_id: ''});  
  }
  
  flashImage(){
    console.log('flashImage');
    this.props.onFlashImage();
  }

  renderFlashImageButton(){

    if(this.props.deviceInfo.mfg_id == 'UMBTLR'){
    //if(1 == 2){
      return(
         <div className="column">
            <button className="ui compact blue labeled icon button" onClick={this.flashImage} >
              <i className="search icon"></i>
              Flash Image
            </button>
          </div>
      );
    }
  } 

  renderApplicationButton(){

    //if(this.props.deviceInfo.image_flash == 1){
      return(
          <div className="column">
                <button className="ui compact red labeled icon button" onClick={this.installApplication} >
                  <i className="download icon"></i>
                  Install Application
                </button>
                <input type="text"
                    value={ this.state.mfg_id }
                    onChange={event => this.deviceIdChange(event.target.value)}
                    placeholder="Scan Device ID ...">
                </input>                  
          </div>
      );
    //}
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
                <button className="ui compact red labeled icon button" onClick={this.installBootloader} >
                  <i className="download icon"></i>
                  Install Bootloader
                </button>
                <input type="text"
                    value={ this.state.btl_id }
                    onChange={event => this.bootloaderIdChange(event.target.value)}
                    placeholder="Scan Device ID ...">
                </input>                 
          </div>
          { this.renderFlashImageButton() }
          { this.renderApplicationButton() }
          <div className="column">
            <button className="ui compact blue labeled icon button" onClick={this.props.onPrintLabel} >
              <i className="search icon"></i>
              Print Label
            </button>
          </div>
          <div className="column">
            <button className="ui compact blue labeled icon button" onClick={this.props.onAssembleProduct} >
              <i className="search icon"></i>
              Assemble Product
            </button>
          </div>          
        </div>
      </div>
    );
  }
}



function mapDispatchToProps(dispatch){
  return bindActionCreators({fetchBootloader, setBootloader}, dispatch);
}

export default connect(null,mapDispatchToProps)(BootloaderSearch);