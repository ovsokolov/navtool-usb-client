import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { SET_CAN_FILTER, SET_CAN_FILTER_SUCCESS, CAN_FILTER_NOT_SET } from '../actions/hid_action';



class Diagnostic extends Component {
  constructor(props){
    super(props);
    this.state = {
      canFilter: ''
    }
    this.setFilter = this.setFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.renderFilterStatus = this.renderFilterStatus.bind(this);
    this.renderFilterValue = this.renderFilterValue.bind(this);
    this.convertToHex = this.convertToHex.bind(this);
    this.getFilterData =  this.getFilterData.bind(this);
    this.renderFilterDataResult = this.renderFilterDataResult.bind(this);
    this.clearFilterResult = this.clearFilterResult.bind(this);
    ////console.log("in list", this.state.mfg_id);
  }

  setFilter(){
    this.props.onSetFilter(this.state.canFilter);
  }

  clearFilter(){
    this.props.onClearFilter();
  }

  getFilterData(){
    this.props.onGetFilterData();
  }

  onFilterChange(event){
    console.log(event.target.value);
    this.setState({canFilter: event.target.value});
    console.log("inside onFilterChange", this.state);
  }

  clearFilterResult(){
    this.props.onClearFilterResult();
  }


  renderFilterStatus(){
    if(this.props.can_filter.filter_status == CAN_FILTER_NOT_SET){
      return (
          <div id="can-filter-pane">
            Filter Not Set
          </div>  
      );
    }else{
      return (
          <div id="can-filter-pane">
            Filter Set: { this.renderFilterValue(this.props.can_filter.filter_data) }
          </div>  
      );
    }   
  }

  renderFilterDataResult(elem, index){
      console.log('renderFilterDataResult');
      console.log(this.props.can_filter.filter_result.join(' '));
      return (
        <div id="can-filter-data-pane">
          { elem.map(this.convertToHex).join(' ') }
        </div>
      );    
  }

  renderFilterValue(filterValue){
    return filterValue.map(this.convertToHex).join(' ').toUpperCase();
  }

  convertToHex(num){
    let hexStringFrmt = "00";
    let bareNum = num.toString(16);
    let hexNum = "0x" + hexStringFrmt.substring((bareNum).length, 2) + bareNum;
    return hexNum.toUpperCase();
  }

  render(){
    return (
        <div>
          <div className="ui grid">
            <div className="sixteen wide column">
              <div className="ui input">
                <input type="text"
                  value={ this.state.canFilter }
                  onChange={this.onFilterChange}
                  placeholder="CAN ID...">
                </input>
                &nbsp;
                <button className="ui compact blue button" onClick={this.setFilter} >
                  Set Filter
                </button>
                &nbsp;
                <button className="ui compact red button" onClick={this.clearFilter} >
                  Clear Filter
                </button>
              </div>
            </div>
            <div className="sixteen wide column">
              { this.renderFilterStatus() }
            </div>
            <div className="sixteen wide column">
                <button className="ui compact blue button" onClick={this.getFilterData} >
                  Get Filter Data
                </button>
                &nbsp;
                <button className="ui compact red button" onClick={this.clearFilterResult} >
                  Clear Filter Result
                </button>
            </div>
          </div>
          <div className="sixteen wide column">&nbsp;</div>
          <div className="container">
            { this.props.can_filter.filter_result.map( (elem, index) => {return this.renderFilterDataResult(elem,index)})} 
          </div>
        </div>
    );
  }
}


function mapStateToProps(state){
  return { can_filter: state.can_filter };
}


export default connect(mapStateToProps)(Diagnostic);