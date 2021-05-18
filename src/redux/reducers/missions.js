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
				if(action.payload.Faction in draft){
					draft[action.payload.Faction].push(action.payload)
				} else {
					draft[action.payload.Faction] = [action.payload]
				}
				
			})
		case actionTypes.REMOVE_MISSION:
			return produce(state, draft => {
				if(state[action.payload.Faction].length <= 1){
					delete draft[action.payload.Faction]
				} else {
					draft[action.payload.Faction]=state[action.payload.Faction].filter(mis=>{
					return mis.MissionID === action.payload.MissionID
					})
				}
			})
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
