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
});

export const addAllRoutes = (payload) => ({
	type: actions.ADD_ALL_ROUTES,
	payload: payload,
});

export const addRoute = (payload) => ({
	type: actions.ADD_ROUTE,
	payload: payload,
});

export const getRoutes = () => ({
	type: actions.GET_ROUTES,
	payload: null,
});

export const setActiveRoute = (payload) => ({
	type: actions.SET_ACTIVE_ROUTE,
	payload: payload
});

export const deepScan = (payload) => ({
	type: actions.DEEP_SCAN,
	payload: payload
});

export const lightScan = (payload) => ({
	type: actions.LIGHT_SCAN,
	payload: payload
});
export const systemVisit = (payload) => ({
	type: actions.SYSTEM_VISIT,
	payload: payload
});

export const superCharge = (payload) => ({
	type: actions.SUPER_CHARGE,
	payload: payload
});

export const unsetCopy = (payload) => ({
	type: actions.UNSET_COPY,
	payload: payload
});

export const setCopy = (payload) => ({
	type: actions.SET_COPY,
	payload: payload
});
