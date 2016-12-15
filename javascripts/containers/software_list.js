import React, { Component} from 'react';
import { connect} from 'react-redux';



class SoftwareList extends Component {
  constructor(props){
    super(props);
    this.selectSoftware = this.selectSoftware.bind(this);
    this.renderSoftware = this.renderSoftware.bind(this);
  }

  selectSoftware(event){
    console.log("inside selectSoftware", event.target.value);
    this.props.onSelectSoftware(event.target.value);
  }

  renderSoftware(software, index){
    console.log(software);
    return (
      <tr className="software-tr">
        <td className="software-td" style={{width: '3%'}}>
          <input type="radio"
                 key={software.id}
                 name="software_id"
                 value={software.id}
                 onChange={event => this.selectSoftware(event)}
                 />

        </td>
        <td className="software-td" style={{width: '15%'}}>{software.vehicle_make}</td>
        <td className="software-td" style={{width: '15%'}}>{software.vehicle_model}</td>
        <td className="software-td" style={{width: '20%'}}>{software.vehicle_year_from} - {software.vehicle_year_to}</td>
        <td className="software-td" style={{width: '47%'}}>{software.sw_description}</td>
      </tr>
    );
  }

  render(){
    return (
        <table className="mui-table mui-table--bordered software-table">
          <thead className="software-thead">
            <tr className="software-tr">
              <th className="software-th" style={{width: '3%'}}>&nbsp;</th>
              <th className="software-th" style={{width: '15%'}}>Make</th>
              <th className="software-th" style={{width: '15%'}}>Model</th>
              <th className="software-th" style={{width: '20%'}}>Year</th>
              <th className="software-th" style={{width: '47%'}}>Description</th>
            </tr>
          </thead>
          <tbody className="software-tbody">
            { this.props.software_list.map(this.renderSoftware) }
          </tbody>
        </table>

    );
  }
}

function mapStateToProps(state){
  return { software_list: state.software_list };
}

export default connect(mapStateToProps)(SoftwareList);
