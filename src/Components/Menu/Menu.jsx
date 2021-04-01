import React from 'react';
import {Drawer} from '@material-ui/core';
import {connect} from 'react-redux';
import {toggleMenu} from '../../redux/actions.js'
import {List, Divider,ListItem,ListItemText,ListItemIcon, Toolbar} from '@material-ui/core';
import MenuItems from '../../Pages/MenuItems';
import {Link} from 'react-router-dom';

const Menu = (props) => (
    <Drawer anchor={'left'} open={props.appState.showMenu} onClose={props.toggleMenu}>
      <Toolbar />
      <List>
        {MenuItems.map((item, index) => (
          <ListItem button component={Link} key={item.text} to={item.route} onClick={props.toggleMenu}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
);

const mapStateToProps = (state) => {
    return {appState: {...state}}
  };
  const mapDispatchToProps = {
    toggleMenu
  }  

export default connect(mapStateToProps, mapDispatchToProps)(Menu);