import React, { Component} from 'react';
import { connect} from 'react-redux';



class OrderList extends Component {
  constructor(props){
    super(props);
    this.selectOrder = this.selectOrder.bind(this);
    this.renderSoftware = this.renderSoftware.bind(this);
  }

  selectOrder(value){
    console.log("inside selectOrder", value);
    this.props.onSelectOrder(value);
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
    console.log('in componentDidMount');
    var dataSet = [];

    //console.log(this.props.software_list);
    this.props.order_list.forEach(function(order){
      //var row = [software.id, software.sw_id,software.sw_build,software.vehicle_make,software.vehicle_model, "".concat(software.vehicle_year_from, "-", software.vehicle_year_to), software.sw_description];
      var row = [order['@order_number'],order.status.name, "".concat(order.customer.billing_address.first_name, " ", order.customer.billing_address.last_name)];
      dataSet.push(row);
     });
    var table = $('#order-list').DataTable( {
        bDestroy: true,
        bFilter: false,
        oLanguage: {
          sEmptyTable: "Click Search Button or Contact Technical Support"
        },
        columns: [
            { title: "ORDER NUMBER" },
            { title: "STATUS" },
            { title: "CUSTOMER NAME" },
            { title: "TEST" }
        ],
        data: dataSet,
        columnDefs: [{
          // puts a button in the last column
          targets: [-1], render: function (a, b, data, d) {
              console.log("render");
              console.log(data);
              return '<i class="red check icon"></i>';
          }
        }],
        order: [[ 0, "asc" ],[ 1, "asc" ]]
    } );

    $('#order-list tbody').off('click');
    $('#order-list tbody').on( 'click', 'tr', () => {
        if ( $(event.target.parentElement).hasClass('selected') ) {
            $(event.target.parentElement).removeClass('selected');
        }
        else {
            console.log(this);
            $('#order-list tr').removeClass('selected');
            //$(this).addClass('selected');
            $(event.target.parentElement).addClass('selected');
            var data = table.row(event.target.parentElement).data();
            this.selectOrder(data[0]);
        }
    } );
  }

  componentDidUpdate(nextProps){
    console.log('in componentDidUpdate');
    var dataSet = [];
    //console.log(this.props.software_list);
    this.props.order_list.forEach(function(order){
      //var row = [software.id, software.sw_id,software.sw_build,software.vehicle_make,software.vehicle_model, "".concat(software.vehicle_year_from, "-", software.vehicle_year_to), software.sw_description];
      var row = [order['@order_number'],order.status.name, "".concat(order.customer.billing_address.first_name, " ", order.customer.billing_address.last_name)];
      dataSet.push(row);
     });
    console.log("dataset");
    console.log(dataSet);
    var table = $('#order-list').DataTable( {
        bDestroy: true,
        bFilter: false,
        oLanguage: {
          sEmptyTable: "Click Search Button or Contact Technical Support"
        },
        data: dataSet,
        columnDefs: [{
          // puts a button in the last column
          targets: [-1], render: function (a, b, data, d) {
              console.log("render");
              console.log(data);
              return '<i class="red check icon"></i>';
          }
        }],
        order: [[ 0, "asc" ],[ 1, "asc" ]]
    } );

    $('#order-list tbody').off('click');
    $('#order-list tbody').on( 'click', 'tr', () => {
        if ( $(event.target.parentElement).hasClass('selected') ) {
            $(event.target.parentElement).removeClass('selected');
        }
        else {
            console.log(this);
            $('#order-list tr').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            var data = table.row(event.target.parentElement).data();
            this.selectOrder(data[0]);
        }
    }
    );
  }

  render(){
    return (
        <table id="order-list" className="display" cellSpacing="0" width="100%"></table>
    );
  }
}

function mapStateToProps(state){
  return { order_list: state.order_list };
}

export default connect(mapStateToProps)(OrderList);