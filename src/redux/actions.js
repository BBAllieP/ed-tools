import * as actions from "./actionTypes";

export const toggleMenu = () => ({
	type: actions.TOGGLE_MENU,
});

export const toggleTheme = () => ({
	type: actions.TOGGLE_THEME,
});


export const addMission = (payload) => ({
	type: actions.ADD_MISSION,
	payload: payload,
});

export const removeMission = (payload) => ({
	type: actions.REMOVE_MISSION,
	payload: payload,
});

export const modifyMission = (payload) => ({
	type: actions.MODIFY_MISSION,
	payload: payload,
});

export const addAllFactions = (payload) => ({
	type: actions.ADD_ALL_FACTION,
	payload: payload,
});

export const getAllFactions = () => ({
	type: actions.GET_ALL_FACTION,
	payload: null,
});

export const acceptRoute = (payload) => ({
	type: actions.ACCEPT_ROUTE,
	payload: payload,
})