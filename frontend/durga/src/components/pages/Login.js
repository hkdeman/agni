import React, { Component } from 'react';
import { Grid, TextField, Button, Typography } from '@material-ui/core';


export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
        }
    }

    _handleChange(e) {
        this.setState({
            password: e.target.value,
        });
    }

    _handleKeyPress(e) {
        if (e.keyCode == 13){
            this.onSubmit();
        }
    }

    onSubmit() {
        console.log(this.state.password);
    }

    render() {
        return(
            <Grid container direction="row" justify="center" alignItems="center">
                <Grid item lg={10} md={10} sm={10} xs={10}>
                    <Grid item lg={12} md={12} sm={12} xs={12} style={{marginTop: "30vh", marginBottom: "10%"}}>
                        <Typography color="inherit" variant="h2" align="center">
                            Agni
                        </Typography>
                    </Grid> 
                    <Grid container direction="column" justify="center" alignItems="center">
                        <TextField
                                margin="dense"
                                id="password"
                                label="Password"
                                type="password"
                                fullWidth
                                onKeyDown={this._handleKeyPress.bind(this)}
                                value={this.state.password} 
                                onChange={this._handleChange.bind(this)}
                            />
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Button onClick={this.onSubmit.bind(this)} color="default">
                                Enter Into The World Peace
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}