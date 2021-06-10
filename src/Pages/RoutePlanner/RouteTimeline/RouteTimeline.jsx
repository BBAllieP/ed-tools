import {React, useEffect} from "react";
import { Timeline,
    } from '@material-ui/lab';
import {Paper} from '@material-ui/core';
import Destination from './Destination';

const RouteTimeline = (props) => {
    useEffect(()=>{
        console.log(props.route);
        document.getElementById(props.route.step).scrollIntoView({behavior: "smooth", block: "center"});
      }, [props.route.step])
    console.log(props.route.step);
    return (
        <Paper elevation={3} >
            <Timeline style={{display: "flex", alignContent:"center"}}>
                {props.route.currentRoute.Destinations.map((dest, i) => {
                    return <Destination key={dest.Name} dest={dest} idNo={i} />
                })}
            </Timeline>
        </Paper>
    )
}


export default RouteTimeline;
