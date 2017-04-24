import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { TRANSMISSION_TYPE_DROPDOWN } from '../utils/structures';



class TransmissionOptionList extends Component {
  constructor(props){
    super(props);
    this.selectTransmissionOption = this.selectTransmissionOption.bind(this);
    //console.log("in list", this.state.mfg_id);
  }

  selectTransmissionOption(event){
    console.log("inside selectTransmissionOption", event.target.value);
    this.props.onSelectTransmissionOption(event.target.value);
  }

  renderTransmissionOption(option, index){
    console.log(option);
    return (
      <option key={option.key}
              value={option.value}
      >
        {option.label}
      </option>
    );
  }

  render(){
    return (
        <select className="ui dropdown" onChange={this.selectTransmissionOption}>
          { TRANSMISSION_TYPE_DROPDOWN["values"].map(this.renderTransmissionOption) }
        </select>
    );
  }
}


function mapStateToProps(state){
  return { software_search: state.software_search };
}


export default connect(mapStateToProps)(TransmissionOptionList);
