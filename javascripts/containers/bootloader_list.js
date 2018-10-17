import React, { Component} from 'react';
import { connect} from 'react-redux';


class BootloaderList extends Component {
  constructor(props){
    super(props);
    this.selectBootloader = this.selectBootloader.bind(this);
  }

  selectBootloader(id,path,target){
    console.log("inside selectBootloader", id);
    console.log("inside selectBootloader", path);
    console.log("inside selectBootloader", target);
    this.props.onSelectBootloader(id,path,target);
  }

  componentDidMount(){
    console.log("BootloaderList componentDidMount");
    var table = $('#bootloader-list').DataTable( {
        bDestroy: true,
        bFilter: false,
        oLanguage: {
          sEmptyTable: "Click Search Button or Contact Technical Support"
        },
        data: [],
        columns: [
            { title: "ID" },
            { title: "NAME" },
            { title: "DESC" },
            { title: "PATH" },
            { title: "TARGET" }
        ],
        order: [ 1, "desc" ]
    } );

    $('#bootloader-list tbody').off('click');
    $('#bootloader-list tbody').on( 'click', 'tr', function () {
        if ( $(event.target.parentElement).hasClass('selected') ) {
            $(event.target.parentElement).removeClass('selected');
        }
        else {
            $('#bootloader-list tr').removeClass('selected');
            $(this).addClass('selected');
        }
    } );
  }

  componentDidUpdate(nextProps){
    console.log("BootloaderList componentDidUpdate");
    var dataSet = [];
    //console.log(this.props.software_list);
    this.props.bootloader_list.forEach(function(bootloader){
      var row = [bootloader.id, bootloader.mfg_id, bootloader.mfg_id_desc, bootloader.project_path, bootloader.target_name];
      dataSet.push(row);
     });
    console.log("dataset");
    console.log(dataSet);
    var table = $('#bootloader-list').DataTable( {
        bDestroy: true,
        bFilter: false,
        oLanguage: {
          sEmptyTable: "Click Search Button or Contact Technical Support"
        },
        data: dataSet,
        order: [ 1, "desc" ]
    } );

    $('#bootloader-list tbody').off('click');
    $('#bootloader-list tbody').on( 'click', 'tr', () => {
        if ( $(event.target.parentElement).hasClass('selected') ) {
            $(event.target.parentElement).removeClass('selected');
        }
        else {
            $('#bootloader-list tr').removeClass('selected');
            $(event.target.parentElement).addClass('selected');
            var data = table.row(event.target.parentElement).data();
            this.selectBootloader(data[0], data[3], data[4]);
        }
    }
    );
  }

  render(){
    return (
        <table id="bootloader-list" className="display" cellSpacing="0" width="100%"></table>
    );
  }
}

function mapStateToProps(state){
  return { bootloader_list: state.bootloader_list };
}

export default connect(mapStateToProps)(BootloaderList);
