import {React, useState} from "react";
import {Container, Fab} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import LoadModal from './LoadModal';
import RouteTimeline from './RouteTimeline';
import {connect} from 'react-redux';
import _ from 'lodash';

const fabStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
}



const RoutePlanner = (props) => {
    const [loadShown,showLoad] = useState(false);
    const handleModal = () => {
        showLoad(!loadShown)
    }
    return(
    <Container>
        {_.isEmpty(props.routes) ? null : <RouteTimeline route={props.routes} />}
        <LoadModal shown={loadShown} toggle={handleModal} />
        <Fab style={fabStyle} color='primary' onClick={handleModal}>
            <Add />
        </Fab>
    </Container>
    ) 
}


const mapStateToProps = (state) => {
	return {routes: state.routes.currentRoute}
}


export default connect(mapStateToProps)(RoutePlanner);
