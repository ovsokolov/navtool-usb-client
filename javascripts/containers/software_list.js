import React, { Component} from 'react';
import { connect} from 'react-redux';



class SoftwareList extends Component {
  constructor(props){
    super(props);
    this.selectSoftware = this.selectSoftware.bind(this);
    this.renderSoftware = this.renderSoftware.bind(this);
  }

  selectSoftware(value){
    //console.log("inside selectSoftware", value);
    this.props.onSelectSoftware(value);
  }

  renderSoftware(software, index){
    //console.log(software);
    return (
      <tr>
        <td>{software.id}</td>
        <td>{software.vehicle_make}</td>
        <td>{software.vehicle_model}</td>
        <td>{software.vehicle_year_from} - {software.vehicle_year_to}</td>
        <td>{software.sw_description}</td>
      </tr>
    );
  }

  componentDidMount(){
    var table = $('#software-list').DataTable( {
        bDestroy: true,
        bFilter: false,
        data: [],
        columns: [
            { title: "ID" },
            { title: "SW ID" },
            { title: "SW BUILD" },
            { title: "MAKE" },
            { title: "MODEL" },
            { title: "YEAR" },
            { title: "DESCRIPTION" }
        ]
    } );

    $('#software-list tbody').off('click');
    $('#software-list tbody').on( 'click', 'tr', function () {
        if ( $(event.target.parentElement).hasClass('selected') ) {
            $(event.target.parentElement).removeClass('selected');
        }
        else {
            $('#software-list tr').removeClass('selected');
            $(this).addClass('selected');
        }
    } );
  }

  componentDidUpdate(nextProps){
    var dataSet = [];
    //console.log(this.props.software_list);
    this.props.software_list.forEach(function(software){
      var row = [software.id, software.sw_id,software.sw_build,software.vehicle_make,software.vehicle_model, "".concat(software.vehicle_year_from, "-", software.vehicle_year_to), software.sw_description];
      dataSet.push(row);
     });
    //console.log(dataSet);
    var table = $('#software-list').DataTable( {
        bDestroy: true,
        bFilter: false,
        data: dataSet
    } );

    $('#software-list tbody').off('click');
    $('#software-list tbody').on( 'click', 'tr', () => {
        if ( $(event.target.parentElement).hasClass('selected') ) {
            $(event.target.parentElement).removeClass('selected');
        }
        else {
            $('#software-list tr').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            var data = table.row(event.target.parentElement).data();
            this.selectSoftware(data[0]);
        }
    }
    );
  }

  render(){
    return (
        <table id="software-list" className="display" cellSpacing="0" width="100%"></table>
    );
  }
}

function mapStateToProps(state){
  return { software_list: state.software_list };
}

export default connect(mapStateToProps)(SoftwareList);
