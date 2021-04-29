import * as actions from "./actionTypes";

export const toggleMenu = () => ({
	type: actions.TOGGLE_MENU,
});

export const wsConnect = (host) => ({
	type: actions.WS_CONNECT,
	payload: host,
});

export const wsConnecting = (host) => ({
	type: actions.WS_CONNECTING,
	payload: host,
});

export const wsConnected = (host) => ({
	type: actions.WS_CONNECTED,
	payload: host,
});

export const wsDisconnect = (host) => ({
	type: actions.WS_DISCONNECT,
	payload: host,
});
export const wsDisconnected = (host) => ({
	type: actions.WS_DISCONNECTED,
	payload: host,
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
