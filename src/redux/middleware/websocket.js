import * as actions from "../actions";
import * as wsActions from "../reducers/websocket";
import * as actionTypes from "../actionTypes";

const socketMiddleware = () => {
	let socket = null;

	const onOpen = (store) => (event) => {
		console.log("websocket open", event.target.url);
		store.dispatch(wsActions.wsConnected(event.target.url));
		store.dispatch(actions.getAllFactions());
		store.dispatch(actions.getRoutes());
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
				store.dispatch(actions.modifyMission(payload.mission));
				break;
			case "GetAllFactions":
				store.dispatch(actions.addAllFactions(payload.factions));
				break;
			case "GetRoutes":
				console.log("getting routes")
				store.dispatch(actions.addAllRoutes(payload.body));
				break;
			case "AddRoute":
				console.log("Adding Route");
				store.dispatch(actions.addRoute(payload.body));
				break;
			case "DeepScan":
				store.dispatch(actions.deepScan(payload.body));
				break;
			case "LightScan":
				store.dispatch(actions.lightScan(payload.body));
				break;
			case "SystemVisit":
				store.dispatch(actions.systemVisit(payload.body));
				break;
			case "SuperCharge":
				store.dispatch(actions.superCharge(payload.body));
				break;
			case "UnsetCopy":
				store.dispatch(actions.unsetCopy(payload.body));
				break;
			case "SetCopy":
				store.dispatch(actions.setCopy(payload.body));
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
				socket.send(
					JSON.stringify({
						action: "getFactions",
						value: action.msg,
					})
				);
				break;
			case actionTypes.ACCEPT_ROUTE:
				socket.send(
					JSON.stringify({
						action: "acceptRoute",
						value: action.payload
					})
				);
				break;
			case actionTypes.GET_ROUTES:
				socket.send(
					JSON.stringify({
						action: "getRoutes",
						value: action.payload
					})
				);
				break;
			case actionTypes.SEND_COPY:
				socket.send(
					JSON.stringify({
						action: "copyDestination",
						value: action.payload
					})
				);
				break;
			case actionTypes.DELETE_ROUTE:
				socket.send(
					JSON.stringify({
						action: "deleteRoute",
						value: null
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
