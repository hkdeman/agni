import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';


const options = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true,
                min: 0,
                max: 100    
            }
          }]
    },
    maintainAspectRatio: false,
};

export default class LineChart extends Component {
    render() {
        const data = {
            labels: this.props.X,
            datasets: [
              {
                label: this.props.title,
                fill: false,
                lineTension: 0.1,
                backgroundColor: '#003f5c',
                borderColor: '#003f5c',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#003f5c',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#003f5c',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.props.y,
              },
            ],
          };
        return (
            <React.Fragment>
                <Line data={data} width={20} height={300} options={options}/>
            </React.Fragment>
        );
    }
}
