import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';



class CarMakeList extends Component {
  constructor(props){
    super(props);
    this.selectMake = this.selectMake.bind(this);
    ////console.log("in list", this.state.mfg_id);
  }

  selectMake(event){
    //console.log("inside searchModel", event.target.value);
    this.props.onSelectVehicleMake(event.target.value);
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
        <select className="ui dropdown" onChange={this.selectMake}>
          { this.props.car_make.list.map(this.renderCarMake) }
        </select>
    );
  }
}


function mapStateToProps(state){
  return { car_make: state.car_make };
}


export default connect(mapStateToProps)(CarMakeList);
