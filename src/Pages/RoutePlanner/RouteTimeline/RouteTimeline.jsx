import React from "react";
import { Timeline,
    } from '@material-ui/lab';
import {Paper} from '@material-ui/core';
import Destination from './Destination';

const RouteTimeline = (props) => {
    return (
        <Paper elevation={3} style={{ height: "100%", overflow: 'auto'}}>
            <Timeline>
                {props.route.Destinations.map((dest) => {
                    return <Destination key={dest.Name} dest={dest} />
                })}
            </Timeline>
        </Paper>
    )
}


export default RouteTimeline;
