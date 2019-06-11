import { SET_SELECTED_ORDER } from '../actions/ecommerce';


export default function(state = {} , action){
  switch (action.type){
    case SET_SELECTED_ORDER:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      	return action.payload;
  }
  return state;
}