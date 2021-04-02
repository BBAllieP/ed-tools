import "./App.css";
import { connect, sendMsg } from "../api";
import { useEffect } from "react";
import Header from "../Components/Header";
import Menu from "../Components/Menu";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MenuItems from "../Pages/MenuItems";
import Paper from "@material-ui/core/Paper";

function App() {
	return (
		<div className='App'>
			<Router>
				<Header />
				<Menu />
				<Paper>
					<Switch>
						{MenuItems.map((i, index) => (
							<Route exact={i.isExact} path={i.route}>
								{i.page}
							</Route>
						))}
					</Switch>
				</Paper>
			</Router>
		</div>
	);
}

export default App;
