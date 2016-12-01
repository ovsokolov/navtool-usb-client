import React, { Component} from 'react';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchMake } from '../actions/get_make';

class SearchMake extends Component {
  constructor(props){
    super(props);
    this.state = {mfg_id: ''};
    this.searchMake = this.searchMake.bind(this);
  }



  searchMake(){
    console.log("inside searchMake");

    this.props.fetchMake(this.state.mfg_id);
  }

  render(){
    return (
      <div className="container-fluid">
        <span className="input-group-btn">
          <button onClick={this.searchMake} className="mui-btn mui-btn--danger">Search Make</button>
        </span>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({fetchMake}, dispatch);
}

export default connect(null,mapDispatchToProps)(SearchMake);
