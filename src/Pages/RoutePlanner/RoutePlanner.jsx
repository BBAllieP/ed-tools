import {React, useState} from "react";
import {Container, Fab} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import LoadModal from './LoadModal';

const fabStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
}



const RoutePlanner = () => {
    const [loadShown,showLoad] = useState(false);
    const handleModal = () => {
        showLoad(!loadShown)
    }
    return(
    <Container>
        <LoadModal shown={loadShown} toggle={handleModal} />
            
        <Fab style={fabStyle} color='primary' onClick={handleModal}>
            <Add />
        </Fab>
    </Container>
    ) 
}


export default RoutePlanner;
