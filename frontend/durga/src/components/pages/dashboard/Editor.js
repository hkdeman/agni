import React, { Component } from 'react';
import { Grid, Typography, createMuiTheme, MuiThemeProvider, Button } from '@material-ui/core';
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';

import { PALETTE } from '../../styles/ColorPalette';
import FileExplorerList from '../../ui/FileExplorerList';
import WebSocketHandler from '../../handlers/WebSocketHandler';
import { WEB_SOCKET } from '../../settings/Config';
import CustomSnackbar from '../../ui/CustomSnackbar';
import CodeEditor from '../../ui/CodeEditor';


const theme = createMuiTheme({
    palette: {
      type: 'dark', // Switching the dark mode on is a single property value change.
    },
    typography: { useNextVariants: true },
});

const styles = {
    container: {
        flex: 1,
        height: "94.5vh",
        overflow: "hidden",
    },
    toolbar: {
        flexFlow: "column",
        height: "100%",
    },
    title: {
        backgroundColor: PALETTE.gray008,
        padding: "10px 0 10px 30px",
    },
    backButton: {
        backgroundColor: PALETTE.gray008,
        padding: "10px 0 10px 10px",
    },
    fileExplorer: {
        backgroundColor: PALETTE.gray008,
        border: "1px solid "+PALETTE.gray007,
        flexGrow: 1,
    }
};

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftPanelFiles: [],
            leftPwd: "",
            rightPwd: "",
            rightPanelFiles: [],
            leftPanelFilesActive: -1,
            rightPanelFilesActive: -1,
            reachedRoot: false,
            showSnackbar: false,
            errorMessage: "",
            editorValue: "",
            editorMode: "plain_text",
        };
        this.setupSockets();
        this.initialPopulationCompleted = false;
        this.lastClickFrom = "";
    }

    setupSockets() {
        this.socket = new WebSocketHandler(WEB_SOCKET+"/api/host/file-editor", this.populateFiles.bind(this));
    }

    manageDirectory(resultJSON) {
        if(!this.initialPopulationCompleted) {
            this.setState({
                leftPanelFiles: resultJSON.files,
                leftPwd: resultJSON.pwd,
            });
            this.initialPopulationCompleted=true;
        } else {
            if(this.lastClickFrom === "back") {
                let reachedRoot = false;
                if(resultJSON.pwd === "/") {
                    reachedRoot = true;
                }
                this.setState({
                    leftPanelFiles: resultJSON.files,
                    leftPwd: resultJSON.pwd,
                    rightPanelFiles: this.state.leftPanelFiles,
                    rightPanelFilesActive: this.state.leftPanelFilesActive,
                    rightPwd: this.state.leftPwd,
                    reachedRoot: reachedRoot,
                });
            }
            else if(this.lastClickFrom === "right") {
                this.setState({
                    leftPanelFiles: this.state.rightPanelFiles,
                    leftPanelFilesActive: this.state.rightPanelFilesActive,
                    leftPwd: this.state.rightPwd,
                    rightPanelFiles: resultJSON.files,
                    rightPwd: resultJSON.pwd,
                    reachedRoot: false,
                });
            } else {
                this.setState({
                    rightPanelFiles: resultJSON.files,
                    rightPwd: resultJSON.pwd,
                });
            }
        }
    }
    setMode(ext) {
        let mode = "";
        switch (ext) {
            case "py":
                mode = "python";
                break;
            case "java":
                mode = "java";
                break;
            case "js":
                mode = "javascript";
                break;
            case "html":
                mode = "html";
                break;
            case "css":
                mode = "css";
                break;
            case "json":
                mode = "json";
                break;
            default:
                mode = "plain_text";
                break;
        }
        this.setState({
            editorMode: mode,
        });
    }

    manageFile(resultJSON) {
        let ext = resultJSON.name.split('.').pop();
        this.setMode(ext);
        this.setState({
            editorValue: resultJSON.data,
        });
    }

    populateFiles(result) {
        let resultJSON = JSON.parse(result);
        if (resultJSON.status === 200) {
            if (resultJSON.type === "open-directory") {
                this.manageDirectory(resultJSON);
            } else {
                this.manageFile(resultJSON);
            }
        } else {
            this.setState({
                errorMessage: "Error processing the request",
                showSnackbar: true,
            });
            this.lastClickFrom = "error";
        }
    }

    leftPanelFilesClickHandler(index) {
        if (this.lastClickFrom === "left" || this.lastClickFrom === "error" || this.lastClickFrom === "right") {
            // on double
            this.socket.send({
                command: "back",
            });
        }
        this.setState({
            leftPanelFilesActive: index,
        });
        let f = this.state.leftPanelFiles[index];
        if (f.type === "f") {
            this.socket.send({
                command: "open-file",
                file: f.name,
            });
        } else if (f.type === "d") {
            this.socket.send({
                command: "open-directory",
                directory: f.name,
            });
            this.lastClickFrom = "left";
        }
    }
    
    rightPanelFilesClickHandler(index) {
        if (this.lastClickFrom === "back") {
            const lastDirectorySplit = this.state.rightPwd.split("/");
            const lastDirectory = lastDirectorySplit[lastDirectorySplit.length-1];
            this.socket.send({
                command: "open-directory",
                directory: lastDirectory,
            });
        }
        this.setState({
            rightPanelFilesActive: index,
        });
        let f = this.state.rightPanelFiles[index];
        if (f.type === "f") {
            this.socket.send({
                command: "open-file",
                file: f.name,
            });
        } else if (f.type === "d") {
            this.socket.send({
                command: "open-directory",
                directory: f.name,
            });
            this.lastClickFrom = "right";
        }
    }

    backButtonHandler() {
        if (this.lastClickFrom === "left" || this.lastClickFrom === "error" || this.lastClickFrom === "right") {
            this.socket.send({
                command: "back",
            });
        }
        this.lastClickFrom = "back";
        this.socket.send({
            command: "back",
        });
    }

    render() {
        return(
            <MuiThemeProvider theme={theme}>
                <Grid item lg={4} md={4} sm={4} xs={4} style={styles.container}> 
                    <Grid container direction="column" justify="center" alignContent="center" style={styles.toolbar}>
                        <Grid item style={styles.title}>
                            <Typography variant="h5" color="default" align="center">
                                File Explorer
                            </Typography>
                        </Grid>
                        { !this.state.reachedRoot ?
                        <Grid item style={styles.backButton}>
                            <Button variant="outlined" color="default" onClick={this.backButtonHandler.bind(this)}>
                                <KeyboardArrowLeftOutlinedIcon style={{fontSize: "1.2em", marginLeft: "-10px"}} />
                                <Typography variant="body1" color="default">
                                    Back
                                </Typography>
                            </Button>
                        </Grid> : "" }
                        <Grid container direction="row" style={{flexGrow: 1}}>
                            <Grid item lg={6} md={6} sm={6} xs={6} style={styles.fileExplorer}>
                                <FileExplorerList 
                                    files={this.state.leftPanelFiles}
                                    active={this.state.leftPanelFilesActive}
                                    clickHandler={this.leftPanelFilesClickHandler.bind(this)}/>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} style={styles.fileExplorer}>
                                <FileExplorerList
                                    files={this.state.rightPanelFiles}
                                    active={this.state.rightPanelFilesActive}
                                    clickHandler={this.rightPanelFilesClickHandler.bind(this)}/>
                            </Grid>
                        </Grid>
                    </Grid>                    
                </Grid>
                <Grid item lg={8} md={8} sm={8} xs={8}>
                    <CodeEditor value={this.state.editorValue} mode={this.state.editorMode}/>
                </Grid>
                <CustomSnackbar
                    open={this.state.showSnackbar} 
                    onClose={
                                () => {
                                    this.setState({
                                        showSnackbar: false
                                    });
                                }
                            }
                    warning={true}
                    message={this.state.errorMessage}/>
            </MuiThemeProvider>
        );
    }
}
