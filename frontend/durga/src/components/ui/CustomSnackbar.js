import React, { Component } from 'react';
import { SnackbarContent, Icon, IconButton, Snackbar, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { green, red } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined';

export default class CustomSnackbar extends Component {
    onClose() {
        this.props.onClose(false);
    }
    
    render() {
        return(
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={this.props.open}
                autoHideDuration={6000}
                onClose={this.onClose.bind(this)}
            >
                <SnackbarContent
                    aria-describedby="client-snackbar"
                    message={
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Grid item style={{marginRight: "10px"}}>
                                {this.props.warning ? <WarningOutlinedIcon /> : <CheckCircleIcon  /> }
                            </Grid>
                            <Grid item>
                                {this.props.message}
                            </Grid>
                        </Grid>
                    }
                    style = {{
                        backgroundColor: this.props.warning ? red[600] : green[600],
                    }}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.onClose.bind(this)}
                            >
                            <CloseIcon style={{fontSize: 20}} />
                        </IconButton>,
                    ]}
                    />
            </Snackbar>
        );
    }
}