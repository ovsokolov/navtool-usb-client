import React, { Component } from 'react';
import { Router, Route } from "react-router-dom";
import OrderStatusList from '../containers/warehouse/order_status_list'
import OrderItemsList from '../containers/warehouse/order_items_list'
import history from '../history'


export default class App extends Component {


  constructor(props){
    super(props);
  }

  onChange(i, value, tab, ev) {
    //console.log(arguments);
  }

  onActive(tab) {
    //console.log(arguments);
  }

  render() {
    return (
      <div className="ui container">
        <Router history={history}>
          <div>
            <Route path="/" exact component={OrderStatusList} />
            <Route path="/order_items" exact component={OrderItemsList} />
          </div>
        </Router>
      </div>
    );
  }
}