import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';



class CarModelList extends Component {
  constructor(props){
    super(props);
    this.selectModel = this.selectModel.bind(this);
  }

  selectModel(event){
    console.log("inside selectModel", event.target.value);
    this.props.onSelectVehicleModel(event.target.value);
  }

  renderCarModel(carModel, index){
    console.log(carModel);
    return (
      <option key={carModel.model_id}
              value={carModel.model_id}
      >
      {carModel.vehicle_model}
      </option>
    );
  }

  render(){
    return (
        <select onChange={this.selectModel}>
          { this.props.car_model.list.map(this.renderCarModel) }
        </select>
    );
  }
}


function mapStateToProps(state){
  return { car_model: state.car_model};
}


export default connect(mapStateToProps)(CarModelList);
