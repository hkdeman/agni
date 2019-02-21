import React, { Component } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Grid, Button, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import GreenLEDLight from './GreenLEDLight';
import XSSHForm from '../../containers/ui/XSSHForm';

const styles = {
    menuButton: {
        marginRight: 20,
      },
      title: {
          margin: "0 20px 0 20px"
      },
      rightAligned: {
          justifyContent: "flex-end",
      },
};

export default class FixedAppBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hostButtonDOMElem: null,
            currentHost: 1,
            sshFormOpen: false,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    hostHandler(e) {
        this.setState({
            hostButtonDOMElem: e.currentTarget,
        });
    }
    
    hostMenuCloseHandler() {
        this.setState({
            hostButtonDOMElem: null,
        });
    }

    handleSSHForm(status) {
        this.setState({
            sshFormOpen: status,
        });
    }

    render() {
        return(
            <AppBar position="fixed" color="default">
                <Toolbar>
                <IconButton style={styles.menuButton} color="default" aria-label="Menu" onClick={this.props.toggleDrawer.bind(this, true)}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h5" color="default" style={styles.title}>
                    Agni
                </Typography>
                <Grid container style={styles.rightAligned}>
                    <Button onClick={this.hostHandler.bind(this)} color="default">Host</Button>
                    <Button color="default">Logout</Button>
                </Grid>
                <Menu id="simple-menu" 
                    anchorEl={this.state.hostButtonDOMElem} 
                    open={Boolean(this.state.hostButtonDOMElem)} 
                    onClose={this.hostMenuCloseHandler.bind(this)}>
                    <MenuItem key="1">
                        <Grid container direction="row" justify="flex-end" alignItems="center">
                            {this.state.currentHost === 1 ? <GreenLEDLight /> : ""} Localhost 
                        </Grid>
                    </MenuItem>
                    <MenuItem key="2" onClick={this.handleSSHForm.bind(this, true)}> 
                        <Grid container direction="row" justify="flex-end" alignItems="center">
                            {this.state.currentHost === 2 ? <GreenLEDLight /> : ""} 
                            {this.state.currentHost === 2 ? "SSH Established" : "Setup SSH"}
                        </Grid>
                    </MenuItem>
                </Menu>
                </Toolbar>
                <XSSHForm open={this.state.sshFormOpen} toggleDialog={this.handleSSHForm.bind(this)} />
            </AppBar>
        );
    }
}