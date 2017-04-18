import React, { Component} from 'react';



export default class ProgrammingProgress extends Component {

  constructor(props){
    super(props);
  }



  render(){
    return (
      <div>
        <div className="ui segment modal-progress">
          <div className="ui active dimmer">
            <div className="ui mini text loader">Programming</div>
          </div>
          <p></p>
        </div>
      </div>
    );
  }
}