import React from "react";
import { 
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineOppositeContent,
    TimelineDot} from '@material-ui/lab';
import {Typography, Avatar, Paper} from '@material-ui/core';
import StarImg from '../../../../assets/sun.png';
import NeutImg from '../../../../assets/neutron-star.png';


 /* Route Structure
 {
    "Name": "HIP 16709",
    "DistanceToArrival": 0,
    "DistanceRemaining": 0,
    "NeutronStar": false,
    "Jumps": 1,
    "Bodies": [
     {
      "Name": "HIP 16709 3",
      "SubType": "Water world",
      "IsTerraformable": true,
      "DistanceToArrival": 125,
      "ScanValue": 273709,
      "MappingValue": 912363,
      "Visited": false
     }
    ],
    "Visited": false
   }
*/   
const Destination = (props) => {
    console.log(props.dest);
    return (
        <TimelineItem>
            <TimelineOppositeContent>
                <Typography variant="h5">
                    {props.dest.Name}
                </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineDot>
                    <Avatar src={props.dest.NeutronStar ? NeutImg : StarImg} />
                </TimelineDot>
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
                <Paper>
                    {props.dest.Bodies.map((body)=> {
                        return (
                            <Avatar>
                                {body.Name.substring(props.dest.Name.length)}
                            </Avatar>
                        );
                    })}
                </Paper>
            </TimelineContent>
        </TimelineItem>
    )
}


export default Destination;