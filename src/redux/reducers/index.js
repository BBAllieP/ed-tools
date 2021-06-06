import missions from "./missions";
import ui from "./ui";
import { websocketReducer } from "./websocket";
import routes from "./routes";
import { combineReducers } from "redux";

export default combineReducers({ ui, missions, websocketReducer, routes });
