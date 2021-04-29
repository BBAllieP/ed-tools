import * as actionTypes from "../actionTypes";
import * as utils from "../utils";

const initialState = {};

export default function (state = initialState, action) {
	switch (action.type) {
		case actionTypes.ADD_MISSION: {
			var returnFact = utils.addMission(state, action.payload);
			state = { ...state, returnFact };
		}
		case actionTypes.REMOVE_MISSION: {
			var returnFact = utils.removeMission(state, action.payload);
			if (returnFact.length < 1) {
				delete state[returnFact.key];
			} else {
				state = { ...state, returnFact };
			}
		}
		case actionTypes.MODIFY_MISSION: {
			var returnFact = utils.changeMission(state, action.payload);
			state = { ...state, returnFact };
		}
		case actionTypes.ADD_ALL_FACTION: {
			state = JSON.parse(JSON.stringify(action.payload));
		}
		default: {
			return state;
		}
	}
}
