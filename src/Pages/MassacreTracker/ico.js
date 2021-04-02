import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as StationIcon } from "../../resources/img/Massacre.svg";

function MassacreIcon(props) {
	return (
		<SvgIcon {...props}>
			<StationIcon />
		</SvgIcon>
	);
}
export default MassacreIcon;
