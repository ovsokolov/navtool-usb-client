import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { SET_CAN_FILTER, SET_CAN_FILTER_SUCCESS, CAN_FILTER_NOT_SET } from '../actions/hid_action';



class EventTest extends Component {
  constructor(props){
    super(props);
    this.state = {
      eventType: '',
      inputType: '0'
    }
    this.setTestEventFilter = this.setTestEventFilter.bind(this);
    this.setEventType = this.setEventType.bind(this);
    this.onVideoTypeChange = this.onVideoTypeChange.bind(this);
    ////console.log("in list", this.state.mfg_id);
  }

  setEventType(event){
    this.setState({eventType: event.target.value});
    console.log("inside setEventType", this.state.eventType);
  }

  setTestEventFilter(){
     console.log("inside setFilter", this.state);
    this.props.onSetTestEvent(this.state.eventType, this.state.inputType);
  }

  onVideoTypeChange(checked, value){
    console.log(checked);
    console.log(value);
    this.setState({inputType: value});
    //console.log(name);
  }  


  render(){
    return (
        <div>
          <div className="ui grid">
            <div className="sixteen wide column">
              <div className="ui input">
                <div className="inline field">
                    <select onChange={this.setEventType} id='eventtype' className="ui dropdown">
                        <option key="" value="" data-name="SELECT_EVENT">Select Event....</option>
                        <option key="0" value="0" data-name="EVENT_MAIN_SW_SHORT">EVENT_MAIN_SW_SHORT</option>
                        <option key="1" value="1" data-name="EVENT_MAIN_SW_LONG">EVENT_MAIN_SW_LONG</option>
                        <option key="2" value="2" data-name="EVENT_MAIN_SW_ON">EVENT_MAIN_SW_ON</option>
                        <option key="3" value="3" data-name="EVENT_MAIN_SW_OFF">EVENT_MAIN_SW_OFF</option>
                        <option key="4" value="4" data-name="EVENT_GB_REVERSE">EVENT_GB_REVERSE</option>
                        <option key="5" value="5" data-name="EVENT_GB_DRIVE">EVENT_GB_DRIVE</option>
                        <option key="6" value="6" data-name="EVENT_GB_PARK">EVENT_GB_PARK</option>
                        <option key="7" value="7" data-name="EVENT_TURN_LEFT">EVENT_TURN_LEFT</option>
                        <option key="8" value="8" data-name="EVENT_TURN_RIGHT">EVENT_TURN_RIGHT</option>
                        <option key="9" value="9" data-name="EVENT_TURN_OFF">EVENT_TURN_OFF</option>
                        <option key="10" value="10" data-name="EVENT_SPEED_LIMIT_ON">EVENT_SPEED_LIMIT_ON</option>
                        <option key="11" value="11" data-name="EVENT_SPEED_LIMIT_OFF">EVENT_SPEED_LIMIT_OFF</option>
                        <option key="12" value="12" data-name="EVENT_HDMI_DISCONNECT">EVENT_HDMI_DISCONNECT</option>
                        <option key="13" value="13" data-name="EVENT_INPUT_SELECT">EVENT_INPUT_SELECT</option>
                        <option key="14" value="14" data-name="EVENT_PHONE_DISCONNECT">EVENT_PHONE_DISCONNECT</option>
                        <option key="15" value="15" data-name="EVENT_PHONE_INCOMING_CALL">EVENT_PHONE_INCOMING_CALL</option>
                        <option key="16" value="16" data-name="EVENT_PHONE_HANG_UP">EVENT_PHONE_HANG_UP</option>
                    </select> 
                    <div className="inline field">
                          <input type="radio"
                                 name="VIN_INPUT"
                                 value="1"                      
                                 onChange={event => this.onVideoTypeChange(event.target.checked, event.target.value)}
                          />
                          <div className="ui left pointing label">
                            Phone
                          </div>                        
                    </div>
                    <div className="inline field">
                          <input type="radio"
                                 name="VIN_INPUT"
                                 value="2"                      
                                 onChange={event => this.onVideoTypeChange(event.target.checked, event.target.value)}
                          />
                          <div className="ui left pointing label">
                            HDMI
                          </div>                        
                    </div>
                    <div className="inline field">
                          <input type="radio"
                                 name="VIN_INPUT"
                                 value="3"                      
                                 onChange={event => this.onVideoTypeChange(event.target.checked, event.target.value)}
                          />
                          <div className="ui left pointing label">
                            CVBS 1
                          </div>                        
                    </div>  
                    <div className="inline field">
                          <input type="radio"
                                 name="VIN_INPUT"
                                 value="4"                      
                                 onChange={event => this.onVideoTypeChange(event.target.checked, event.target.value)}
                          />
                          <div className="ui left pointing label">
                            CVBS 2
                          </div>                        
                    </div>  
                    <div className="inline field">
                          <input type="radio"
                                 name="VIN_INPUT"
                                 value="5"                      
                                 onChange={event => this.onVideoTypeChange(event.target.checked, event.target.value)}
                          />
                          <div className="ui left pointing label">
                            CVBS 3
                          </div>                        
                    </div>  
                    <div className="inline field">
                          <input type="radio"
                                 name="VIN_INPUT"
                                 value="6"                      
                                 onChange={event => this.onVideoTypeChange(event.target.checked, event.target.value)}
                          />
                          <div className="ui left pointing label">
                            CVBS 4
                          </div>                        
                    </div>                                                                                                      
                </div>
                <button className="ui compact blue button" onClick={this.setTestEventFilter} >
                  Send Event
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  }
}


function mapStateToProps(state){
  return { can_filter: state.can_filter };
}


export default connect(mapStateToProps)(EventTest);