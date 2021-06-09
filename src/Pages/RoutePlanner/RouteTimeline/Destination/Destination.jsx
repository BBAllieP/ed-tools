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

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    dest: {
      display: 'flex',
      flexDirection: 'horizontal'
    },
  });


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
    const classes = useStyles();
    return (
        <TimelineItem>
            <TimelineOppositeContent>
                <Typography variant="h5">
                    {props.dest.Name}
                </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineDot>
                    <img alt="star" style={{height: "3em"}} src={props.dest.NeutronStar ? NeutImg : StarImg} />
                </TimelineDot>
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
                <Paper className={classes.dest}>
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