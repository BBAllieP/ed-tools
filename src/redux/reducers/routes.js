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
			return produce(state,draft=>{
				draft.currentRoute.Destinations[state.step].Bodies[action.payload].DeepScanned = true;
			});
		case actionTypes.LIGHT_SCAN:
			return produce(state,draft=>{
				draft.currentRoute.Destinations[state.step].Bodies[action.payload].LightScanned = true;
			});
		case actionTypes.SYSTEM_VISIT:
			return produce(state,draft=>{
				draft.step = action.payload;
				draft.currentRoute.Destinations[action.payload].Visited = true;
			});
		case actionTypes.SUPER_CHARGE:
			return produce(state,draft=>{
				draft.superCharged = action.payload;
			});
		case actionTypes.UNSET_COPY:
			return produce(state,draft=>{
				draft.currentRoute.Destinations[action.payload].Copied = false;
			});
		case actionTypes.SET_COPY:
			return produce(state,draft=>{
				draft.currentRoute.Destinations[action.payload].Copied = true;
			})
		default:
			return state;
	}
}