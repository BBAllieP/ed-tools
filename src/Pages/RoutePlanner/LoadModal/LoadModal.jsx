import {React, useMemo} from "react";
import {Container, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText} from '@material-ui/core';

import {useDropzone} from 'react-dropzone';

import { connect } from "react-redux";
import { acceptRoute } from "../../../redux/actions";

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const LoadModal = (props) => {
    const {
        acceptedFiles,
        rejectedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
      } = useDropzone({
        onDrop: files => {
          console.log(files);
          props.acceptRoute(files[0].path)
          props.toggle();
        },  
        multiple: false,
        accept: 'text/csv, application/vnd.ms-excel, .csv'
      });
      const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isDragActive,
        isDragReject,
        isDragAccept
      ]);

    return(
    <Container>
        <Dialog open={props.shown} onClose={props.toggle}>
            <DialogTitle>Load Route</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Drag and drop or select route csv here
                </DialogContentText>
                <div {...getRootProps({style})}>
                  <input {...getInputProps()} />
                  {!isDragActive && (<p>Drop or load route csv here</p>)}
                </div>
            </DialogContent>
        </Dialog>
    </Container>
    ) 
}

const mapDispatchToProps = {
	acceptRoute
};

export default connect(null, mapDispatchToProps)(LoadModal);