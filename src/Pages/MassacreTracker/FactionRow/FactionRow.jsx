import { React, useState, useEffect } from "react";
import {
	TableCell,
	TableBody,
	TableRow,
	Collapse,
	Box,
	Typography,
	IconButton,
	Table,
	TableHead,
} from "@material-ui/core";
import MissionRow from "./MissionRow";
import { connect } from "react-redux";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const DataRow = (props) => {
	const [open, setOpen] = useState(false);
	var sumKills = 0;
	var sumVal = 0;
	var curVal = 0;
	var getStats = () => {
		props.fact.forEach((mis) => {
			sumKills = sumKills + mis.kills;
			sumVal = sumVal + mis.value;
			if (mis.status == "complete") {
				curVal = curVal + mis.value;
			}
		});
	};

	useEffect(() => {
		getStats();
	}, []);
	return (
		<>
			<TableRow>
				<TableCell>
					<IconButton size='small' onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
					</IconButton>
				</TableCell>
				<TableCell>{props.factName}</TableCell>
				<TableCell>{props.fact.length}</TableCell>
				<TableCell>{sumKills}</TableCell>
				<TableCell>{curVal}</TableCell>
				<TableCell>{sumVal}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout='auto' unmountOnExit>
						<Box margin={1}>
							<Typography variant='h6' gutterBottom component='div'>
								Missions
							</Typography>
							<Table size='small'>
								<TableHead>
									<TableRow>
										<TableCell>Destination</TableCell>
										<TableCell>Target Faction</TableCell>
										<TableCell>Progress</TableCell>
										<TableCell>Wing Mission</TableCell>
										<TableCell>Status</TableCell>
										<TableCell>Reward</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{props.fact.map((mis) => {
										return <MissionRow props={mis} />;
									})}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};
const mapStateToProps = (state, ownProps) => {
	const fact = state.missions[ownProps.factionName];
	return { fact: fact, factName: ownProps.factionName };
};

export default connect(mapStateToProps)(DataRow);
