import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as StationIcon } from '../../resources/img/Coriolis-Station.svg';
import { ReactComponent as BeerIcon } from '../../resources/img/pint-of-beer-svgrepo-com.svg';

function HomeIcon(props) {
    return (
      <SvgIcon {...props} >
<StationIcon />
      </SvgIcon>
    );
} 

export function BeerIco(props){
  return(
    <SvgIcon {...props}>
      <BeerIcon />
    </SvgIcon>
  )
}
export default HomeIcon;