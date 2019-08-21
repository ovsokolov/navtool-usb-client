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
                                ResrvedBits:'',
                                IsDefaultSettings: '',
                                VideoInputs: '',
                                VIMCapacity: '',
                                RGBCapacity: '',
                                HDMICapacity: '',
                                ParkingLinesDisabled: '',
                                ScreenSize: '',
                                CSyncPolarity: '',
                                SOGEnabled: '',
                                VIMEnabled: '',
                                VideoSize1: '',
                                VideoSize2: '',
                                VideoSize3: '',
                                VideoSize4: '',
                                VideoFunction1: '',
                                VideoFunction2: '',
                                VideoFunction3: '',
                                VideoFunction4: ''}

export const OSD_SETTINGS = { osd_enabled: false,
                              BackgroundColor: 16,
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
  {
    value:'001', 
    label:'LEFT/RIGHT LANE WATCH CAMERA MANUAL ACTIVATION MODE',
    key:'SC1',
    setting:'SideCameraMode',
    description: [
      'Left and Right Lane watch cameras can be only turned on manually by the user at anytime.' 
    ]
  },
  {
    value:'010', 
    label:'LEFT/RIGHT LANE WATCH CAMERA AUTOMATIC ACTIVATION MODE VIA TURN SIGNAL',
    key:'SC2',
    setting:'SideCameraMode',
    description: [
      'Manual Without Speed Check - Left and Right Lane watch cameras turn on automatically when turn signals are activated at any speed.<br/><br/>', 
      'Left and Right Lane watch cameras can be turned on manually by the user at anytime.'
    ]
  },
  {
    value:'011', 
    label:'LEFT/RIGHT LANE WATCH CAMERA AUTOMATIC ACTIVATION MODE VIA TURN SIGNAL WITH TRAVELING OVER 15 MPH',
    key:'SC3',
    setting:'SideCameraMode',
    description: [
      'Left and Right Lane watch cameras turn on automatically when turn signal are activated and vehicle is moving at speed of above 15 MP/H<br/><br/>', 
      'Left and Right Lane watch cameras can be turned on manually by the user at anytime.'
    ]
  }
]}


export const FRONT_REAR_CAMERA_DROPDOWN ={ id:'FrontCameraMode',
values:[
  {
    value:'01', 
    label:'FORWARD FACING CAMERA MANUAL ACTIVATION MODE',
    key:'FR1',
    setting:'FrontCameraMode',
    description: [
      'Rear camera turns on automatically in reverse or can be turned on manually by the user at anytime (manual camera activation is only possible with aftermarket camera, or if factory camera is re-routed via the interface).<br/><br/>',
      'Front camera can be only turned on manually by the user at anytime.'
    ]
  },
  {
    value:'11',
    label:'FORWARD FACING CAMERA AUTOMATIC ACTIVATION MODE ',
    key:'Fr2',
    setting:'FrontCameraMode',
    description: [
      'Rear camera turns on automatically in reverse or can be turned on manually by the user at anytime (manual camera activation is only possible with aftermarket camera, or if factory camera is re-routed via the interface).<br/><br/>' ,
      'Front camera is activated after vehicle is shifted in Drive out of Reverse and stay on the screen up to 10 MP/H.<br/><br/>',
      'Front camera can be turned on manually by user at anytime.'
    ]
  }
]}

export const OBD_FEATURES = { 
  obd_enabled: false,
  obd_expired: '',
  obd_count: 0,
  obd_label_idx1: '',
  obd_label_idx2: '',
  obd_label_idx3: '',
  obd_feature_idx1: '0',
  obd_feature_idx2: '0',
  obd_feature_idx3: '0',
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

export const TRANSMISSION_TYPE_DROPDOWN ={ id:'automatic_transmission',
values:[
  {value:'1', label:'Automatic Transmission',key:'TRAN_0',setting:'automatic_transmission'},
  {value:'0', label:'Manual Transmission',key:'TRAN_1',setting:'automatic_transmission'}
]}

export const SYNC_POLARITY_DROPDOWN ={ id:'CSyncPolarity',
values:[
  {value:'01', label:'Positive',key:'SYNC_0',setting:'CSyncPolarity'},
  {value:'10', label:'Negative',key:'SYNC_1',setting:'CSyncPolarity'}
]}

