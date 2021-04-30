import "./App.css";
import { connect } from "react-redux";
import { getAllFactions } from "../redux/actions";
import { wsConnect, wsDisconnect } from "../redux/reducers/websocket";
import { useEffect } from "react";
import Header from "../Components/Header";
import Menu from "../Components/Menu";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MenuItems from "../Pages/MenuItems";
import Paper from "@material-ui/core/Paper";

function App(props) {
	useEffect(() => {
		props.wsConnect("ws://127.0.0.1:8844/ws");
		//props.getAllFactions();
		return function cleanup() {
			props.wsDisconnect("ws://127.0.0.1:8844/ws");
		};
	});
	return (
		<div className='App'>
			<Router>
				<Header />
				<Menu />
				<Paper>
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
	);
}

const mapDispatchToProps = {
	wsConnect: (host) => wsConnect(host),
	wsDisconnect: (host) => wsDisconnect(host),
	getAllFactions,
};

export default connect(null, mapDispatchToProps)(App);
