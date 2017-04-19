import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';



class CarYearList extends Component {
  constructor(props){
    super(props);
    this.selectYear = this.selectYear.bind(this);
    //console.log("in list", this.state.mfg_id);
  }

  selectYear(event){
    console.log("inside selectYear", event.target.value);
    this.props.onSelectVehicleYear(event.target.value);
  }

  renderCarYear(carYear, index){
    return (
      <option key={carYear.id}
              value={carYear.id}
      >
      {carYear.vehicle_year}
      </option>
    );
  }

  render(){
    return (
        <select onChange={this.selectYear}>
          { this.props.car_year.list.map(this.renderCarYear) }
        </select>
    );
  }
}


function mapStateToProps(state){
  return { car_year: state.car_year };
}


export default connect(mapStateToProps)(CarYearList);
