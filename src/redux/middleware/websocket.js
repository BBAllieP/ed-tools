import * as actions from "../actions";
import * as wsActions from "../reducers/websocket";
import * as actionTypes from "../actionTypes";

const socketMiddleware = () => {
	let socket = null;

	const onOpen = (store) => (event) => {
		console.log("websocket open", event.target.url);
		store.dispatch(wsActions.wsConnected(event.target.url));
		store.dispatch(actions.getAllFactions());
	};

	const onClose = (store) => () => {
		store.dispatch(wsActions.wsDisconnected());
	};

	const onMessage = (store) => (event) => {
		const payload = JSON.parse(event.data);
		console.log("receiving server message: " + payload.action);

		switch (payload.action) {
			case "MissionAccepted":
				console.log("MissionAccepted");
				store.dispatch(actions.addMission(payload.mission));
				break;
			case "MissionFailed":
				store.dispatch(actions.removeMission(payload.mission));
				break;
			case "MissionAbandoned":
				console.log("MissionAbandoned")
				store.dispatch(actions.removeMission(payload.mission));
				break;
			case "MissionCompleted":
				store.dispatch(actions.removeMission(payload.mission));
				break;
			case "MissionRedirected":
				store.dispatch(actions.modifyMission(payload.mission));
				break;
			case "Bounty":
				console.log(payload);
				store.dispatch(actions.modifyMission(payload.mission));
				break;
			case "GetAllFactions":
				store.dispatch(actions.addAllFactions(payload.factions));
				break;
			default:
				break;
		}
	};

	// the middleware part of this function
	return (store) => (next) => (action) => {
		console.log(action.type);
		switch (action.type) {
			case actionTypes.WS_CONNECT:
				console.log("connect fired");
				if (socket !== null) {
					socket.close();
				}

				// connect to the remote host
				socket = new WebSocket("ws://127.0.0.1:8844/ws");
				console.log("Socket Created");

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
					JSON.stringify({
						action: "getFactions",
						value: action.msg,
					})
				);
				break;
			default:
				//console.log("the next action:", action);
				return next(action);
		}
	};
};

export default socketMiddleware();
