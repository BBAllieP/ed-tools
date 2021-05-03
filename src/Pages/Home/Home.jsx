import React from "react";
import { Typography, Grid, Divider, Link } from "@material-ui/core";
import path from 'path';
import logo from "../../assets/icon.png";

const Home = () => (
	<Grid container spacing={3} direction='column' justify='space-evenly'>
		<Grid item xs={12}>
			<Typography variant='h2' component='h2' gutterBottom>
				Welcome to CMDR CPT Allie's Elite Dangerous Tools
			</Typography>
		</Grid>
		<Grid item xs={12}>
			<img
				src={logo}
				style={{
					marginTop: 20,
					height: "50vh",
				}}
			/>
		</Grid>
		<Grid item container xs={12} spacing={3}>
			<Grid item xs={12}>
				<Divider />
			</Grid>
			<Grid item xs={12} container justify='flex-end' spacing={2}>
				<Typography variant='button'>
					<Link href='https://ko-fi.com/bballiep' target='_blank'>
						Buy me a beer
					</Link>
				</Typography>
			</Grid>
		</Grid>
	</Grid>
);

export default Home;
