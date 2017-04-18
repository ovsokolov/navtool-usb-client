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

export const OSD_SETTINGS = { BackgroundColor: 16,
                              TextColor: 7,
                              HighlightColor: 112,
                              Reserved1: 255,
                              OsdCVBS1: '',
                              OsdCVBS2: '',
                              OsdCVBS3: '',
                              OsdCVBS4: '',
                              TextMenuHDMI: '',
                              TextMenuRGB: '',
                              TextMenuCh1: '',
                              TextMenuCh2: '',
                              TextMenuCh3: '',
                              TextMenuCh4: '',
                              Reserved2: '',
                              Reserved3: ''}


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
  obd_disable_all: ''
}

export const OSD_INPUT_1_DROPDOWN ={ id:'TextMenuCh1',
values:[
  {value:'11', label:'Rear Camera',key:'CH1_0',setting:'TextMenuCh1'},
  {value:'00', label:'Input 1',key:'CH1_1',setting:'TextMenuCh1'}
]}

export const OSD_INPUT_2_DROPDOWN ={ id:'TextMenuCh2',
values:[
  {value:'11', label:'Front Camera',key:'CH2_0',setting:'TextMenuCh2'},
  {value:'00', label:'Input 2',key:'CH2_1',setting:'TextMenuCh2'}
]}

export const OSD_INPUT_3_DROPDOWN ={ id:'TextMenuCh3',
values:[
  {value:'11', label:'Left Camera',key:'CH3_0',setting:'TextMenuCh3'},
  {value:'00', label:'Input 3',key:'CH3_1',setting:'TextMenuCh3'}
]}

export const OSD_INPUT_4_DROPDOWN ={ id:'TextMenuCh4',
values:[
  {value:'11', label:'Right Camera',key:'CH4_0',setting:'TextMenuCh4'},
  {value:'00', label:'Input 4',key:'CH4_1',setting:'TextMenuCh4'}
]}

