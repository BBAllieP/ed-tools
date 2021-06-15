import React, {Component, PropTypes} from "react";
import {connect} from 'react-redux';
import { 
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineOppositeContent,
    Timeline,
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
import {pulse} from 'react-animations';



const useStyles = makeStyles({
    dest: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: "baseline",
      alignSelf: "flex-start",
      width: "max-content",
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
          backgroundColor: green[700],
        },
      },
  });


 
const Destination = (props) => {
    const classes = useStyles();
    
    return (
        <TimelineItem style={{display: 'flex'}} id={props.idNo}>
            <TimelineOppositeContent style={{}}>
                <Card style={{}}>
                    <CardHeader title={props.dest.Name} action={
                        <IconButton className={`${props.dest.Copied && classes.buttonSuccess}`} style={{marginLeft: '.5em'}} onClick={()=>{props.sendCopy(props.dest.Name)}}>
                            {props.dest.Copied ? <CheckIcon />:<CopyIcon />}
                        </IconButton>
                    } />
                </Card>
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineDot>
                    {props.dest.Visited ? <CheckIcon color='disabled' /> : props.dest.NeutronStar ?
                    <img alt="star" className={props.superCharged ? 'animate__animated animate__pulse animate__infinite' : null} style={{height: "3em", borderRadius: "50%", width:"3em"}} src={NeutImg} /> : 
                    <img alt="star" style={{height: "3em", width:"3em"}} src={StarImg} />}
                    
                </TimelineDot>
                <TimelineConnector />
            </TimelineSeparator>
            
            <TimelineContent>
                {props.routeType === "r2r" ? 
                <Paper >
                    <Timeline align='left'>
                    {props.dest.Bodies.map((body, i)=> {
                        return <Body dest={props.dest} body={body} last={i===props.dest.Bodies.length -1} key={`${body.name}${i}`}/>
                    })}
                    </Timeline>
                </Paper> : null }
                
            </TimelineContent> 
        </TimelineItem>
    )
}

const mapStateToProps = (state, ownProps) => {
    const superCharged = state.routes.superCharged;
    const routeType = state.routes.currentRoute.Type;
    const dest = ownProps.dest;
	return { superCharged, routeType, dest}
};
const mapDispatchToProps = (dispatch) => {
    return {
      // explicitly forwarding arguments
      sendCopy: msg => dispatch(sendCopy(msg))
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Destination);