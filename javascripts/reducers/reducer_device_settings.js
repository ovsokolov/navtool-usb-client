import { SYSTEM_SETTINGS } from '../utils/structures';
import { DEVICE_DATA_SETTINGS, DEVICE_REMOVED } from '../actions/hid_action';
import { DEVICE_NOT_SUPPORTED } from '../utils/device_utils';

export default function(state = JSON.parse(JSON.stringify(SYSTEM_SETTINGS)), action){

  switch (action.type){
    case DEVICE_DATA_SETTINGS:
      //return state.concat([ action.payload.data ]);
      //or (same crete new array). NEVER!!!!! mutate array
      //console.log('Action recieved', DEVICE_DATA_SETTINGS);
      //console.log(action.payload);

      console.log('reducer_device_settings');

      let msg = action.payload;
      let zaction = msg[0];
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
        bareNum = msg[3+i].toString(16);
        serial_number += hexStringFrmt.substring((bareNum).length, 2) + bareNum;
      }
      serial_number = serial_number.toUpperCase();
      //console.log("Serial Number",serial_number);
      //build software id (reverse 2 bytes)
      //for(var i=0; i < 2; i++){
      //  bareNum = msg[19-i].toString(10);
      //  softwareId += hexStringFrmt.substring((bareNum).length, 2) + bareNum;

      //}
      for(var i=0; i < 2; i++){
        //console.log(msg[19-i]);
        bareNum = msg[20-i].toString(16);
        softwareId += hexStringFrmt.substring((bareNum).length, 2) + bareNum;
        //console.log(softwareId);

      }
      //console.log("Software Id",softwareId);
      //console.log("Software Id",parseInt(softwareId,16));
      //build siftwareBuild
      bareNum = msg[21].toString(10);
      softwareBuild += hexStringFrmt.substring((bareNum).length, 2) + bareNum;
      //console.log("Software Build",softwareBuild);

      //get system settings
      let system_settings = JSON.parse(JSON.stringify(SYSTEM_SETTINGS));
      //console.log("System Settings Byte 1", binaryStringFrmt.substring((msg[21].toString(2)).length, 8) + msg[21].toString(2));
      let byte_1 = binaryStringFrmt.substring((msg[21].toString(2)).length, 8) + msg[21].toString(2);
      //console.log("System Settings Byte 2", binaryStringFrmt.substring((msg[22].toString(2)).length, 8) + msg[22].toString(2));
      let byte_2 = binaryStringFrmt.substring((msg[22].toString(2)).length, 8) + msg[22].toString(2);
      //console.log("System Settings Byte 3", binaryStringFrmt.substring((msg[23].toString(2)).length, 8) + msg[23].toString(2));
      let byte_3 = binaryStringFrmt.substring((msg[23].toString(2)).length, 8) + msg[23].toString(2);
      //console.log("System Settings Byte 4", binaryStringFrmt.substring((msg[24].toString(2)).length, 8) + msg[24].toString(2));
      let byte_4 = binaryStringFrmt.substring((msg[24].toString(2)).length, 8) + msg[24].toString(2);
      //console.log("System Settings Byte 5", binaryStringFrmt.substring((msg[25].toString(2)).length, 8) + msg[25].toString(2));
      let byte_5 = binaryStringFrmt.substring((msg[25].toString(2)).length, 8) + msg[25].toString(2);
      //console.log("System Settings Byte 6", binaryStringFrmt.substring((msg[26].toString(2)).length, 8) + msg[26].toString(2));
      let byte_6 = binaryStringFrmt.substring((msg[26].toString(2)).length, 8) + msg[26].toString(2);
      //console.log("System Settings Byte 7", binaryStringFrmt.substring((msg[27].toString(2)).length, 8) + msg[27].toString(2));
      let byte_7 = binaryStringFrmt.substring((msg[27].toString(2)).length, 8) + msg[27].toString(2);
      //console.log("System Settings Byte 8", binaryStringFrmt.substring((msg[28].toString(2)).length, 8) + msg[28].toString(2));
      let byte_8 = binaryStringFrmt.substring((msg[28].toString(2)).length, 8) + msg[28].toString(2);

      console.log('Settings reducer XXXXXXXXXXXXXXXX');
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
      //byte 5
      system_settings["IsDefaultSettings"] = byte_5.substring(7,8);
      system_settings["VideoInputs"] = byte_5.substring(4,7);
      system_settings["VIMCapacity"] = byte_5.substring(3,4);
      system_settings["RGBCapacity"] = byte_5.substring(2,3);
      system_settings["HDMICapacity"] = byte_5.substring(1,2);
      system_settings["ParkingLinesDisabled"] = byte_5.substring(0,1);
      //byte 6
      system_settings["ScreenSize"] = byte_6.substring(4,8);
      system_settings["CSyncPolarity"] = byte_6.substring(2,4);
      system_settings["SOGEnabled"] = byte_6.substring(1,2);
      system_settings["VIMEnabled"] = byte_6.substring(0,1);
      //byte 7
      system_settings["VideoSize1"] = byte_7.substring(6,8);
      system_settings["VideoSize2"] = byte_7.substring(4,6);
      system_settings["VideoSize3"] = byte_7.substring(2,4);
      system_settings["VideoSize4"] = byte_7.substring(0,2);
      //byte 8
      system_settings["VideoFunction1"] = byte_8.substring(6,8);
      system_settings["VideoFunction2"] = byte_8.substring(4,6);
      system_settings["VideoFunction3"] = byte_8.substring(2,4);
      system_settings["VideoFunction4"] = byte_8.substring(0,2);

      console.log("SYSTEM SETTINGS: ", system_settings);

      var vihicleMake = "";
      var vihicleModel = "";
      for (var i = 0; i < msg[57]; i++) {
        vihicleMake += String.fromCharCode(msg[29+i]);
      }
      for (var i = 0; i < msg[58]; i++) {
        vihicleModel += String.fromCharCode(msg[43+i]);
      }
      //console.log(vihicleMake);
      //console.log(vihicleModel);
      for (var i = 0; i < 14; i++) {
        //console.log(vihicleModel.charCodeAt(i));
      }
      console.log('Carplay Available', msg[30]);
      if(msg[30] == 0){
        system_settings["CarPlayModule"] = true;
      }

      console.log('API LEVEL', msg[29]);
      system_settings["MCU_Type"] = msg[29];

      return system_settings;

    case DEVICE_REMOVED:
      return JSON.parse(JSON.stringify(SYSTEM_SETTINGS));
    case DEVICE_NOT_SUPPORTED:
      return JSON.parse(JSON.stringify(SYSTEM_SETTINGS));
  }
  return state;
}
