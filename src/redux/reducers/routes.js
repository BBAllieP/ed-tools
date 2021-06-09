import * as actionTypes from "../actionTypes";
import produce from 'immer';

const initialState = {currentRoute: {}};

export default function routesState(state = { ...initialState }, action) {
	
	switch (action.type) {
		case actionTypes.ADD_ALL_ROUTES:
			return {...state, currentRoute: action.payload}
		case actionTypes.ADD_ROUTE:
			return {...state, currentRoute: action.payload}
		default:
			return state;
	}
}
