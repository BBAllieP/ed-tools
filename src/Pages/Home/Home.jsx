import React from "react";
import { Typography, Grid } from "@material-ui/core";
const Home = () => (
	<Grid container spacing={3}>
		<Grid item xs={12}>
			<Typography variant='h1' component='h2' gutterBottom>
				Welcome to CMDR CPT Allie's Elite Dangerous Tools
			</Typography>
		</Grid>
	</Grid>
);

export default Home;
