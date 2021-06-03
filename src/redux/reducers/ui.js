import "../actionTypes";
import * as actionTypes from "../actionTypes";

const initialState = {
	showMenu: false,
	darkTheme: false
};

export default function uiState(state = initialState, action) {
	switch (action.type) {
		case actionTypes.TOGGLE_MENU: {
			state = { ...state, showMenu: !state.showMenu };
			return state;
		}
		case actionTypes.TOGGLE_THEME: {
			state = {...state, darkTheme: !state.darkTheme};
			return state;
		}
		default: {
			return state;
		}
	}
}
