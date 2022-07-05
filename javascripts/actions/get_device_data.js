import axios from 'axios';

import { fetchMake } from './get_make';
import { clearSBL } from './hid_action';
import { fetchOBDConfig} from './get_obdconfig'
import { fetchSoftwareConfig } from './get_software'
import { WEB_SERVICES_URL } from '../utils/constants';
import { OBD_COMPLETED } from '../utils/device_utils';
import { DEVICE_OBD_SUCCESS, DEVICE_OBD_FAILED } from './hid_action';
import { DEVICE_SUPPORTED, DEVICE_NOT_SUPPORTED, DEVICE_START_SECTOR, ASSEMBLY_MESSAGE  } from '../utils/device_utils';

//const ROOT_URL = "https://tranquil-mesa-29755.herokuapp.com/";
const ROOT_URL = WEB_SERVICES_URL + "/v1/navtooldevices/";
export const FETCH_DEVICE_DB_DATA = 'FETCH_DEVICE_DB_DATA';
export const FETCH_DEVICE_MCU = 'FETCH_DEVICE_MCU';


export function fetchDeviceDBData(serial_number, software){

  //console.log('URL', url);

  return (dispatch) => {
    dispatch( { type: FETCH_DEVICE_MCU, payload: serial_number } )
    const url = ROOT_URL + serial_number;
    const request = axios.get(url);
    request.then( ({data}) =>{
      console.log(" fetchDeviceDBData xxxxxxxxxxxxx")
      console.log(data);
      //console.log(data["mfg_id"])
      console.log(" fetchDeviceDBData xxxxxxxxxxxxx")
      //console.log(serial_number);
      dispatch( { type: FETCH_DEVICE_DB_DATA, payload: data } )
      if (software !== undefined){
        //console.log("%%%%%%%%Software parameter exists")
        dispatch(fetchSoftwareConfig(data["mfg_id"],data.sw_id,data.sw_build,data.vehicle_make,data.vehicle_model))
        //dispatch(fetchOBDConfig(data["mfg_id"], obd.softwareId));
        //dispatch( fetchMake(data["mfg_id"]) )
      }
    }).catch(function(error){
      if (error.response) {
        console.log('error.response');
        console.log(error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('error.request');
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('error.else');
        console.log('Error', error.message);
      }
    });
  };
}

export function updateDeviceDBData(serial_number, update_date){
  console.log('@@@@@@@@@@@@updateDeviceDBData@@@@@@@@@@@@@');
  console.log(update_date);
  console.log('@@@@@@@@@@@@updateDeviceDBData@@@@@@@@@@@@@');
  const url = ROOT_URL + serial_number;
  const request = axios.put(url, {
    sw_id: update_date.sw_id,
    sw_build: update_date.sw_build,
    vehicle_make: update_date.vehicle_make,
    vehicle_model: update_date.vehicle_model
  });

  //console.log('URL', url);

  return (dispatch) => {
    request.then( ({data}) =>{
      //console.log(data);
      //console.log(data["mfg_id"])
      dispatch( { type: FETCH_DEVICE_DB_DATA, payload: data } )
    });
  };
}

export function updateDeviceOBDData(serial_number, obd_status){
  if(obd_status == DEVICE_OBD_SUCCESS){
    const url = WEB_SERVICES_URL + '/v1/obdupdate/' + "?mcu_id=" + serial_number;
    const request = axios.get(url);

    //console.log('OBD MCU ', serial_number);

    return (dispatch) => {
      request.then( ({data}) =>{
        //console.log(data);
        //console.log(data["mfg_id"])
        dispatch( { type: OBD_COMPLETED, payload: 'Programming Completed' } )
        dispatch(fetchDeviceDBData(serial_number))
      });
    };
  }else{
    return { 
      type: OBD_COMPLETED, 
      payload: 'Programming Failed' 
    }; 
  }
}

export function checkDeviceSupport(mfg_id){
    const url = WEB_SERVICES_URL + '/v1/navtoolhws/' + "?mfg_id=" + mfg_id;
    const request = axios.get(url);

    return (dispatch) => {
      request.then( ({data}) =>{
        //console.log("checkDeviceSupport");
        //console.log(data[0]["hw_hid"]);
        if(data[0]["hw_hid"] == 1 || data[0]["hw_hid"] == 2){
          //console.log("Supported");
          dispatch( { type: DEVICE_SUPPORTED, payload: data[0] } )
        }else{
          //console.log("Not Supported");
          dispatch( { type: DEVICE_NOT_SUPPORTED, payload: '' } )
        }
      });
    };

}

export function checkDeviceStartSector(mfg_id){
    const url = WEB_SERVICES_URL + '/v1/navtoolhws/' + "?mfg_id=" + mfg_id;
    const request = axios.get(url);

    return (dispatch) => {
      request.then( ({data}) =>{
        //console.log("checkDeviceStartSector");
        //console.log("Supported");
        dispatch( { type: DEVICE_START_SECTOR, payload: data[0] } )
      });
    };

}



export function assembleInterface(mfg_id, deviceId){
  let url = 'https://app.skuvault.com/api/inventory/getSerialNumbers';
  let request = axios.post(url, { "ProductSKU": mfg_id,
                                    "TenantToken": "1v6beSwTe2Kz9FwLmTKqBlDzqi4cGoMcCFJ1CwFuJ7I=",
                                    "UserToken": "TgHNXwSJTUNNSN2sbdtP66vFocCeK4pZXBOTUZEqtfY="
                                });
  let itemFound = false;
  return (dispatch) => {
    request.then( ({data}) =>{
      data.Items.forEach(function (arrayItem) {
        if(arrayItem.SerialNumber == deviceId){
          dispatch( { type: ASSEMBLY_MESSAGE, payload: "Serial Number " + deviceId + " already assembled" } )
          itemFound =true;
        }
      })
      if(!itemFound){ 
        url = 'https://app.skuvault.com/api/products/getKits';
        request = axios.post(url, { "AvailableQuantityModifiedAfterDateTimeUtc": "minDate",
                                      "AvailableQuantityModifiedBeforeDateTimeUtc": "maxDate",
                                      "GetAvailableQuantity": true,
                                      "IncludeKitCost": false,
                                      "KitSKUs": mfg_id,
                                      "ModifiedAfterDateTimeUtc": "minDate",
                                      "ModifiedBeforeDateTimeUtc": "maxDate",
                                      "PageNumber": 0,
                                      "TenantToken": "1v6beSwTe2Kz9FwLmTKqBlDzqi4cGoMcCFJ1CwFuJ7I=",
                                      "UserToken": "TgHNXwSJTUNNSN2sbdtP66vFocCeK4pZXBOTUZEqtfY="
                                    });           
        request.then( ({data}) =>{
          let kit = data.Kits[0];
          console.log(data.Kits[0]);
          if(data.Errors.length > 0){
            dispatch( { type: ASSEMBLY_MESSAGE, payload: data.Errors[0] } )
          }else if(kit.AvailableQuantity == 0){
            dispatch( { type: ASSEMBLY_MESSAGE, payload: "Not enough quantity to assemble" } )
          }else{
            let items = [];
            data.Kits[0].KitLines.forEach(function (arrayItem) {

                  var item = {  "Sku": arrayItem.Items[0].SKU,
                                "WarehouseId": 1,
                                "LocationCode": "ASSEMBLY",
                                "Quantity": arrayItem.Quantity,
                                "Reason": "KIT ASSEMBLY " + mfg_id
                              }
                items.push(item);
            })
            console.log(items);
            let requestObject = { "TenantToken": "1v6beSwTe2Kz9FwLmTKqBlDzqi4cGoMcCFJ1CwFuJ7I=",
                                  "UserToken": "TgHNXwSJTUNNSN2sbdtP66vFocCeK4pZXBOTUZEqtfY=",
                                  "Items": items
                                }
            console.log(requestObject);
            url = 'https://app.skuvault.com/api/inventory/removeItemBulk';
            request = axios.post(url, requestObject);
            request.then( ({data}) =>{
              if(data.Status != "OK"){
                console.log(data.Errors);
                dispatch( { type: ASSEMBLY_MESSAGE, payload: "Error Removing Some Items for Assembly " + mfg_id } )
              }else{
                url = 'https://app.skuvault.com/api/inventory/addItem';
                let request = axios.post(url, { "Sku": mfg_id,
                                                "WarehouseId": 1,
                                                "LocationCode": "SHIPPING",
                                                "Quantity": 1,
                                                "Reason": "ASSEMBLY",
                                                "SerialNumbers": [
                                                    deviceId
                                                ],
                                                "TenantToken": "1v6beSwTe2Kz9FwLmTKqBlDzqi4cGoMcCFJ1CwFuJ7I=",
                                                "UserToken": "TgHNXwSJTUNNSN2sbdtP66vFocCeK4pZXBOTUZEqtfY="
                                              });
                request.then( ({data}) =>{
                  console.log(data);
                  if(data.AddItemStatus == "Success"){
                    dispatch( { type: ASSEMBLY_MESSAGE, payload: "Item Assembled"} )
                  }else{
                    dispatch( { type: ASSEMBLY_MESSAGE, payload: "Error Adding Item " + mfg_id + " " + data.AddItemStatus} )
                  }
                });
              }
              console.log(data);           
            }).catch(function (error) {
              dispatch( { type: ASSEMBLY_MESSAGE, payload: "Error Removing Items for Assembly " + mfg_id } )
            });         
          }
        }).catch(function (error) {
          dispatch( { type: ASSEMBLY_MESSAGE, payload: "Error getting Kit for " + mfg_id } )
        });
      }
    }).catch(function (error) {
      dispatch( { type: ASSEMBLY_MESSAGE, payload: "Error getting Serial Numbers for " + mfg_id } )
    });
  }
}

