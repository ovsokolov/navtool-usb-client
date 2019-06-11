import { ORDER_STATUS_LIST } from '../actions/ecommerce';

const DEFAULT_DROPDOWN_VALUE = { '@order_status_id': 0, name:"Select Status..."};

export default function(state = {list: [DEFAULT_DROPDOWN_VALUE]}, action){
  switch (action.type){
    case ORDER_STATUS_LIST:
      console.log('reducer');
      console.log(action.payload);
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      return {list: [DEFAULT_DROPDOWN_VALUE, ...action.payload]};
  }
  return state;
}