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

	const getVal = (val) => {
		let tempSum = 0;
		for (let i = 0; i < props.fact.length; i++) {
			tempSum = tempSum + props.fact[i][val];
		}
		return tempSum;
	};
	const getCompleteVal = () => {
		let curVal = 0;
		for (let i = 0; i < props.fact.length; i++) {
			if (props.fact[i].Status == "Done") {
				curVal = curVal + props.fact[i].Reward;
			}
		}
		return curVal;
	};

	return (
		<>
			<TableRow>
				<TableCell>
					<IconButton size='small' onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell>{props.factName}</TableCell>
				<TableCell>{props.fact.length}</TableCell>
				<TableCell>
					{getVal("Kills")} / {getVal("Count")}
				</TableCell>
				<TableCell>{getCompleteVal().toLocaleString()}</TableCell>
				<TableCell>{getVal("Reward").toLocaleString()}</TableCell>
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
