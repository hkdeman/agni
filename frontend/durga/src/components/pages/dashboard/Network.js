import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';
import WebSocketHandler from '../../handlers/WebSocketHandler';
import { WEB_SOCKET } from '../../settings/Config';
import Table from '../../ui/Table';
import PieChart from '../../ui/graphs/PieChart';
import { PALETTE } from '../../styles/ColorPalette';


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

const getColumn = (columnInfo) => {
    return {
        Header: columnInfo.header,
        accessor: columnInfo.accessor,
        headerStyle: {
            'fontSize': '1.2em',
        }
    };
};

const columnsInfo = [
    { header: 'PID', accessor: 'pid',},
    { header: 'Name', accessor: 'name',},
    { header: 'Local IP', accessor: 'l_ip',},
    { header: 'Local Port', accessor: 'l_port',},
    { header: 'Remote IP', accessor: 'r_ip',},
    { header: 'Remote Port', accessor: 'r_port',},
    { header: 'Status', accessor: 'status',},
];

export default class Network extends Component {
    constructor(props) {
        super(props);
        const columns = columnsInfo.map((columnInfo, index) => {
            return getColumn(columnInfo);
        });
        this.state = {
            data: [],
            columns: columns,
            netIOCounters: [],
        };
        this.setupSockets();
    }

    
    setupSockets() {
        this.socket = new WebSocketHandler(WEB_SOCKET+"/api/host/network", this.populate.bind(this));
    }

    setupPortsTable(data) {
        this.setState({
            data: data,
        });
    }

    setupNetIOCounters(data) {
        let netIOCounters = [];
        data.forEach(netIOCounter => {
            netIOCounters.push({
                name: netIOCounter.adapter,
                packets: {
                    X: ["Packets sent", "Packets Recv"],
                    y: [netIOCounter.packets_sent, netIOCounter.packets_recv],
                },
                bytes: {
                    X: ["Bytes sent", "Bytes Recv"],
                    y: [netIOCounter.bytes_sent, netIOCounter.bytes_recv]
                },
            });
        });

        this.setState({
            netIOCounters: netIOCounters,
        });
    }

    populate(result) {
        const resultJSON = JSON.parse(result);
        switch(resultJSON.type) {
            case "ports":
                this.setupPortsTable(resultJSON.data);
                break;
            case "netIOCounters":
                this.setupNetIOCounters(resultJSON.data);
                break;
            default:
                break;
        }
    }

    render() {
        return(
            <Grid className="container" container direction="row" justify="center" alignItems="center">
                <Grid item lg={10} md={10} sm={10} xs={10} style={{paddingTop: "2%"}}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Table data={this.state.data} columns={this.state.columns} />                        
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        {this.state.netIOCounters.map((netIOCounter, index) => {
                            return <Grid container direction="row" justify="center" alignItems="center">
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <Typography variant="h5" color="inherit" align="center" style={styles.title}>
                                                Net IO Counters (Bytes)
                                            </Typography>
                                            <Typography variant="body2" color="inherit" align="center" style={styles.subTitle}>
                                                {netIOCounter.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <PieChart
                                                key={index}
                                                id={"net-io-counters-"+index}
                                                X={netIOCounter.bytes.X}
                                                y={netIOCounter.bytes.y}
                                                />
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <Typography variant="h5" color="inherit" align="center" style={styles.title}>
                                                Net IO Counters (Packets)
                                            </Typography>
                                            <Typography variant="body2" color="inherit" align="center" style={styles.subTitle}>
                                                {netIOCounter.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <PieChart
                                                key={index}
                                                id={"net-io-counters-"+index}
                                                X={netIOCounter.packets.X}
                                                y={netIOCounter.packets.y}
                                                />
                                        </Grid>
                                    </Grid>
                                </Grid>;
                            })}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}