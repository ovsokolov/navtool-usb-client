import { ORDERS_LIST, SINGLE_ORDER } from '../actions/ecommerce';


export default function(state = [], action){
  switch (action.type){
    case ORDERS_LIST:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      if(Array.isArray(action.payload))
      	return action.payload;
      else
      	return [action.payload];
    case SINGLE_ORDER:
      return [action.payload];

  }
  return state;
}