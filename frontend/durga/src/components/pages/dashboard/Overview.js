import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';
import PieChart from '../../ui/graphs/PieChart';
import LineChart from '../../ui/graphs/LineChart';
import { PALETTE } from '../../styles/ColorPalette';
import WebSocketHandler from '../../handlers/WebSocketHandler';
import { WEB_SOCKET } from '../../settings/Config';


const styles = {
    container: {
        height: "100%", 
        backgroundColor: PALETTE.gray001,
        paddingBottom: "5%",
},
    title: {
        marginTop: "40px",
        marginBottom: "10px",
    },
    subTitle: {
        marginTop: "10px",
        marginBottom: "30px",
    },
};

function getFirstHunderNumbers() {
    let oneToHundredArray = [];
    for(var value = 1; value <= 100; value++) {
        oneToHundredArray.push(value);
    }
    return oneToHundredArray;
}

function getHundredZeros() {
    let oneToHundredArray = [];
    for(var value = 1; value <= 100; value++) {
        oneToHundredArray.push(0);
    }
    return oneToHundredArray;
}

export default class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            diskUsage: [],
            RAMUsageData: {},
            activeCPUUsage: {
                X: getFirstHunderNumbers(),
                y: getHundredZeros(),
            },
            activeRAMUsage: {
                X: getFirstHunderNumbers(),
                y: getHundredZeros(),
            },
        };
        this.setupSockets();
    }

    setupSockets() {
        this.socket = new WebSocketHandler(WEB_SOCKET+"/api/host/overview", this.populate.bind(this));
    }

    updateDiskUsageData(data) {
        let diskUsageData = [];
        data.forEach(disk => {
            let diskCopy = Object.assign({}, disk);
            delete diskCopy.partition;
            diskUsageData.push({
                name: disk.partition,
                X: Object.keys(diskCopy),
                y: Object.values(diskCopy),
            });
        });
        this.setState({
            diskUsage: diskUsageData,
        });
    }

    updateRAMUsage(data) {
        this.setState({
            RAMUsageData: {
                X: Object.keys(data),
                y: Object.values(data),
            },
        });
    }

    updateActiveCPUUsage(data) {
        let newData = Object.assign({}, this.state.activeCPUUsage);
        if (newData.y.length>100) {
            newData.y = newData.y.slice(1,100);

        }
        newData.y.push(data);
        this.setState({
            activeCPUUsage: newData,
        });
    }

    updateActiveRAMUsage(data) {
        let newData = Object.assign({}, this.state.activeRAMUsage);
        if (newData.y.length>100) {
            newData.y = newData.y.slice(1,100);

        }
        newData.y.push(data);
        this.setState({
            activeRAMUsage: newData,
        });
    }

    populate(result) {
        const resultJSON = JSON.parse(result);
        if (resultJSON.type === "diskUsage") {
            this.updateDiskUsageData(resultJSON.data);
        } else if (resultJSON.type === "ramUsage") {
            this.updateRAMUsage(resultJSON.data);
        } else if (resultJSON.type === "cpuUsage") {
            this.updateActiveCPUUsage(resultJSON.data);
        } else if (resultJSON.type === "activeRamUsage") {
            this.updateActiveRAMUsage(resultJSON.data);
        }

    }

    render() {
        return(
            <Grid container direction="row" justify="center" alignItems="flex-start" style={styles.container}>            
                <Grid item lg={10} md={10} sm={10} xs={10}>
                    <Grid container direction="row" alignItems="center">
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Typography variant="h5" color="inherit" align="center" style={styles.title}>
                                    Active CPU Usage
                                </Typography>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <LineChart
                                    id="active-cpu-usage"
                                    title="CPU Usage"
                                    X={this.state.activeCPUUsage.X}
                                    y={this.state.activeCPUUsage.y}
                                    />
                            </Grid>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Typography variant="h5" color="inherit" align="center" style={styles.title}>
                                Active RAM Usage
                            </Typography>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <LineChart
                                    id="active-ram-usage"
                                    title="RAM Usage"
                                    X={this.state.activeRAMUsage.X}
                                    y={this.state.activeRAMUsage.y}
                                    />
                        </Grid>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Typography variant="h5" color="inherit" align="center" style={styles.title}>
                                    RAM Usage
                                </Typography>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <PieChart
                                    id="ram-usage"
                                    X={this.state.RAMUsageData.X}
                                    y={this.state.RAMUsageData.y}
                                    />
                            </Grid>
                        </Grid>
                    {this.state.diskUsage.map((disk, index) => {
                        return <Grid item lg={6} md={6} sm={6} xs={6}>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Typography variant="h5" color="inherit" align="center" style={styles.title}>
                                        Disk Usage
                                    </Typography>
                                    <Typography variant="body2" color="inherit" align="center" style={styles.subTitle}>
                                        {disk.name}
                                    </Typography>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <PieChart
                                        key={index}
                                        id={"disk-usage-"+index}
                                        X={disk.X}
                                        y={disk.y}
                                        />
                                </Grid>
                            </Grid>;
                        })}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}