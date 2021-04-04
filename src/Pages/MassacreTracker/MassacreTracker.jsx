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

const MassacreTracker = () => (
	<Grid container spacing={3}>
		<Grid item xs={12}>
			<Typography variant='h1' component='h2' gutterBottom>
				Massacre Mission Tracking
			</Typography>
		</Grid>
		<Grid item xs={12}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell></TableCell>
						<TableCell>Faction</TableCell>
						<TableCell>Missions</TableCell>
						<TableCell>Kills</TableCell>
						<TableCell>Current Value</TableCell>
						<TableCell>Total Value</TableCell>
					</TableRow>
				</TableHead>
				<TableData>
					{props.missionState.factions.map((f) => {
						return <FactionRow f />;
					})}
				</TableData>
			</Table>
		</Grid>
	</Grid>
);
const mapStateToProps = (state) => {
	return { missionState: { ...state.missions } };
};

export default connect(mapStateToProps)(MassacreTracker);
