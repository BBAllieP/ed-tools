import "../actionTypes";
import { TOGGLE_MENU } from "../actionTypes";

const initialState = {
	showMenu: false,
};

export default function uiState(state = initialState, action) {
	switch (action.type) {
		case TOGGLE_MENU: {
			state = { ...state, showMenu: !state.showMenu };
			return state;
		}
		default: {
			return state;
		}
	}
}
