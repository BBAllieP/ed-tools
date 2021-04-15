import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
const MissionRow = (props) => {
	return (
		<TableRow>
			<TableCell>{props.destination}</TableCell>
			<TableCell>{props.targetFaction}</TableCell>
			<TableCell>{props.kills + " / " + props.needed}</TableCell>
			<TableCell>{props.isWing}</TableCell>
			<TableCell>{props.status}</TableCell>
			<TableCell>{props.value}</TableCell>
		</TableRow>
	);
};

export default MissionRow;
