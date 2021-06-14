import React from 'react';
import {connect} from 'react-redux';
import {Grid, Typography} from '@material-ui/core';
import {makeMil} from '../../../utils/numUtils';

const RouteHeader = (props) => {
    const getRouteType = () => {
        switch(props.route.Type){
        case "r2r":
            return "Road to Riches";
        case "fc":
            return "Fleet Carrier";
        case "neutron":
            return "Neutron Plotter";
        default:
            return "Unknown";
        }
    }
    const getRouteValue = () => {
        let sumVal = 0;
        if(props.route.Type === "r2r"){
        props.route.Destinations.forEach((dest,i)=>{
            dest.Bodies.forEach((bod,j)=>{
                sumVal += (bod.ScanValue + bod.MappingValue);
            })
        })
    }
        return makeMil(sumVal);
    }
    const getCurrentValue = () => {
        let sumVal = 0;
        if(props.route.Type === "r2r"){
            props.route.Destinations.forEach((dest,i)=>{
            dest.Bodies.forEach((bod,j)=>{
                if(bod.LightScanned){
                    sumVal += bod.ScanValue;
                }
                if(bod.DeepScanned){
                    sumVal += bod.MappingValue;
                }
            })
        })
        }
        
        return makeMil(sumVal);
    }
    
    return (
        <Grid container>
            <Grid item container xs={6}>
                <Grid item xs={12}><Typography variant='h4'>{getRouteType()}</Typography></Grid>
                <Grid item xs={6}><Typography variant='h5'>Source:</Typography></Grid>
                <Grid item xs={6}><Typography variant='h5'>{props.route.Destinations[0].Name}</Typography></Grid>
                <Grid item xs={6}><Typography variant='h5'>End:</Typography></Grid>
                <Grid item xs={6}><Typography variant='h5'>{props.route.Destinations[props.route.Destinations.length -1].Name}</Typography></Grid>
            </Grid>
            {props.route.Type === "r2r" && <Grid item container xs={6}>
                <Grid item xs={12}><Typography variant='h4'>Stats</Typography></Grid>
                <Grid item xs={6}><Typography variant='h5'>Route Value</Typography></Grid>
                <Grid item xs={6}><Typography variant='h5'>{getRouteValue()}</Typography></Grid>
                <Grid item xs={6}><Typography variant='h5'>Current Value</Typography></Grid>
                <Grid item xs={6}><Typography variant='h5'>{getCurrentValue()}</Typography></Grid>
            </Grid>}
            
        </Grid>
    );
}
const mapStateToProps = (state) => {
	return {route: state.routes.currentRoute}
}



export default connect(mapStateToProps)(RouteHeader);