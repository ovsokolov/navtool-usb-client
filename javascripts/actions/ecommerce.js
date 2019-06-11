import axios from 'axios';
import { parseString } from 'xml2js';
import { ECOMMERCE_URL } from '../utils/constants';
import { GET_ORDDERS } from  '../utils/soap_xml';
import { WEB_SERVICES_URL } from '../utils/constants';
import history from '../history'

//const ROOT_URL = "https://tranquil-mesa-29755.herokuapp.com/navtoolsws/make";

export const ORDERS_LIST = 'ORDERS_LIST';
export const ORDER_STATUS_LIST = 'ORDER_STATUS_LIST';
export const SINGLE_ORDER = 'SINGLE_ORDER'
export const SET_SELECTED_ORDER = 'SET_SELECTED_ORDER'
/*
export function getOrders(){
  const url = ECOMMERCE_URL;
  const headers = {
            'Content-Type': 'text/xml'
        };
  const xml = GET_ORDDERS;
  const request = axios.post(url, xml, {headers: headers});

  console.log(xml);

  console.log('#### getting Orderes');

  return (dispatch) => {
    request.then( ({data}) =>{
      let payload_data = data;
      parseString(payload_data, {trim: true}, function (err, result) {
        console.log(result['soap:Envelope']['soap:Body'][0]['ReadOrderResponse'][0]['OrderList'][0]['$'].OrderNumber);
        dispatch( { type: TEST_XXXX, payload: ''} );
      });
    })
    .catch(error => {
      console.log("+++++++++++orders error");
      console.log(error)
    });
  };

}
*/

export function getOrdersByStatus(status){
  const url = WEB_SERVICES_URL + "/orders?status=" + status;;
  const request = axios.get(url);

  console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      console.log(data.read_order_response.order_list);
      dispatch( { type: ORDERS_LIST, payload: data.read_order_response.order_list } );
    });
  };
}

export function getStatusList(){
  const url = WEB_SERVICES_URL + "/status_list";
  const request = axios.get(url);

  console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      console.log(data.read_order_status_response.order_status_list);
      dispatch( { type: ORDER_STATUS_LIST, payload: data.read_order_status_response.order_status_list } );
    });
  };
}


export function getOrderItmes(orderNumber){
  console.log(orderNumber);
  const url = WEB_SERVICES_URL + "/order?order_no=" + orderNumber;
  const request = axios.get(url);

  console.log('URL', url);
  return (dispatch) => {
    request.then( ({data}) =>{
      dispatch( { type: SINGLE_ORDER, payload: data.read_order_response.order_list } );
      history.push('order_items');
    });
  };
}

export function setSelectedOrder(order){
  console.log('in selectedOrder');
  return (dispatch) => {
      dispatch( { type: SET_SELECTED_ORDER, payload: order } );
      history.push('order_items');
  };
}

export function returnToList(){
    history.push('/');
}


export function searchOrder(orderNumber){
  const url = WEB_SERVICES_URL + "/order?order_no=" + orderNumber;
  const request = axios.get(url);

  console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      console.log(data.read_order_response.order_list);
      dispatch( { type: SINGLE_ORDER, payload: data.read_order_response.order_list } );
    });
  };
}