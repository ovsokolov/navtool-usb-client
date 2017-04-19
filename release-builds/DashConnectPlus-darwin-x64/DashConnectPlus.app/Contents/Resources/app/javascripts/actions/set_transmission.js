export const SET_TRANSMISSION_TYPE = 'SET_TRANSMISSION_TYPE';

export function setTransmissionType(type){
  return {
    type: SET_TRANSMISSION_TYPE,
    payload: type
  };
}
