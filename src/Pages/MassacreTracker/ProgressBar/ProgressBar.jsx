import React from "react";
import { Progress } from "semantic-ui-react";
const ProgressBar = (props) => {
	return (
		<Progress
			value={props.kills}
			total={props.total}
			indicating
			progress='ratio'
			success={props.kills === props.total}
			size='big'
		/>
	);
};

export default ProgressBar;
