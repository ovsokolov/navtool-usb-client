import { FETCH_MODEL } from '../actions/get_model';

export default function(state = [{"id":null,"vehicle_model":"Please Select..."}], action){
  switch (action.type){
    case FETCH_MODEL:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      console.log('Action recieved', FETCH_MODEL);
      console.log(action.payload);
      return [{"id":null,"vehicle_model":"Please Select..."}, ...action.payload.data];
  }
  return state;
}