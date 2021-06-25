import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as StationIcon } from "../../resources/img/mercenary.svg"

function MassacreIcon(props) {
	return (
		<SvgIcon {...props}>
			<StationIcon />
		</SvgIcon>
	);
}
export default MassacreIcon;
