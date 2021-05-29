import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";
import wsMiddleware from "./middleware/websocket";
//const isDev = window.require('electron-is-dev');

/*const makeStore = () => {
	if (isDev){
		return createStore(
			rootReducer,
			compose(
				applyMiddleware(wsMiddleware),
				window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
			)
		);
	} else {
		return createStore(
			rootReducer,
			compose(
				applyMiddleware(wsMiddleware),
			)
		);
	}
}

export default makeStore();*/

export default createStore(
	rootReducer,
	compose(
		applyMiddleware(wsMiddleware),
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	)
);
