import { React, useState, useEffect } from "react";
import { Container, Fab } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import LoadModal from "./LoadModal";
import RouteTimeline from "./RouteTimeline";
import { connect } from "react-redux";
import RouteHeader from "./RouteHeader";
import { getRoutes, deleteRoute } from "../../redux/actions";
import LoadPage from "./LoadPage";
import _ from "lodash";
import ClearIcon from '@material-ui/icons/Clear';

const fabStyle = {
	margin: 0,
	top: "auto",
	right: 20,
	bottom: 20,
	left: "auto",
	position: "fixed",
};
const fabStyle2 = {
	margin: 0,
	top: "auto",
	right: 20,
	bottom: 80,
	left: "auto",
	position: "fixed",
};
const RoutePlanner = (props) => {
	const [loadShown, showLoad] = useState(false);
	const handleModal = () => {
		showLoad(!loadShown);
	};

	return (
		<Container style={{ height: "90%" }}>
			{_.isEmpty(props.routes.currentRoute.Destinations) ? (
				<LoadPage />
			) : (
				<Container
					style={{ height: "100%", display: "flex", flexDirection: "column" }}>
					{" "}
					<RouteHeader /> <RouteTimeline route={props.routes} />{" "}
				</Container>
			)}
			<LoadModal shown={loadShown} toggle={handleModal} />
			<Fab style={fabStyle} color='primary' onClick={handleModal}>
				<Add />
			</Fab>
            {!_.isEmpty(props.routes.currentRoute.Destinations) && <Fab style={fabStyle2} color='primary' onClick={props.deleteRoute}>
				<ClearIcon />
			</Fab>}
            
		</Container>
	);
};

const mapStateToProps = (state) => {
	return {
		routes: { ...state.routes },
		socketState: { ...state.websocketReducer },
	};
};
const mapDispatchToProps = {
	getRoutes,
    deleteRoute
};

export default connect(mapStateToProps, mapDispatchToProps)(RoutePlanner);
