import React from "react";
import {
	TableCell,
	TableBody,
	TableRow,
	TableContainer,
	Collapse,
	Box,
	Typography,
} from "@material-ui/core";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const DataRow = (props) => {
	const [open, setOpen] = useState(false);
	var sumKills = 0;
	var sumVal = 0;
	var curVal = 0;
	var getStats = () => {
		props.forEach((mis) => {
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
		<React.Fragment>
			<TableRow>
				<TableCell>
					<IconButton size='small' onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
					</IconButton>
				</TableCell>
				<TableCell>{props.name}</TableCell>
				<TableCell>{props.length}</TableCell>
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
								<TableHeader>
									<TableRow>
										<TableCell>Destination</TableCell>
										<TableCell>Status</TableCell>
										<TableCell>Kills</TableCell>
										<TableCell>Kills Required</TableCell>
										<TableCell>Reward</TableCell>
									</TableRow>
								</TableHeader>
								<TableBody>
									{props.map((mis) => {
										return <MissionRow props={mis} />;
									})}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
};

export default DataRow;
