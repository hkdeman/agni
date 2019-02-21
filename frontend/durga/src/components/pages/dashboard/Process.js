import React, { Component } from 'react';
import { Grid, Input } from '@material-ui/core';
import WebSocketHandler from '../../handlers/WebSocketHandler';
import { WEB_SOCKET } from '../../settings/Config';
import Table from '../../ui/Table';

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
    { header: 'Status', accessor: 'status',},
];

export default class Process extends Component {
    constructor(props) {
        super(props);
        
        const columns = columnsInfo.map((columnInfo, index) => {
            return getColumn(columnInfo);
        });
        this.state = {
            originalData: [],
            data: [],
            columns: columns,
        };

        this.setupSockets();
    }

    setupSockets() {
        this.socket = new WebSocketHandler(WEB_SOCKET+"/api/host/process", this.populate.bind(this));
    }

    setupProcessesTable(data) {
        this.setState({
            data: data,
            originalData: data,
        });
    }

    populate(result) {
        const resultJSON = JSON.parse(result);
        switch(resultJSON.type) {
            case "processes":
                this.setupProcessesTable(resultJSON.data);
                break;
            default:
                break;
        }    
    }

    search(e) {
        let searchText = e.target.value.toLowerCase();
        let showDataset = [];
        for(let obj of this.state.originalData) {
            let found = obj.pid.toString().indexOf(searchText)!== -1 
                            || obj.name.toLowerCase().indexOf(searchText) !== -1 
                                || obj.status.toLowerCase().indexOf(searchText) !== -1
            if(found) {
                showDataset.push(obj);
            }
        }

        this.setState({
            data: showDataset,
        });
    }

    render() {
        return(
            <Grid container direction="row" justify="center" alignItems="center">
                <Grid item lg={10} md={10} sm={10} xs={10} style={{paddingTop: "2%"}}>
                    {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Input onChange={this.search.bind(this)} type="text" placeholder="Search" style={{marginTop:'2%'}}/>
                    </Grid> */}
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Table data={this.state.data} columns={this.state.columns} />                        
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}