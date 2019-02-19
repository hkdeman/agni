import React, { Component } from 'react';
import { Card, Grid, Typography } from '@material-ui/core';
import { PALETTE } from '../styles/ColorPalette';

const styles = {
    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    grid: {
        height: "300px",
        backgroundColor: PALETTE.gray001,
        textAlign: "center",
    },
    title: {
        color: "#494949 !important",
    },
    subTitle: {
        color: "#494949 !important",
        marginTop: "20px",
        fontSize: "1.2em",
    }
};

export default class DashboardCards extends Component {
    render() {
        return(
            <Card style={styles.card}>
                <Grid container direction="row" justify="center" alignItems="center" style={styles.grid}>
                    <Grid item>
                        <Typography color="inherit" variant="h4" style={styles.title}>
                            {this.props.title}
                        </Typography>
                        <Typography color="inherit" variant="body1" style={styles.subTitle}>
                            {this.props.children}
                        </Typography>
                    </Grid>
                </Grid>
            </Card>
        );
    }
}
