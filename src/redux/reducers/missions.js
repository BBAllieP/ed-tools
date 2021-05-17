import * as actionTypes from "../actionTypes";
import * as utils from "../utils";
import produce from 'immer';

const initialState = {};

export default function missionState(state = { ...initialState }, action) {
	var tempState = {};
	var returnFact;
	switch (action.type) {
		case actionTypes.ADD_MISSION:
			return produce(state, draft => {
				draft[action.payload.Faction].push(action.payload)
			})
		case actionTypes.REMOVE_MISSION:
			tempState = { ...state };
			returnFact = utils.removeMission(tempState, action.payload);
			if (returnFact.length < 1) {
				delete tempState[returnFact.key];
				return tempState;
			} else {
				return { ...state, ...returnFact };
			}
		case actionTypes.MODIFY_MISSION:
			//tempState = {...state};
			returnFact = utils.changeMission(state, action.payload);
			//console.log(returnFact);
			return produce(state, draft=> {
				draft[action.payload.Faction] = returnFact
				})
		case actionTypes.ADD_ALL_FACTION:
			return { ...utils.translateFactions(action.payload) };
		default:
			return state;
	}
}
