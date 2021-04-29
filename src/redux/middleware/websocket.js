import * as actions from "../actions";
import * as actionTypes from "../actionTypes";
import { GET_ALL_FACTION, WS_CONNECT } from "../actionTypes";

const socketMiddleware = () => {
	let socket = null;

	const onOpen = (store) => (event) => {
		console.log("websocket open", event.target.url);
		store.dispatch(actions.wsConnected(event.target.url));
	};

	const onClose = (store) => () => {
		store.dispatch(actions.wsDisconnected());
	};

	const onMessage = (store) => (event) => {
		const payload = JSON.parse(event.data);
		console.log("receiving server message");

		switch (payload.action) {
			case "MissionAccepted":
				store.dispatch(actions.addMission(payload.mission));
				break;
			case "MissionFailed":
				store.dispatch(actions.removeMission(payload.mission));
				break;
			case "MissionAbandoned":
				store.dispatch(actions.removeMission(payload.mission));
				break;
			case "MissionComplete":
				store.dispatch(actions.removeMission(payload.mission));
				break;
			case "Bounty":
				store.dispatch(actions.modifyMission(payload.mission));
			/*case "GetAllMissions":
				store.dispatch(actions.setMissions(payload.missions));*/
			case "GetAllFactions":
				store.dispatch(actions.addAllFactions(payload.factions));
			default:
				break;
		}
	};

	// the middleware part of this function
	return (store) => (next) => (action) => {
		switch (action.type) {
			case actionTypes.WS_CONNECT:
				if (socket !== null) {
					socket.close();
				}

				// connect to the remote host
				socket = new WebSocket(action.host);

				// websocket handlers
				socket.onmessage = onMessage(store);
				socket.onclose = onClose(store);
				socket.onopen = onOpen(store);

				break;
			case actionTypes.WS_DISCONNECT:
				if (socket !== null) {
					socket.close();
				}
				socket = null;
				console.log("websocket closed");
				break;
			case actionTypes.GET_ALL_FACTION:
				//console.log("sending a message", action.msg);
				socket.send(
					JSON.stringify({ action: GET_ALL_FACTION, value: action.msg })
				);
				break;
			default:
				console.log("the next action:", action);
				return next(action);
		}
	};
};

export default socketMiddleware();
