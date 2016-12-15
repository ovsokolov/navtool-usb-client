export const FETCH_YEAR = 'FETCH_YEAR';
export const SET_YEAR = 'SET_YEAR';

export function fetchYear(mfg_id, vehicle_make, vehicle_model){
  console.log('params: ', mfg_id, vehicle_make, vehicle_model);

  return (dispatch) => {
      let payload_data = {mfg_id, vehicle_make, vehicle_model};
      dispatch( { type: FETCH_YEAR, payload: payload_data } );
  };
}

export function setYear(vehicle_year){
  return {
    type: SET_YEAR,
    payload: vehicle_year
  };
}
