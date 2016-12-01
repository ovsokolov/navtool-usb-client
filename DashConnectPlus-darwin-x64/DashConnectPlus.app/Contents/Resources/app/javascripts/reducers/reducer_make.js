import { FETCH_MAKE } from '../actions/get_make';

export default function(state = [{"id":null,"vehicle_make":"Please Select..."}], action){
  switch (action.type){
    case FETCH_MAKE:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      console.log('Action recieved', FETCH_MAKE);
      console.log(action.payload);
      return [{"id":null,"vehicle_make":"Please Select..."}, ...action.payload];
  }
  return state;
}
