import {React, useEffect, useState} from "react";

import {Container,IconButton, Collapse, Grid,CardMedia, Card, CardContent, Typography, Paper, CardHeader} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowIcon from '@material-ui/icons/ArrowForward';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoonImg from '../../../../../assets/moon.png'
import {makeMil} from '../../../../../utils/numUtils';
import { TimelineItem, TimelineConnector, TimelineDot, TimelineOppositeContent,TimelineContent, TimelineSeparator } from "@material-ui/lab";
import CheckIcon from '@material-ui/icons/Check';
import clsx from 'clsx';
  const useStyles = makeStyles((theme) => ({

    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },

  }));

const Body = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleExpandClick = () => {
        setOpen(!open);
      };
    useEffect(()=>{
        if(props.body.DeepScanned){
            setOpen(false)
        }
    },[props.body.DeepScanned])
    return (
            <TimelineItem>
                <TimelineOppositeContent style={{}}>
                    <Typography variant='h5'>{props.body.SubType}</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator style={{}}>
                    <TimelineDot>
                        {props.body.DeepScanned ? <CheckIcon /> : 
                        <img alt="body" src={MoonImg} style={{zIndex: 10, height: "4em", borderRadius: "50%", width:"4em", margin:"0px" }} />}
                    </TimelineDot>
                    {!props.last && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                    <Card>
                        <CardHeader title={props.body.Name.substring(props.dest.Name.length)} action={
                            <IconButton className={clsx(classes.expand, { [classes.expandOpen]: open,})}
                                    onClick={handleExpandClick}
                                    aria-expanded={open}
                                    aria-label="show more"
                                    disabled={props.body.DeepScanned}
                                    >
                                <ExpandMoreIcon />
                            </IconButton>
                        }>
                        </CardHeader>
                        
                        <Collapse in={open && !props.body.DeepScanned} timeout='auto' unmountOnExit>
                            <Grid container>
                                <Grid item xs={6}>
                                    Scan Value:
                                </Grid>
                                <Grid item xs={6}>
                                    {makeMil(props.body.ScanValue)}
                                </Grid>
                                <Grid item xs={6}>
                                    Map Value:
                                </Grid>
                                <Grid item xs={6}>
                                    {makeMil(props.body.MappingValue)}
                                </Grid>
                            </Grid>
                        </Collapse>
                        
                    </Card>
                </TimelineContent>
            </TimelineItem>
    )
}


export default Body;