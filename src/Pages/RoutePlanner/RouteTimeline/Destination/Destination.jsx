import React from "react";
import { 
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineOppositeContent,
    TimelineDot} from '@material-ui/lab';
import {Typography,Container, Divider, Avatar, Paper, Card, CardHeader, IconButton} from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopy';
import ArrowIcon from '@material-ui/icons/ArrowForward';
import StarImg from '../../../../assets/sun.png';
import NeutImg from '../../../../assets/neutron-star.png';

import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';


const useStyles = makeStyles({
    dest: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: "baseline",
      width: "fit-content",
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
        <TimelineItem style={{display: "flex", flexFlow: "row nowrap", alignItems: "center"}}>
            <TimelineOppositeContent style={{display: "flex", justifyContent: "flex-end"}}>
                <Card style={{width: "fit-content"}}>
                    <CardHeader title={props.dest.Name} action={
                        <IconButton>
                            <CopyIcon />
                        </IconButton>
                    } />
                </Card>
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineDot>
                    {props.dest.NeutronStar ?  
                    <img alt="star" style={{height: "3em", borderRadius: "50%", width:"3em"}} src={NeutImg} /> : 
                    <img alt="star" style={{height: "3em", width:"3em"}} src={StarImg} />}
                </TimelineDot>
                <TimelineConnector />
            </TimelineSeparator>
            {_.isEmpty(props.dest) ?  <TimelineContent>
                <Paper className={classes.dest}>
                    {props.dest.Bodies.map((body, i)=> {
                        return (
                            <Container style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", padding: 0, flexBasis: 0, margin:0}}>
                            <Avatar>
                                {body.Name.substring(props.dest.Name.length)}
                            </Avatar>
                            {i === props.dest.Bodies.length -1 ? null : <ArrowIcon />}
                            </Container>
                        );
                    })}
                </Paper>
            </TimelineContent>: null}
           
        </TimelineItem>
    )
}


export default Destination;