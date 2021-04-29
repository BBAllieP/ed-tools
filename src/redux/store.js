import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";
import wsMiddleware from "./middleware/websocket";

export default createStore(rootReducer, compose(applyMiddleware(wsMiddleware)));
