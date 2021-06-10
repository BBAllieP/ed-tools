import * as actionTypes from "../actionTypes";
import produce from 'immer';

const initialState = {currentRoute: {}, step: 0, superCharged: false};

export default function routesState(state = { ...initialState }, action) {
	
	switch (action.type) {
		case actionTypes.ADD_ALL_ROUTES:
			return {...state, currentRoute: action.payload}
		case actionTypes.ADD_ROUTE:
			return {...state, currentRoute: action.payload}
		case actionTypes.DEEP_SCAN:
			return produce((draft, state)=>{
				draft.currentRoute.Destinations[state.step].Bodies[action.payload].DeepScanned = true;
			});
		case actionTypes.LIGHT_SCAN:
			return produce((draft, state)=>{
				draft.currentRoute.Destinations[state.step].Bodies[action.payload].LightScanned = true;
			});
		case actionTypes.SYSTEM_VISIT:
			return produce((draft, state)=>{
				draft.step = action.payload;
				draft.currentRoute.Destinations[action.payload].Visited = true;
			});
		case actionTypes.SUPER_CHARGE:
			return produce((draft,state)=>{
				draft.superCharged = action.payload;
			});
		case actionTypes.UNSET_COPY:
			return produce((draft,state)=>{
				draft.currentRoute.Destinations[action.payload].Copied = false;
			});
		case actionTypes.SET_COPY:
			return produce((draft,state)=>{
				draft.currentRoute.Destinations[action.payload].Copied = true;
			})
		default:
			return state;
	}
}

/* Messages to Process:
{"SystemVisit", i index of system in route}
		needs to also set i as current system
{"SuperCharge", bool value whether FSD is supercharged}
{"UnsetCopy", i index of system in route}
{"SetCopy", i index of system in route}

*/

/*
SYSTEM_VISIT
SUPER_CHARGE
UNSET_COPY
SET_COPY*/