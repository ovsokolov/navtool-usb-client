import { SYSTEM_SETTINGS } from '../utils/structures';
import { DEVICE_DATA_SETTINGS, DEVICE_REMOVED } from '../actions/hid_action';

export default function(state = JSON.parse(JSON.stringify(SYSTEM_SETTINGS)), action){
  switch (action.type){
    case DEVICE_DATA_SETTINGS:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      console.log('Action recieved', DEVICE_DATA_SETTINGS);
      console.log(action.payload);
      let msg = action.payload;
      let action = msg[0];
      let usbResult = msg[1];
      let serial_number = ""
      let hexStringFrmt = "00"
      let binaryStringFrmt = "00000000"
      let softwareId = ""; //[19][18]
      let softwareBuild = ""; //[20]
      let bareNum;
      for (var i = 0; i < 16; i++) {
        if (i % 4 == 0 && i > 0) {
          serial_number += "-";
        }
        bareNum = msg[2+i].toString(16);
        serial_number += hexStringFrmt.substring((bareNum).length, 2) + bareNum;
      }
      serial_number = serial_number.toUpperCase();
      console.log("Serial Number",serial_number);
      //build software id (reverse 2 bytes)
      //for(var i=0; i < 2; i++){
      //  bareNum = msg[19-i].toString(10);
      //  softwareId += hexStringFrmt.substring((bareNum).length, 2) + bareNum;

      //}
      for(var i=0; i < 2; i++){
        console.log(msg[19-i]);
        bareNum = msg[19-i].toString(16);
        softwareId += hexStringFrmt.substring((bareNum).length, 2) + bareNum;
        console.log(softwareId);

      }
      console.log("Software Id",softwareId);
      console.log("Software Id",parseInt(softwareId,16));
      //build siftwareBuild
      bareNum = msg[20].toString(10);
      softwareBuild += hexStringFrmt.substring((bareNum).length, 2) + bareNum;
      console.log("Software Build",softwareBuild);

      //get system settings
      let system_settings = JSON.parse(JSON.stringify(SYSTEM_SETTINGS));
      console.log("System Settings Byte 1", binaryStringFrmt.substring((msg[21].toString(2)).length, 8) + msg[21].toString(2));
      let byte_1 = binaryStringFrmt.substring((msg[21].toString(2)).length, 8) + msg[21].toString(2);
      console.log("System Settings Byte 2", binaryStringFrmt.substring((msg[22].toString(2)).length, 8) + msg[22].toString(2));
      let byte_2 = binaryStringFrmt.substring((msg[22].toString(2)).length, 8) + msg[22].toString(2);
      console.log("System Settings Byte 3", binaryStringFrmt.substring((msg[23].toString(2)).length, 8) + msg[23].toString(2));
      let byte_3 = binaryStringFrmt.substring((msg[23].toString(2)).length, 8) + msg[23].toString(2);
      console.log("System Settings Byte 4", binaryStringFrmt.substring((msg[24].toString(2)).length, 8) + msg[24].toString(2));
      let byte_4 = binaryStringFrmt.substring((msg[24].toString(2)).length, 8) + msg[24].toString(2);


      //byte 1
      system_settings["SoundSupported"] = byte_1.substring(7,8);
      system_settings["ObdSupported"] = byte_1.substring(6,7);
      system_settings["ConfigSupported"] = byte_1.substring(5,6);
      system_settings["RearCameraSupported"] = byte_1.substring(4,5);
      system_settings["FrontCameraSupported"] = byte_1.substring(3,4);
      system_settings["LeftCameraSupported"] = byte_1.substring(2,3);
      system_settings["RightCameraSupported"] = byte_1.substring(1,2);
      system_settings["ReservedSupported"] = byte_1.substring(0,1);
      //byte_2
      system_settings["SoundEnabled"] = byte_2.substring(7,8);
      system_settings["RearCameraEnabled"] = byte_2.substring(6,7);
      system_settings["FrontCameraEnabled"] = byte_2.substring(5,6);
      system_settings["LeftCameraEnabled"] = byte_2.substring(4,5);
      system_settings["RightCameraEnabled"] = byte_2.substring(3,4);
      system_settings["FactoryRearCamera"] = byte_2.substring(2,3);
      system_settings["FactoryFrontCamera"] = byte_2.substring(1,2);
      system_settings["FactoryLeftCamera"] = byte_2.substring(0,1);
      //byte_3;
      system_settings["HDMIEnabled"] = byte_3.substring(7,8);
      system_settings["RGBEnabled"] = byte_3.substring(6,7);
      system_settings["Input1Enabled"] = byte_3.substring(5,6);
      system_settings["Input2Enabled"] = byte_3.substring(4,5);
      system_settings["Input3Enabled"] = byte_3.substring(3,4);
      system_settings["Input4Enabled"] = byte_3.substring(2,3);
      system_settings["NotUsed"] = byte_3.substring(0,2);
      //byte_4;
      system_settings["FactoryRightCamera"] = byte_4.substring(7,8);
      system_settings["FrontCameraMode"] = byte_4.substring(5,7);
      system_settings["SideCameraMode"] = byte_4.substring(2,5);
      system_settings["ResrvedBits"] = byte_4.substring(0,2);
      var vihicleMake = "";
      var vihicleModel = "";
      for (var i = 0; i < msg[57]; i++) {
        vihicleMake += String.fromCharCode(msg[29+i]);
      }
      for (var i = 0; i < msg[58]; i++) {
        vihicleModel += String.fromCharCode(msg[43+i]);
      }
      console.log(vihicleMake);
      console.log(vihicleModel);
      for (var i = 0; i < 14; i++) {
        console.log(vihicleModel.charCodeAt(i));
      }
      return system_settings;
    case DEVICE_REMOVED:
      return JSON.parse(JSON.stringify(SYSTEM_SETTINGS));
  }
  return state;
}