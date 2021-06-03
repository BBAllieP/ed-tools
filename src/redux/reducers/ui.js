import "../actionTypes";
import { TOGGLE_MENU, TOGGLE_THEME } from "../actionTypes";

const initialState = {
	showMenu: false,
	darkTheme: false
};

export default function uiState(state = initialState, action) {
	switch (action.type) {
		case TOGGLE_MENU: {
			state = { ...state, showMenu: !state.showMenu };
			return state;
		}
		case TOGGLE_THEME: {
			state = { ...state, darkTheme: !state.darkTheme };
			return state;
		}
		default: {
			return state;
		}
	}
}
