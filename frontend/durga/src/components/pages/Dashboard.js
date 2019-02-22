import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import DashboardCards from '../ui/DashboardCards';

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
    root: {
        marginTop: "5%",
    },
    padding: {
        padding: "2% 4% 2% 4%",
    }
};
  
export default class Dashboard extends Component {
    render() {
        return (
            <Grid container direction="row" justify="center" alignItems="center">
                <Grid item style={styles.root}
                        lg={10} md={10} sm={10} xs={10}>
                    <Grid container spacing={24} direction="row" justify="space-around" alignItems="center">
                        <Grid item lg={6} md={6} sm={6} xs={6} style={styles.padding}>
                            <DashboardCards
                                to="/overview"
                                title="Overview">
                                Peek through the overall performance measure of your host.
                            </DashboardCards>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={styles.padding}>
                            <DashboardCards
                                to="/network"
                                title="Network">
                                Check out the interactions of your host with the rest of the world wide web.
                            </DashboardCards>
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} direction="row" justify="space-around" alignItems="center">
                        <Grid item lg={6} md={6} sm={6} xs={6} style={styles.padding}>
                            <DashboardCards
                                to="/search"
                                title="Search">
                                Search through the files with regex, specific type, and much more.
                            </DashboardCards>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={styles.padding}>
                            <DashboardCards
                                to="/processes"
                                title="Processes">
                                Go through all the processes with ease and kill dodgy ones with no hassle.
                            </DashboardCards>
                        </Grid>
                    <Grid container spacing={24} direction="row" justify="space-around" alignItems="center">
                        <Grid item lg={6} md={6} sm={6} xs={6} style={styles.padding}>
                            <DashboardCards
                                to="/remote-access"
                                title="Remote Access">
                                Access the terminal of the host just like old days.
                            </DashboardCards>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={styles.padding}>
                            <DashboardCards
                                to="/editor"
                                title="Editor">
                                Access all the files of the host and edit them with the in-built editor.
                            </DashboardCards>
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} direction="row" justify="space-around" alignItems="center">
                        <Grid item lg={12} md={12} sm={12} xs={12} style={styles.padding}>
                            <DashboardCards
                                to="/settings"
                                title="Settings">
                                Move to dark mode, explore saving SSH credentials in cookies and lot more.
                            </DashboardCards>
                        </Grid>
                    </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}
