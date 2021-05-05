import * as actionTypes from "../actionTypes";
import * as utils from "../utils";

const initialState = {};

export default function missionState(state = { ...initialState }, action) {
	var tempState = {};
	var returnFact;
	switch (action.type) {
		case actionTypes.ADD_MISSION:
			tempState = { ...state };
			returnFact = utils.addMission(state, action.payload);
			tempState = { ...state, ...returnFact };
			return tempState;

		case actionTypes.REMOVE_MISSION:
			returnFact = utils.removeMission(state, action.payload);
			tempState = { ...state };
			if (returnFact.length < 1) {
				delete tempState[returnFact.key];
				return tempState;
			} else {
				return { ...state, returnFact };
			}
		case actionTypes.MODIFY_MISSION:
			returnFact = utils.changeMission(state, action.payload);
			console.log(returnFact);
			return { ...state, returnFact };

		case actionTypes.ADD_ALL_FACTION:
			return { ...utils.translateFactions(action.payload) };
		default:
			return state;
	}
}
