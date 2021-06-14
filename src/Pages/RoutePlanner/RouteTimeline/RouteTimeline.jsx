import {React, useEffect} from "react";
import { Timeline,
    } from '@material-ui/lab';
import {Container, Box} from '@material-ui/core';
import Destination from './Destination';
import { palette } from '@material-ui/system';

const RouteTimeline = (props) => {
    useEffect(()=>{
        console.log(props.route);
        document.getElementById(props.route.step).scrollIntoView({behavior: "smooth", block: "center"});
      }, [props.route.step])
    console.log(props.route.step);
    return (
        <Container bgcolor={palette.bgcolor} style={{overflow: "auto", flex:1}}>
            <Timeline>
                {props.route.currentRoute.Destinations.map((dest, i) => {
                    return <Destination key={dest.Name} dest={dest} idNo={i} />
                })}
            </Timeline>
        </Container>
    )
}


export default RouteTimeline;
