import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import { store } from '../utils/store_config'
import { Provider } from 'react-redux';


class Modal extends Component{
  constructor(props){
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal(){
    //this.props.onCloseModal();
    //ReactDOM.unmountComponentAtNode(this.modalTarget);
    //document.body.removeChild(this.modalTarget);
  }

  componentDidMount(){
    this.modalTarget = document.createElement('div');
    this.modalTarget.className = 'modal';
    document.body.appendChild(this.modalTarget);
    this._render();
  }

  componentWillUpdate(){
    this._render();
  }

  componentWillUnmount(){
    ReactDOM.unmountComponentAtNode(this.modalTarget);
    document.body.removeChild(this.modalTarget);
  }

  _render(){
    ReactDOM.render(
      <Provider store={store}>
        <div>
          <div>{this.props.children}</div>
          <button onClick={() => this.props.onCloseModal()} className="mui-btn mui-btn--primary">Close</button>
        </div>
      </Provider>,
      this.modalTarget
    );
  }

  render(){
    return <noscript />;
  }
}


export default Modal;
