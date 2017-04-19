import React, { Component } from 'react';
import Device from '../containers/device'
import Message from '../containers/messages'



export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {mfg_id: ''}
  }

  onChange(i, value, tab, ev) {
    console.log(arguments);
  }

  onActive(tab) {
    console.log(arguments);
  }

  render() {
    return (
      <div>
        <Message />
        <Device />
      </div>

    );
  }
}
