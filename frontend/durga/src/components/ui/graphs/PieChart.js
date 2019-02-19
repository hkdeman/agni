import React, { Component } from 'react';
import { Pie, Line } from 'react-chartjs-2';

export default class PieChart extends Component {
    render() {
        const data = {
            labels: this.props.X,
            datasets: [{
                data: this.props.y,
                backgroundColor: [
                '#003f5c',
                '#58508d',
                ],
                hoverBackgroundColor: [
                '#003f5c',
                '#58508d',
                ]
            }]
        };
        return(
            <React.Fragment>
                <Pie key={this.props.id} data={data} width={100} height={400} options={{ maintainAspectRatio: false}}/>
            </React.Fragment>
        );
    }
}