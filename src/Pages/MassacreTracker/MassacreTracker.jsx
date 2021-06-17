import React, {useEffect} from "react";
import { Typography, Grid, Container, Fab } from "@material-ui/core";
import FactionRow from "./FactionRow";
import { connect } from "react-redux";
import { getAllFactions } from "../../redux/actions";
import RefreshIcon from '@material-ui/icons/Refresh';
import {useInterval} from "../../utils/genericUtils";
import { makeMil } from "../../utils/numUtils";
import CircleProgress from "./CircleProgress";
import ProgressBar from "./ProgressBar";
const fabStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
}
const MassacreTracker = (props) => {

	const getVal = (val, fact, complete) => {
		let tempSum = 0;
		for (let i = 0; i < fact.length; i++) {
			if (complete) {
				if (fact[i].Status === "Done") {
					tempSum += fact[i][val];
				}
			} else {
				tempSum = tempSum + fact[i][val];
			}
		}
		return tempSum;
	};
	const maxKills = (needed) => {
		let maxNum = 0;
		let tempCount = 0;
		Object.keys(props.missionState).forEach((f) => {
			if (needed) {
				tempCount = getVal("Count", props.missionState[f], false);
			} else {
				tempCount = getVal("Kills", props.missionState[f], false);
			}
			if (tempCount > maxNum) {
				maxNum = tempCount;
			}
		});
		return maxNum;
	};

	const totalReward = () => {
		let sumReward = 0;
		Object.keys(props.missionState).forEach((f) => {
			sumReward += getVal("Reward", props.missionState[f], false);
		});
		return sumReward;
	};
	const currentReward = () => {
		let sumReward = 0;
		Object.keys(props.missionState).forEach((f) => {
			sumReward += getVal("Reward", props.missionState[f], true);
		});
		return sumReward;
	};
	const numMissions = () => {
		let countMissions = 0;
		Object.keys(props.missionState).forEach((f) => {
			countMissions += props.missionState[f].length;
		});
		return countMissions;
	};
	return (
		<Container style={{overflow:'auto'}}>
		<Grid container spacing={3}>
			<Grid item xs={12} />
			<Grid item xs={4}>
				<Grid container direction='column' justify='space-evenly' spacing={4}>
					<Grid item xs={12}>
						<Typography variant='h4'>Stats</Typography>
					</Grid>
					<Grid item container>
						<Grid item xs={12}>
							Stack Width: {Object.keys(props.missionState).length}
						</Grid>
						<Grid item xs={12}>
							Total Kills Needed: {maxKills(true)}
						</Grid>
						<Grid item xs={12}>
							Total Kills Completed: {maxKills(false)}
						</Grid>
						<Grid item xs={12}>
							Total Missions: {numMissions()}
						</Grid>
						<Grid item xs={12}>
							Total Reward: {makeMil(totalReward())}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={4}>
				<Grid container direction='column' justify='space-evenly' spacing={8}>
					<Grid item xs={12}>
						<Typography variant='h4'>Kill Progress</Typography>
					</Grid>
					<Grid item xs={12}>
						<ProgressBar kills={maxKills(false)} total={maxKills(true)} />
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={4}>
				<Grid container>
					<Grid item xs={12}>
						<Typography variant='h4'>Credits Earned</Typography>
					</Grid>
					<Grid container item xs={12} justify='center'>
						<CircleProgress value={currentReward()} maxValue={totalReward()} />
					</Grid>
				</Grid>
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
		<Fab style={fabStyle} color='primary' onClick={props.getAllFactions}>
			<RefreshIcon />
		</Fab>
		</Container>
	);
};
const mapStateToProps = (state) => {
	return { missionState: { ...state.missions }, 
	socketState: { ...state.websocketReducer } 
	}; 
};
const mapDispatchToProps = {
	getAllFactions,
};

export default connect(mapStateToProps, mapDispatchToProps)(MassacreTracker);
