import "./App.css";
import { connect } from "react-redux";
import { getAllFactions } from "../redux/actions";
import { wsConnect, wsDisconnect } from "../redux/reducers/websocket";
import { useEffect } from "react";
import Header from "../Components/Header";
import Menu from "../Components/Menu";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import MenuItems from "../Pages/MenuItems";
import {Paper, Grid} from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from '@material-ui/core/styles';

const lightTheme = createMuiTheme({
	palette: {
		primary: {
			main: "#4f4f4f",
		},
		secondary: {
			main: "#919191",
		},
	},
});
const darkTheme = createMuiTheme({
	palette: {
		primary: {
			main: "#4f4f4f",
		},
		secondary: {
			main: "#919191",
		},
		type: 'dark'
	},
});

const useStyles = makeStyles(theme => ({
	root: {
	  display: "flex",
	  flexFlow: "column",
	  height: "100vh"
	},
	paper: {
		flexGrow: 1,
		width: "100%",
		textAlign: "center",
	}
  }));

function App(props) {
	const classes = useStyles();
	useEffect(() => {
		props.wsConnect("ws://127.0.0.1:8844/ws");
		return function cleanup() {
			props.wsDisconnect("ws://127.0.0.1:8844/ws");
		};
	}, []);
	return (
		<ThemeProvider theme={props.uiState.darkTheme ? darkTheme : lightTheme}>
		<div className={classes.root}>
			<Router>
				<Header />
				<Menu />
				<Paper className={classes.paper}>
				<Switch>
					{MenuItems.map((i, index) => (
						<Route key={i} exact={i.isExact} path={i.route}>
							{i.page}
						</Route>
					))}
				</Switch>
			</Paper>
			</Router>
		</div>
		</ThemeProvider>
	);
}

const mapDispatchToProps = {
	wsConnect: (host) => wsConnect(host),
	wsDisconnect: (host) => wsDisconnect(host),
	getAllFactions,
};
const mapStateToProps = (state) => {
	return { socketState: { ...state.websocketReducer }, uiState: {...state.ui} };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
