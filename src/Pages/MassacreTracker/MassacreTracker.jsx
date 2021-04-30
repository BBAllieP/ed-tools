import React from "react";
import {
	Typography,
	Grid,
	Collapse,
	Table,
	TableBody,
	TableRow,
	TableHead,
	TableContainer,
	TableCell,
	IconButton,
} from "@material-ui/core";
import FactionRow from "./FactionRow";
import { connect } from "react-redux";

const MassacreTracker = (props) => (
	<Grid container spacing={3}>
		<Grid item xs={12}>
			<Typography variant='h1' component='h2' gutterBottom>
				Massacre Mission Tracking
			</Typography>
		</Grid>
		<Grid item xs={12}>
			{Object.keys(props.missionState).map((f) => {
				return <FactionRow factionName={f} />;
			})}
		</Grid>
	</Grid>
);
const mapStateToProps = (state) => {
	return { missionState: { ...state.missions } };
};

export default connect(mapStateToProps)(MassacreTracker);
