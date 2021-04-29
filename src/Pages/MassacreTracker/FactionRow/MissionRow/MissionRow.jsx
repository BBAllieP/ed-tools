import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
const MissionRow = (props) => {
	return (
		<TableRow>
			<TableCell>{props.props.Destination}</TableCell>
			<TableCell>{props.props.TargetFaction}</TableCell>
			<TableCell>{props.props.Kills + " / " + props.props.Count}</TableCell>
			<TableCell>{props.props.IsWing ? "True" : "False"}</TableCell>
			<TableCell>{props.props.Status}</TableCell>
			<TableCell>{props.props.Reward.toLocaleString()}</TableCell>
		</TableRow>
	);
};

export default MissionRow;
