import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as MapIcon } from '../../resources/img/Map-galaxy-map.svg';

function GalaxyIcon(props) {
    return (
      <SvgIcon {...props} >
<MapIcon />
      </SvgIcon>
    );
} 
export default GalaxyIcon;