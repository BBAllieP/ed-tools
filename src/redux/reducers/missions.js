import * as actionTypes from "../actionTypes";
import * as utils from "../utils";

const initialState = {};

export default function (state = { ...initialState }, action) {
	switch (action.type) {
		case actionTypes.ADD_MISSION:
			var tempState = { ...state };
			var returnFact = utils.addMission(state, action.payload);
			tempState = { ...state, returnFact };
			return tempState;

		case actionTypes.REMOVE_MISSION:
			var returnFact = utils.removeMission(state, action.payload);
			var tempState = { ...state };
			if (returnFact.length < 1) {
				delete tempState[returnFact.key];
				return tempState;
			} else {
				return (state = { ...state, returnFact });
			}
		case actionTypes.MODIFY_MISSION:
			var returnFact = utils.changeMission(state, action.payload);
			return { ...state, returnFact };

		case actionTypes.ADD_ALL_FACTION:
			return { ...utils.translateFactions(action.payload) };
		default:
			return state;
	}
}
