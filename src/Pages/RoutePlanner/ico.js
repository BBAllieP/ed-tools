import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as MapIcon } from '../../resources/img/planet-galaxy.svg';

function GalaxyIcon(props) {
    return (
      <SvgIcon {...props} >
<MapIcon />
      </SvgIcon>
    );
} 
export default GalaxyIcon;