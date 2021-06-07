import * as actionTypes from "../actionTypes";
import produce from 'immer';

const initialState = {currentRoutes: [], activeRoute: 0};

export default function routesState(state = { ...initialState }, action) {
	
	switch (action.type) {
		case actionTypes.ADD_ALL_ROUTES:
			return {...state, currentRoutes: action.payload}
		case actionTypes.ADD_ROUTE:
			return produce(state, draft => {
				var found = false;
				state.currentRoutes.forEach((rt, ind) => {
					if(rt["Id"] === action.payload["Id"]){
						draft.currentRoutes[ind] = action.payload;
						found = true;
					}
				});
				if(!found){
					draft.currentRoutes = [...draft.currentRoutes, action.payload]
				}
			})
		default:
			return state;
	}
}
