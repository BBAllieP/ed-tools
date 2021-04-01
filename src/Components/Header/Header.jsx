import React from 'react';
import {AppBar, Toolbar, IconButton, Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {connect} from 'react-redux';
import {toggleMenu} from '../../redux/actions.js'

const Header = (props) => (
    <AppBar position='relative' style={{zIndex: 1400}}>
        <Toolbar>
            <IconButton edge='start' aria-label="menu" onClick={props.toggleMenu}>
                <MenuIcon/>
            </IconButton>
            <Typography>
                Elite Dangerous Tools by CMDR BBAllie
            </Typography>
        </Toolbar>
    </AppBar>
)

const mapStateToProps = (state) => {
    return {appState: {...state}}
    // ... computed data from state and optionally ownProps
  };
  
const mapDispatchToProps = {
    toggleMenu
  }  

export default connect(mapStateToProps, mapDispatchToProps)(Header);