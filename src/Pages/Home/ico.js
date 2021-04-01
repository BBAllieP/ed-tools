import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as StationIcon } from '../../resources/img/Coriolis-Station.svg';

function HomeIcon(props) {
    return (
      <SvgIcon {...props} >
<StationIcon />
      </SvgIcon>
    );
} 
export default HomeIcon;