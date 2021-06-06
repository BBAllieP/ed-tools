import {React, useState, useMemo} from "react";
import {Container, Fab, Typography, Paper, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import {useDropzone} from 'react-dropzone';
import { acceptRoute } from "../../redux/actions";

const fabStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
}
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


const RoutePlanner = () => {
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
      } = useDropzone({
        onDrop: files => props.acceptRoute(files),
        maxFiles: 1,
        accept: 'text/csv'
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
    const [loadShown,showLoad] = useState(false);
    const handleModal = () => {
        showLoad(!loadShown)
    }
    return(
    <Container>
        <Dialog open={loadShown} onClose={handleModal}>
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
        <Fab style={fabStyle} color='primary' onClick={handleModal}>
            <Add />
        </Fab>
    </Container>
    ) 
}

const mapDispatchToProps = {
	getAllFactions,
};

export default connect(, mapDispatchToProps)(RoutePlanner);
