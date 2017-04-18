export const SYSTEM_SETTINGS = {SoundSupported: '',
                                ObdSupported:'',
                                ConfigSupported:'',
                                RearCameraSupported:'',
                                FrontCameraSupported:'',
                                LeftCameraSupported:'',
                                RightCameraSupported:'',
                                ReservedSupported:'',
                                SoundEnabled:'',
                                RearCameraEnabled:'',
                                FrontCameraEnabled:'',
                                LeftCameraEnabled:'',
                                RightCameraEnabled:'',
                                FactoryRearCamera:'',
                                FactoryFrontCamera:'',
                                FactoryLeftCamera:'',
                                HDMIEnabled:'',
                                RGBEnabled:'',
                                Input1Enabled:'',
                                Input2Enabled:'',
                                Input3Enabled:'',
                                Input4Enabled:'',
                                NotUsed:'',
                                FactoryRightCamera:'',
                                FrontCameraMode:'',
                                SideCameraMode:'',
                                ResrvedBits:''}


export const TRANSFER_SET_UP_DATA_RESPONSE = {
              block_size: '',
              blocks_count: '',
              packet_size: '',
              start_sector: '',
              total_secotrs: ''
}

export const TRANSFER_STATUS_DATA_RESPONSE = {
              sector_number: '',
              block_number: '',
              packet_number: '',
              remaining_packets: '',
              check_sum: ''
}

export const SIDE_CAMERA_DROPDOWN = { id:'SideCameraMode',
values:[
  {value:'001', label:'Manual',key:'SC1',setting:'SideCameraMode'},
  {value:'010', label:'Manual + W/O Speed Check',key:'SC2',setting:'SideCameraMode'},
  {value:'011', label:'Manual + Speed Cheeck',key:'SC3',setting:'SideCameraMode'}
]}


export const FRONT_REAR_CAMERA_DROPDOWN ={ id:'FrontCameraMode',
values:[
  {value:'01', label:'Manual',key:'FR1',setting:'SideCameraMode'},
  {value:'11', label:'Manual + Speed Cheeck',key:'Fr2',setting:'SideCameraMode'}
]}

export const OBD_FEATURES = { 
  obd_enabled: false,
  obd_expired: '',
  obd_label_idx1: '',
  obd_label_idx2: '',
  obd_label_idx3: '',
  obd_feature_idx1: '',
  obd_feature_idx2: '',
  obd_feature_idx3: '',
}

