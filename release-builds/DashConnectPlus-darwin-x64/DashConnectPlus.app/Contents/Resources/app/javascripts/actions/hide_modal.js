export const HIDE_MODAL = 'HIDE_MODAL';

export function hideModal(hide){
  return {
    type: HIDE_MODAL,
    payload: hide
  };
}