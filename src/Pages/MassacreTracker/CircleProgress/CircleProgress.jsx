import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import * as numUtils from "../../../utils/numUtils";
import "react-circular-progressbar/dist/styles.css";
import { red, blue, green } from "@material-ui/core/colors";

const CircleProgress = (props) => {
	const colors = [red[600], blue[500], green[400]];
	const getColor = () => {
		let prog = props.value / props.maxValue;
		if (prog < 0.33) {
			return colors[0];
		} else if (prog >= 0.33 && prog < 0.66) {
			return colors[1];
		} else if (prog >= 0.66 && prog < 1) {
			return colors[2];
		} else {
			return green[800];
		}
	};
	const getTextColor = () => {
		if (props.value === props.maxValue) {
			return green[800];
		} else {
			return getColor();
		}
	};
	const styles = {
		root: {},
		path: {
			stroke: `${getColor()}`,
		},
		trail: {},
		text: {
			fill: `${getTextColor()}`,
			fontSize: "12px",
		},
		background: {
			fill: `${green[100]}`,
		},
	};
	return (
		<div style={{ width: 200, hieght: 200 }}>
			<CircularProgressbar
				value={props.value}
				minValue={0}
				maxValue={props.maxValue}
				text={numUtils.makeMil(props.value)}
				styles={styles}
				background={props.maxValue === props.value}
			/>
		</div>
	);
};

export default CircleProgress;
