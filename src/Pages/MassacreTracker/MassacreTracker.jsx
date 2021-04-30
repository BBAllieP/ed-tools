import React from "react";
import { Typography, Grid } from "@material-ui/core";
import FactionRow from "./FactionRow";
import { connect } from "react-redux";

const MassacreTracker = (props) => (
	<Grid container spacing={3}>
		<Grid item xs={12}>
			<Typography variant='h1' component='h2' gutterBottom>
				Massacre Mission Tracking
			</Typography>
		</Grid>
		<Grid item xs={4}>
			<Grid container>
				<Grid item xs={12}>
					Stack Height:
				</Grid>
				<Grid item xs={12}>
					Stack Width:
				</Grid>
				<Grid item xs={12}>
					Kills Needed:
				</Grid>
				<Grid item xs={12}>
					Efficiency:
				</Grid>
				<Grid item xs={12}>
					Total Reward:
				</Grid>
			</Grid>
		</Grid>
		<Grid item xs={4}>
			Progress Bar
		</Grid>
		<Grid item xs={4}>
			Ready for Turn In
		</Grid>
		<Grid item xs={12}>
			{[...Object.keys(props.missionState)]
				/*.sort((i, j) => {
					if (
						props.missionState[Object.keys(props.missionState)[i]].length >
						props.missionState[Object.keys(props.missionState)[j]].length
					) {
						return -1;
					} else {
						return 1;
					}
				})*/
				.map((f) => {
					return <FactionRow key={f} factionName={f} />;
				})}
		</Grid>
	</Grid>
);
const mapStateToProps = (state) => {
	return { missionState: { ...state.missions } };
};

export default connect(mapStateToProps)(MassacreTracker);
