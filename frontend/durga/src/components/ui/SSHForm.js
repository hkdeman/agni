import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { HOST } from '../settings/Config';
import { animateCss } from '../handlers/AnimateHandler';
import CustomSnackbar from './CustomSnackbar';

export default class SSHForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            host: "",
            username: "",
            password: "",
            error: "",
            showSnackbar: false,
        };
    }

    saveSSHCredentials() {
        this.props.setSSHDetails(this.state.host, this.state.username, this.state.password);
        this.setState({
            host: "",
            username: "",
            password: ""
        });
        this.setState({
            showSnackbar: true,
        });
        this.props.toggleDialog(false);
    }

    checkSSHConnection() {
        this.saveSSHCredentials();
        // fetch(HOST+"/api/terminal/check-ssh-connection",{
        //     method: 'POST',
        //     headers: {
        //       Accept: 'application/json',
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       host: this.state.host,
        //       username: this.state.username,
        //       password: this.state.password,
        //     }),
        //   }).then((results)=> {
        //     if(results.status===200) {
        //         this.saveSSHCredentials();
        //     } else if (results.status === 401) {
        //         animateCss(".new-ssh-connection-form", "shake", () => {
        //             this.setState({
        //                 error: "Invalid Credentials.",
        //             });
        //         });
        //     } else {
        //         animateCss(".new-ssh-connection-form", "shake", () => {
        //             this.setState({
        //                 error: "Something went wrong, try again later...",
        //             });
        //         });
        //     }
        // });
    }

    _handleChange(type, e) {
        this.setState({
            [type]: e.target.value,
        });
    }

    render() {
        return (
            <React.Fragment>
                <Dialog 
                    open={this.props.open} 
                    onClose={this.props.toggleDialog.bind(this, false)} 
                    aria-labelledby="form-dialog-title"
                    TransitionComponent={Slide}
                    className="new-ssh-connection-form">
                    <DialogTitle id="form-dialog-title">
                        Establish an SSH Connection
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        In order to establish a connection, please provide the credentials below:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="host"
                        label="host"
                        type="text"
                        fullWidth
                        value={this.state.host} 
                        onChange={this._handleChange.bind(this, "host")}
                    />
                    <TextField
                        margin="dense"
                        id="username"
                        label="username"
                        type="text"
                        fullWidth
                        value={this.state.username} 
                        onChange={this._handleChange.bind(this, "username")}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="password"
                        type="password"
                        fullWidth
                        value={this.state.password} 
                        onChange={this._handleChange.bind(this, "password")}
                    />
                    <p style={{textAlign: "center", color: "red"}}>{this.state.error}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.toggleDialog.bind(this, false)} color="default">
                            Cancel
                        </Button>
                        <Button onClick={this.checkSSHConnection.bind(this)} color="secondary">
                            Connect
                        </Button>
                    </DialogActions>
                </Dialog>
                <CustomSnackbar
                    open={this.state.showSnackbar} 
                    onClose={
                                () => {
                                    this.setState({
                                        showSnackbar: false
                                    });
                                }
                            }
                    message="SSH connection successfully established!"/>
            </React.Fragment>
        );
    }
}