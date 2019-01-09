import axios from 'axios';
import { parseString } from 'xml2js';
import { ECOMMERCE_URL } from '../utils/constants';
import { GET_ORDDERS } from  '../utils/soap_xml';

export const TEST_XXXX = 'TEST_XXXX';

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