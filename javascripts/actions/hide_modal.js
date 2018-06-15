const {ipcRenderer} = require('electron');

import { DOWNLOAD_TEAM_VIEWER } from '../utils/device_utils';
export const HIDE_MODAL = 'HIDE_MODAL';

export function hideModal(hide){
  return {
    type: HIDE_MODAL,
    payload: hide
  };
}

export function showDownloadTeamViewer(){
  return dispatch => {
    dispatch(handleTeamViewerOpen());
    dispatch({
	    type: DOWNLOAD_TEAM_VIEWER,
	    payload: false
    });
  };
}

export function handleTeamViewerOpen(){
    return dispatch => {
        ipcRenderer.on('teamviewer-opened',(event, data) => {
            dispatch({
			    type: HIDE_MODAL,
			    payload: true
            });
        });
    };
}