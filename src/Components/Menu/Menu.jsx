import React from "react";
import { Drawer } from "@material-ui/core";
import { connect } from "react-redux";
import { toggleMenu, toggleTheme } from "../../redux/actions.js";
import {
	List,
	Divider,
	ListItem,
	ListItemText,
	ListItemIcon,
	Toolbar,
	ListItemSecondaryAction,
	Switch
} from "@material-ui/core";
import {Brightness2} from '@material-ui/icons';
import MenuItems from "../../Pages/MenuItems";
import { Link } from "react-router-dom";

const Menu = (props) => (
	<Drawer
		anchor={"left"}
		open={props.appState.showMenu}
		onClose={props.toggleMenu}>
		<Toolbar />
		<List>
			{MenuItems.map((item, index) => (
				<ListItem
					button
					component={Link}
					key={item.text}
					to={item.route}
					onClick={props.toggleMenu}>
					<ListItemIcon>{item.icon}</ListItemIcon>
					<ListItemText primary={item.text} />
				</ListItem>
			))}
			<Divider/>
			<ListItem>
				<ListItemIcon>
					<Brightness2 />
				</ListItemIcon>
				<ListItemText id="switch-list-label-wifi" primary="Dark Mode" />
				<ListItemSecondaryAction>
					<Switch
						edge="end"
						checked={props.appState.darkTheme} onChange={props.toggleTheme} color="primary"
					/>
				</ListItemSecondaryAction>
      		</ListItem>	
		</List>
		<Divider />
	</Drawer>
);

const mapStateToProps = (state) => {
	return { appState: { ...state.ui } };
};
const mapDispatchToProps = {
	toggleMenu, toggleTheme
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
