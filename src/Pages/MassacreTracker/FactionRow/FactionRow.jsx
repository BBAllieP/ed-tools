import { React, useState } from "react";
import clsx from "clsx";
import { makeMil } from "../../../utils/numUtils";
import { v4 as uuidv4 } from "uuid";
import {
	TableCell,
	TableBody,
	TableRow,
	Collapse,
	Box,
	IconButton,
	Table,
	TableHead,
	Card,
	CardHeader,
	CardContent,
	Grid,
	Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MissionRow from "./MissionRow";
import { connect } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
	red,
	pink,
	purple,
	deepPurple,
	indigo,
	blue,
	lightBlue,
	cyan,
	teal,
	green,
	lightGreen,
	lime,
} from "@material-ui/core/colors";
import * as colorUtils from "../../../utils/colorUtils";

const colors = [
	red,
	pink,
	purple,
	deepPurple,
	indigo,
	blue,
	lightBlue,
	cyan,
	teal,
	green,
	lightGreen,
	lime,
];
const shades = [
	100,
	200,
	300,
	400,
	500,
	600,
	700,
	800,
	900,
	"A100",
	"A200",
	"A400",
	"A700",
];

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345,
	},
	media: {
		height: 0,
		paddingTop: "56.25%", // 16:9
	},
	expand: {
		transform: "rotate(0deg)",
		marginLeft: "auto",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: "rotate(180deg)",
	},
}));

const getColor = (str) =>
	colors[colorUtils.stringToIndex(str, colors.length)][
		shades[colorUtils.stringToIndex(str, shades.length)]
	];

const FactionRow = (props) => {
	const [open, setOpen] = useState(false);
	const classes = useStyles();
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
			if (props.fact[i].Status === "Done") {
				curVal = curVal + props.fact[i].Reward;
			}
		}
		return curVal;
	};

	return (
		<Card raised={true}>
			<CardHeader
				avatar={
					<Avatar
						aria-label='faction'
						style={{
							backgroundColor: getColor(props.factName),
						}}>
						{props.factName.charAt(0)}
					</Avatar>
				}
				title={props.factName}
				subheader=''
				titleTypographyProps={{ variant: "h4" }}
			/>
			<CardContent>
				<Grid container spacing={3}>
					<Grid item xs={3}>
						Missions: {props.fact.length}
					</Grid>
					<Grid item xs={3}>
						Kills: {getVal("Kills")} / {getVal("Count")}
					</Grid>
					<Grid item xs={3}>
						Reward: {makeMil(getCompleteVal())} / {makeMil(getVal("Reward"))}
					</Grid>
					<Grid item xs={3}>
						<IconButton
							className={clsx(classes.expand, {
								[classes.expandOpen]: open,
							})}
							onClick={() => setOpen(!open)}
							aria-expanded={open}
							aria-label='show more'>
							<ExpandMoreIcon />
						</IconButton>
					</Grid>
				</Grid>
			</CardContent>
			<Collapse in={open} timeout='auto' unmountOnExit>
				<Box margin={1}>
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
								return <MissionRow key={uuidv4()} props={mis} />;
							})}
						</TableBody>
					</Table>
				</Box>
			</Collapse>
		</Card>
	);
};
const mapStateToProps = (state, ownProps) => {
	const fact = state.missions[ownProps.factionName];
	return { fact: fact, factName: ownProps.factionName };
};

export default connect(mapStateToProps)(FactionRow);
