import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchModel } from '../actions/get_model';



class CarMakeList extends Component {
  constructor(props){
    super(props);
    this.searchModel = this.searchModel.bind(this);
    //console.log("in list", this.state.mfg_id);
  }

  searchModel(event){
    console.log("inside searchModel", event.target.value);
    this.props.fetchModel("LG1161U", event.target.value);
  }

  renderCarMake(carMake, index){
    console.log(carMake);
    return (
      <option key={carMake.vehicle_make}
              value={carMake.vehicle_make}
      >
      {carMake.vehicle_make}
      </option>
    );
  }

  render(){
    return (
        <select onChange={this.searchModel}>
          { this.props.car_make.map(this.renderCarMake) }
        </select>
    );
  }
}


function mapStateToProps(state){ 
  return { car_make: state.car_make };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({fetchModel}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(CarMakeList);
