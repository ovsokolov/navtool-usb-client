import React, { Component} from 'react';
import { connect} from 'react-redux';

var MdInfoOutline = require('react-icons/lib/md/info-outline');

class Messages extends Component {
  constructor(props){
    super(props);
    this.renderMessage = this.renderMessage.bind(this);
  }

  renderMessage(){
    if (this.props.message.length > 0) {
      return (
          <div className="mui-row">
            <div className="mui-col-xs-4">
              <MdInfoOutline color='red' size={30} />
            </div>
            <div className="mui-col-xs-8">
              <div className="mui--text-light mui--text-left mui--text-title">
                { this.props.message }
              </div>
            </div>
          </div>
      );
    }
  }

  render(){
    return (
        <div style={{backgroundColor: '#1976D2'}}>
            <div className="mui--text-light mui--text-center mui--text-title">
                { this.renderMessage() }
            </div>
        </div>
    );
  }
}

function mapStateToProps(state){
  return { message: state.message };
}

export default connect(mapStateToProps)(Messages);
