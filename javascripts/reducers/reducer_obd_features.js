import { OBD_FEATURES } from '../utils/structures';
import { FETCH_DEVICE_DB_DATA } from '../actions/get_device_data';
import { FETCH_OBD_CONFIG } from '../actions/get_obdconfig';
import { DEVICE_REMOVED } from '../actions/hid_action';



export default function(state = JSON.parse(JSON.stringify(OBD_FEATURES)), action){
	let result = {};
	switch (action.type){
		case FETCH_DEVICE_DB_DATA:
		  //return state.concat([ action.payload.data ]);
		  //or (same crete new array). NEVER!!!!! mutate array
		  	result = Object.assign({}, state);
		  	console.log("############# FETCH_DEVICE_DB_DATA~OBD REDUCER");
		  	console.log(action.payload);
		  	result.obd_expired = convertMySQLDate(action.payload.sw_feature_exp_date);
		  	result.obd_count = action.payload.sw_feature_cnt;
		  	console.log(result);
			return result;
		case FETCH_OBD_CONFIG:
			//console.log("############# FETCH_OBD_CONFIG~~OBD REDUCER");
			result = Object.assign({}, state);
			result.obd_enabled = true;
			action.payload.forEach( function (arrayItem)
			{
			    var label_name = 'obd_label_idx' + arrayItem.label_idx;;
			    result[label_name] = arrayItem.label_desc;
			});
			//console.log(result);
			return result;
		case DEVICE_REMOVED:
		  return JSON.parse(JSON.stringify(OBD_FEATURES));
	}
  	return state;
}

function convertMySQLDate(mysql_string){
	var t, result = null;

   if( typeof mysql_string === 'string' )
   {
		var formated_date = mysql_string.replace('T',' ');
		t = formated_date.split(/[- :]/);
		//console.log('convertMySQLDate');
		//console.log(formated_date);
		//console.log(t);
		result = new Date(t[0], t[1] - 1, t[2]);          
   }else{
   		result = new Date('1990', '11', '31');
   }
   return result; 
}