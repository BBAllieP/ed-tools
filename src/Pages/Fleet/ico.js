import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as RocketIcon } from '../../resources/img/inclined-rocket.svg';

function FleetIcon(props) {
    return (
      <SvgIcon {...props} >
<RocketIcon />
      </SvgIcon>
    );
} 
export default FleetIcon;