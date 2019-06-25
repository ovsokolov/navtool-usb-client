import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';



class Diagnostic extends Component {
  constructor(props){
    super(props);
    this.state = {
      canFilter: ''
    }
    this.setFilter = this.setFilter.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    ////console.log("in list", this.state.mfg_id);
  }

  setFilter(event){
    console.log("inside setFilter", event.target.value);
    //this.props.onSelectVehicleMake(event.target.value);
  }

  onFilterChange(event){
    console.log(event.target.value);
    this.setState({canFilter: event.target.value});
    console.log(this.state);
  }

  renderCarMake(carMake, index){
    //console.log(carMake);
    return (
      <option key={carMake.vehicle_make}
              value={carMake.make_id}
      >
      {carMake.vehicle_make}
      </option>
    );
  }

  render(){
    return (
        <div>
          <div className="ui grid">
            <div className="sixteen wide column">
              <div className="ui input">
                <input type="text"
                  value={ this.state.canFilter }
                  onChange={this.onFilterChange}
                  placeholder="CAN ID...">
                </input>
                &nbsp;
                <button className="ui compact red button" onClick={this.setFilter} >
                  Set Filter
                </button>
              </div>
            </div>
          </div>
          <div className="sixteen wide column">&nbsp;</div>
          <div className="container">
              <textarea></textarea>
          </div>
        </div>
    );
  }
}


function mapStateToProps(state){
  return { car_make: state.car_make };
}


export default connect(mapStateToProps)(Diagnostic);