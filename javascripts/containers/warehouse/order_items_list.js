import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { returnToList } from '../../actions/ecommerce';

class OrderItemsList extends Component {

  constructor(props){
    super(props);
    this.renderItems = this.renderItems.bind(this)

  }

  renderItems(itemsList){
  }


  render(){
    let items;
    if(Array.isArray(this.props.order_items.invoice.line_item_list)){
      items = this.props.order_items.invoice.line_item_list.map(function(item){
        return  <p key={item.product_id}>{item.name} ({item.part_number})</p>;
      });
    }else{
      let item = this.props.order_items.invoice.line_item_list;
      items =  <p key={item.product_id}>{item.name} ({item.part_number})</p>;
    }
    return (
      <div>
          <p>Order Items List</p>
            { items }
          <div className="four wide column">
                <button className="ui compact blue button" onClick={this.props.returnToList} >
                  Complete
                </button>
          </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return { order_items: state.order_items };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({returnToList}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(OrderItemsList);