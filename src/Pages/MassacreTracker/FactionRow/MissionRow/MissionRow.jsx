import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { makeMil } from "../../../../utils/numUtils";
const MissionRow = (props) => {
	return (
		<TableRow>
			<TableCell>
				{props.props.DestinationSystem} / {props.props.DestinationStation}
			</TableCell>
			<TableCell>{props.props.TargetFaction} {props.props.TargetType_Localised}</TableCell>
			<TableCell>{props.props.Kills + " / " + props.props.Count}</TableCell>
			<TableCell>{props.props.IsWing ? "True" : "False"}</TableCell>
			<TableCell>{props.props.Status}</TableCell>
			<TableCell>{makeMil(props.props.Reward)}</TableCell>
		</TableRow>
	);
};

export default MissionRow;
