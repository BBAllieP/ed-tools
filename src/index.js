import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./Containers/App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#4f4f4f",
		},
		secondary: {
			main: "#919191",
		},
	},
});

const rootElement = document.getElementById("root");
ReactDOM.render(
	<Provider store={store}>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</Provider>,
	rootElement
);
