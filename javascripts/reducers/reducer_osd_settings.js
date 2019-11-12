import { OSD_SETTINGS } from '../utils/structures';
import { DEVICE_OSD_SETTINGS, DEVICE_REMOVED } from '../actions/hid_action';
import { DEVICE_NOT_SUPPORTED } from '../utils/device_utils';

export default function(state = JSON.parse(JSON.stringify(OSD_SETTINGS)), action){
  switch (action.type){
    case DEVICE_OSD_SETTINGS:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      //console.log('Action recieved', DEVICE_OSD_SETTINGS);
      //console.log(action.payload);
      console.log('reducer_osd_settings');
      let msg = action.payload;
      let hexStringFrmt = "00"
      let binaryStringFrmt = "00000000"
      let bareNum;



      //get system settings
      let osd_settings = JSON.parse(JSON.stringify(OSD_SETTINGS));

      osd_settings["osd_enabled"] = true;
      
      //console.log("OSD Settings Byte 1", binaryStringFrmt.substring((msg[5].toString(2)).length, 8) + msg[5].toString(2));
      let byte_1 = binaryStringFrmt.substring((msg[5].toString(2)).length, 8) + msg[5].toString(2);
      //console.log("OSD Settings Byte 2", binaryStringFrmt.substring((msg[6].toString(2)).length, 8) + msg[6].toString(2));
      let byte_2 = binaryStringFrmt.substring((msg[6].toString(2)).length, 8) + msg[6].toString(2);
      //console.log("OSD Settings Byte 3", binaryStringFrmt.substring((msg[7].toString(2)).length, 8) + msg[7].toString(2));
      let byte_3 = binaryStringFrmt.substring((msg[7].toString(2)).length, 8) + msg[7].toString(2);
      //console.log("OSD Settings Byte 4", binaryStringFrmt.substring((msg[8].toString(2)).length, 8) + msg[8].toString(2));
      let byte_4 = binaryStringFrmt.substring((msg[8].toString(2)).length, 8) + msg[8].toString(2);

            
      //byte 1
      osd_settings["OsdCVBS1"] = byte_1.substring(6,8);
      osd_settings["OsdCVBS2"] = byte_1.substring(4,6);
      osd_settings["OsdCVBS3"] = byte_1.substring(2,4);
      osd_settings["OsdCVBS4"] = byte_1.substring(0,2);

      //byte_2
      osd_settings["TextMenuHDMI"] = byte_2.substring(6,8);
      osd_settings["TextMenuRGB"] = byte_2.substring(4,6);
      osd_settings["TextMenuCh1"] = byte_2.substring(2,4);
      osd_settings["TextMenuCh2"] = byte_2.substring(0,2);

      //byte_3;
      osd_settings["TextMenuCh3"] = byte_3.substring(6,8);
      osd_settings["TextMenuCh4"] = byte_3.substring(4,6);
      osd_settings["Reserved2"] = byte_3.substring(0,4);

      //byte_4;
      osd_settings["Reserved3"] = byte_4;
      //console.log(osd_settings);
      return osd_settings;
    case DEVICE_REMOVED:
      return JSON.parse(JSON.stringify(OSD_SETTINGS));
    case DEVICE_NOT_SUPPORTED:
      return JSON.parse(JSON.stringify(OSD_SETTINGS));
  }
  return state;
}