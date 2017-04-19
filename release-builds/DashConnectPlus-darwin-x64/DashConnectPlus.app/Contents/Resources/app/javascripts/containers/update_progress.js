import React, { Component} from 'react';



export default class UpdateProgress extends Component {

  constructor(props){
    super(props);
    this.state = {progress: 0};
    this.renderProgreesBar = this.renderProgreesBar.bind(this);
    this.progressUpdate = this.progressUpdate.bind(this);

  }

  progressUpdate(){
    var total = this.props.progress_status.file_size;
    var current = this.props.progress_status.current_position;
    var progress = Math.round((current * 100)/total);
    if(progress < 100 && this.state.progress < progress){
      console.log("incement");
      this.setState({progress});
      $('#example1').progress('increment');
    }
  }

  renderProgreesBar(){
    var total = this.props.progress_status.file_size;
    var current = this.props.progress_status.current_position;
    var progress = Math.round((current * 100)/total);
    if(progress >= 100){
      progress = 99;
    }
    return (
      <div>
          <div className="ui teal progress" data-value="1" data-total="100" id="example1">
            <div className="bar"></div>
            <div className="label">{progress}% Percent</div>
          </div>
      </div>
    );
  }


  render(){
    return (
      <div>
          {this.renderProgreesBar()}
          {this.progressUpdate()}
      </div>
    );
  }
}
