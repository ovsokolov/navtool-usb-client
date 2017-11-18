import React, { Component} from 'react';



export default class ModalMessage extends Component {

  constructor(props){
    super(props);
    this.renderMessage = this.renderMessage.bind(this);
  }

  renderMessage(){
    if (this.props.display_message.length > 0) {
      return (
        <div>
          <i className={`red info icon`}></i>
          { this.props.show_flush == true &&
            <span className="blink_me">{this.props.display_message}</span>
          }
          { this.props.show_flush == false &&
            <span>{this.props.display_message}</span>
          }
        </div>
      );
    }
  }


  render(){
    return (
      <div>
        { this.renderMessage() }
      </div>
    );
  }
}