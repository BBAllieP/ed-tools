import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./Containers/App";
import { Provider } from "react-redux";
import store from "./redux/store";
import "semantic-ui-css/semantic.min.css";


const rootElement = document.getElementById("root");
ReactDOM.render(
	<Provider store={store}>
			<App height="100%"/>
	</Provider>,
	rootElement
);
