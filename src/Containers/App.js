import "./App.css";
import { connect } from "react-redux";
import { getAllFactions, getRoutes } from "../redux/actions";
import { wsConnect, wsDisconnect } from "../redux/reducers/websocket";
import { useEffect } from "react";
import TitleBar from "../Components/TitleBar";
import Menu from "../Components/Menu";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import MenuItems from "../Pages/MenuItems";
import {Paper, Grid, Container, CssBaseline} from "@material-ui/core";
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
	  height: "100%",
	  minHeight: "100%",
	  overflow: "hidden",
	},
	paper: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column"
	},
	toolbar: theme.mixins.toolbar,
  }));

function App(props) {
	const classes = useStyles();
	useEffect(() => {
		props.wsConnect("ws://127.0.0.1:8844/ws");

	}, []);
	useEffect(()=>{
		if(props.socketState.connected){
			//props.getAllFactions();
			props.getRoutes();
		} else {
			props.wsConnect("ws://127.0.0.1:8844/ws");
		}
		
	}, [props.socketState.connected])
	return (
		<ThemeProvider theme={props.uiState.darkTheme ? darkTheme : lightTheme}>
		<CssBaseline />
		<div className={classes.root}>
			<Router>
				<TitleBar />
				<Menu />
				<Container className={classes.paper} >
					<div className={classes.toolbar} />
					<Switch>
						{MenuItems.map((i, index) => (
							<Route key={i} exact={i.isExact} path={i.route}>
								{i.page}
							</Route>
						))}
					</Switch>
				</Container>
			</Router>
		</div>
		</ThemeProvider>
	);
}

const mapDispatchToProps = {
	wsConnect: (host) => wsConnect(host),
	wsDisconnect: (host) => wsDisconnect(host),
	getAllFactions,
	getRoutes,
};
const mapStateToProps = (state) => {
	return { socketState: { ...state.websocketReducer }, uiState: {...state.ui} };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
