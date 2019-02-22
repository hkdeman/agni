import React, { Component } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { PALETTE } from '../../styles/ColorPalette';

export default class FourOFour extends Component {
    render() {
        return(
            <Grid container direction="row" justify="center" alignItems="center" style={{height: "94.5vh", backgroundColor: PALETTE.gray007}}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography variant="h4" color="default" style={{textAlign: "center"}}>
                        Page not found, please go back to the <Link to="/" style={{textDecoration: "underline", color: "white"}}>Dashboard</Link>
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}