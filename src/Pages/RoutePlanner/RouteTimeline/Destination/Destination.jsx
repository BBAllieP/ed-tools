import React from "react";
import {connect} from 'react-redux';
import { 
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineOppositeContent,
    TimelineDot} from '@material-ui/lab';
import {Paper, Card, CardHeader, IconButton} from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopy';
import StarImg from '../../../../assets/sun.png';
import NeutImg from '../../../../assets/neutron-star.png';
import { sendCopy } from "../../../../redux/actions";
import { makeStyles } from '@material-ui/core/styles';
import Body from './Body';
import CheckIcon from '@material-ui/icons/Check';
import _ from 'lodash';
import { green } from '@material-ui/core/colors';


const useStyles = makeStyles({
    dest: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: "baseline",
      width: "fit-content",
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
          backgroundColor: green[700],
        },
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
        <TimelineItem style={{display: "flex", flexFlow: "row nowrap", alignItems: "center"}} id={props.idNo}>
            <TimelineOppositeContent style={{display: "flex", justifyContent: "flex-end"}}>
                <Card style={{width: "fit-content"}}>
                    <CardHeader title={props.dest.Name} action={
                        <IconButton className={props.dest.Copied &&  classes.buttonSuccess} style={{marginLeft: '.5em'}} onClick={()=>{props.sendCopy(props.dest.Name)}}>
                            {props.dest.Copied ? <CheckIcon />:<CopyIcon />}
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
            
            <TimelineContent>
                <Paper className={classes.dest}>
                    {props.dest.Bodies.map((body, i)=> {
                        return <Body dest={props.dest} body={body} index={i} key={body.name}/>
                    })}
                </Paper>
            </TimelineContent> 
        </TimelineItem>
    )
}

const mapStateToProps = (state) => {
	return { routeState: { ...state.routes }
	}; 
};
const mapDispatchToProps = (dispatch) => {
    return {
      // explicitly forwarding arguments
      sendCopy: msg => dispatch(sendCopy(msg))
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Destination);