import React from "react";
import { Timeline,
    } from '@material-ui/lab';
import Destination from './Destination';

const RouteTimeline = (props) => {
    console.log(props.route);
    return (
        <Timeline>
            {props.route.Destinations.map((dest) => {
                return <Destination dest={dest} />
            })}
        </Timeline>
    )
}


export default RouteTimeline;
