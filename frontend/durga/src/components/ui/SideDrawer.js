import React, { Component } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Drawer } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import SwapVertOutlinedIcon from '@material-ui/icons/SwapVertOutlined';
import DirectionsRunOutlinedIcon from '@material-ui/icons/DirectionsRunOutlined';
import SettingsRemoteSharpIcon from '@material-ui/icons/SettingsRemoteSharp';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import { Link } from 'react-router-dom';


const styles = {
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
};

export default class SideDrawer extends Component {
    constructor(props) {
        super(props);

        this.items = [
            {
                text: "Overview",
                onClick: this.overviewHandler.bind(this),
                icon: InfoOutlinedIcon,
                to: "/overview",
            },
            {
                text: "Network",
                onClick: this.networkHandler.bind(this),
                icon: SwapVertOutlinedIcon,
                to: "/network",
            },
            {
                text: "Process",
                onClick: this.processHandler.bind(this),
                icon: DirectionsRunOutlinedIcon,
                to: "/processes",
            },
            {
                text: "Remote Access",
                onClick: this.remoteAccessHandler.bind(this),
                icon: SettingsRemoteSharpIcon,
                to: "/remote-access",
            },
            {
                text: "Editor",
                onClick: this.editorHandler.bind(this),
                icon: InsertDriveFileOutlinedIcon,
                to: "/editor",
            },
        ];
    }

    overviewHandler() {
        console.log("yolo");
    }

    networkHandler() {
        console.log("yolo");
    }

    processHandler() {
        console.log("yolo");
    }

    remoteAccessHandler() {
        console.log("yolo");
    }

    editorHandler() {
        console.log("yolo");
    }

    render() {
        return(
            <Drawer
                    color="default" 
                    open={this.props.isOpen} 
                    onClose={this.props.toggleDrawer.bind(this, false)}
                >
                <div
                tabIndex={0}
                role="button"
                >
                    <div style={styles.list}>
                        <List>
                            {this.items.map((item, index) => (
                                <Link to={item.to}>
                                    <ListItem button key={item.text} onClick={item.onClick}>
                                        <ListItemIcon>{<item.icon/>}</ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItem>
                                </Link>
                            ))}
                        </List>
                    </div>
                </div>
            </Drawer>
        );
    }
}