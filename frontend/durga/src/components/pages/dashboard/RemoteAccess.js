import React, { Component } from 'react';
import { Grid, Input, Typography } from '@material-ui/core';
import KeyboardArrowRightOutlinedIcon from '@material-ui/icons/KeyboardArrowRightOutlined';

import { PALETTE } from '../../styles/ColorPalette';
import WebSocketHandler from '../../handlers/WebSocketHandler';
import { WEB_SOCKET } from '../../settings/Config';

const OUTPUT_LIMIT = 10000;

const styles = {
    container: {
        flex: 1,
        height: "94.5vh",
        overflow: "hidden",
    },
}

export default class RemoteAccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            output: [],
            lastCommand: "",
        };
        this.from = "";
        this.setupSockets();
    }

    setupSockets() {
      this.socket = new WebSocketHandler(WEB_SOCKET+"/api/host/remote-access", this.outputHandler.bind(this));
    }

    addLineOnTheOutput(line, type) {
      let newOutput = Object.assign([], this.state.output);
      if (newOutput > OUTPUT_LIMIT) {
        newOutput = newOutput.slice(1, OUTPUT_LIMIT);
      }
      newOutput.push({
        data: line,
        type: type,
      });
      this.setState({
        output: newOutput,
      });
    }

    addCommandToOutput() {
      this.addLineOnTheOutput("> "+this.state.lastCommand, "command");
    }

    outputHandler(result) {
      let resultJSON = JSON.parse(result);
      if (resultJSON.status === 200) {
        this.addLineOnTheOutput(resultJSON.output, "success");
      } else if (resultJSON.status === 403) {
        this.addLineOnTheOutput(resultJSON.error, "error");
      }
    }

    enterPressHandler(e) {
      if (e.keyCode === 13) {
        this.addCommandToOutput();
        this.socket.send({'command': 'run-cmd', 'cmd': this.state.lastCommand});
        this.setState({
          lastCommand: "",
        });
      }
    }

    inputHandler(e) {
      this.setState({
        lastCommand: e.target.value,
      });
    }



    render() {
        return(
            <Grid container direction="row" justify="center" alignItems="flex-start" style={styles.container}>
                <Grid item lg={12} md={12} xs={12} sm={12} style={{background: PALETTE.gray002, height: "90%", padding: "20px", overflowY: 'scroll'}}>
                    {this.state.output.map((line, index) => {
                        return <Grid key={index} item lg={12} md={12} sm={12} xs={12} style={{paddingLeft: line.type !== "command" ? "20px" : 0}}>
                                  <Typography variant="h5" color={line.type === "error" ? 'secondary' : line.type === "command" ? 'primary' : 'inherit'}
                                      style={styles.title}>
                                      {line.data}
                                  </Typography>
                                </Grid>
                    })}
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12} style={{ background: PALETTE.gray004, height: "10%", padding: "10px"}}>
                    <Grid item lg={12} md={12} sm={12} xs={12} style={{backgroundColor: PALETTE.gray007, height: "100%", borderRadius: "12px"}}>
                        <Grid container direction="row">
                            <Grid item>
                                <KeyboardArrowRightOutlinedIcon style={{color: "white", fontSize: "3em", marginTop: "1.5vh", paddingLeft:"10px"}}/>
                            </Grid>
                            <Grid item lg={11} md={11} sm={11} xs={11} style={{paddingLeft: "10px", paddingRight: "10px"}}>
                                <Input  onKeyUp={this.enterPressHandler.bind(this)}
                                        onChange={this.inputHandler.bind(this)}
                                        value={this.state.lastCommand}
                                        autoFocus
                                        disableUnderline
                                        style={{width: "105%", marginTop: "2vh", fontSize: "2em"}}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}
