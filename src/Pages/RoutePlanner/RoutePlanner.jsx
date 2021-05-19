import React from "react";
import {Grid, Typography} from '@material-ui/core';
import img from "../../assets/under_construction.jpg";
const RoutePlanner = () => {
    <Grid container spacing={3} direction='column' justify='space-evenly'>
    <Grid item xs={12}>
        <Typography variant='h2' component='h2' gutterBottom>
            The Route Planner is Currently Under Construction
        </Typography>
    </Grid>
    <Grid item xs={12}>
        <img
            src={img}
            style={{
                marginTop: 20,
                height: "50vh",
            }}
        />
    </Grid>
</Grid>
}
export default RoutePlanner;
