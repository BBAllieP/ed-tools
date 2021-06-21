import React from "react";
import { connect } from "react-redux";
import { Grid, Typography, Link } from "@material-ui/core";
const { shell } = window.require("electron");

const LoadPage = (props) => {
	return (
		<>
			<Typography variant='h5'>To load a route, please export from </Typography>

			<Typography variant='h5'>
				<Link
					onClick={() => shell.openExternal("https://www.spansh.co.uk")}
					target='_blank'
					gi>
					the Spansh tool
				</Link>
			</Typography>
			<Typography variant='h5'>
				{" "}
				and import using the "+" button below
			</Typography>
		</>
	);
};

export default LoadPage;
