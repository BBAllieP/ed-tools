
import SecurityIcon from '@material-ui/icons/Security';
import Shields from './Shields';
import Home from './Home';
import Fleet from './Fleet';
import RoutePlanner from './RoutePlanner';
import FleetIcon from './Fleet/ico';
import GalaxyIcon from './RoutePlanner/ico';
import HomeIcon from './Home/ico';

const MenuItems = [
    {text: 'Home', icon: <HomeIcon />, route: '/', page: <Home />, isExact: true }, 
    {text: 'Shield Calculator', icon: <SecurityIcon />, route: '/shields', page: <Shields />},
    {text: 'RoutePlanner', icon: <GalaxyIcon />, route: '/route-planner', page: <RoutePlanner />},
    {text: 'My Fleet', icon: <FleetIcon />, route: '/fleet', page: <Fleet />},
];

export default MenuItems;