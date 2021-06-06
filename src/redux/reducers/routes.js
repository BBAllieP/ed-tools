import * as actionTypes from "../actionTypes";
import * as utils from "../utils";
import produce from 'immer';

const initialState = {currentRoutes: []};

export default function routesState(state = { ...initialState }, action) {
	
	switch (action.type) {
		case actionTypes.ACCEPT_ROUTE:
            return produce(state, draft => {
                draft.currentRoutes.push(action.payload)
            })
		default:
			return state;
	}
}
