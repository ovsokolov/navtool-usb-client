import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { getStatusList, getOrdersByStatus, getOrderItmes, searchOrder, setSelectedOrder } from '../../actions/ecommerce';
import OrderList from './order_list';



class OrderStatusList extends Component {
  constructor(props){
    super(props);
    this.state = {
      orderNumber: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.searchOrder = this.searchOrder.bind(this)
    this.loadOrdersByStatus = this.loadOrdersByStatus.bind(this)
    this.setSelectedOrder = this.setSelectedOrder.bind(this)
    
  }

  componentDidMount(){
    console.log('componentDidMount OrderStatusList');
    this.props.getStatusList();
  }

  renderOrderStatus(orderStatus, index){
    //console.log(orderStatus['@order_status_id']);
    
    return (
      <option key={orderStatus['@order_status_id']}
              value={orderStatus['@order_status_id']}
      >
      {orderStatus.name}
      </option>
    );
  }

  setSelectedOrder(orderNumber){
    console.log("inside setSelectedOrder ", orderNumber);
    console.log(this.props.order_list)
    var selectedOrder = this.props.order_list.filter(item  => item['@order_number'] == orderNumber );
    console.log(selectedOrder);
    this.props.setSelectedOrder(selectedOrder[0]);
  }

  searchOrder(){
    console.log("searchOrder");
    this.props.searchOrder(this.state.orderNumber);
  }

  loadOrdersByStatus(event){
    console.log("loadOrdersByStatus");
    this.props.getOrdersByStatus(event.target.value);   
  }


  handleInputChange(event){
    const saveValue = event.target.value;
    this.setState({
        orderNumber: saveValue 
    });
    console.log(saveValue);
  }


  render(){
    return (
        <div>
          <div className="ui grid">
            <div className="eight wide column">
              <select className="ui dropdown" onChange={this.loadOrdersByStatus}>
                { this.props.status_list.list.map(this.renderOrderStatus) }
              </select>
            </div>
            <div className="eight wide column">
              <div className="ui input">
                <input type="text"
                  value={ this.state.orderNumber }
                  onChange={ this.handleInputChange}
                  placeholder="Order Number...">
                </input>
                &nbsp;
                <button className="ui compact red button" onClick={this.searchOrder} >
                  Searh Orders
                </button>
              </div>
            </div>
          </div>
          <div className="sixteen wide column">&nbsp;</div>
          <div className="container">
              <OrderList 
                onSelectOrder={this.setSelectedOrder}/>
          </div>
        </div>
    );
  }
}

function mapStateToProps(state){
  return { 
    status_list: state.status_list,
    order_list: state.order_list 
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({getStatusList, getOrdersByStatus, getOrderItmes, searchOrder, setSelectedOrder}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(OrderStatusList);