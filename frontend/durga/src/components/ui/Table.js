import ReactTable from 'react-table';
import 'react-table/react-table.css';
import React, { Component } from 'react';
import 'react-table/react-table.css';

export default class Table extends Component {


    render() {
        return(
            <ReactTable
                data={this.props.data}
                columns={this.props.columns} 
                {...this.props}
            />
        );
    }
}