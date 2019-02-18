import React, { Component } from 'react';
import { XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, LineSeries } from 'react-vis';
import '../../../node_modules/react-vis/dist/style.css';
import PropTypes from 'prop-types';

export default class Graph extends Component {
    static propTypes = {
        showYAxis: PropTypes.bool,
        showXAxis: PropTypes.bool,
        showHorizontalGridLines: PropTypes.bool,
        showVerticalGridLines: PropTypes.bool,
        data: PropTypes.any.isRequired,
      };
    render() {
        return(
            <React.Fragment>
                <XYPlot height={300} width= {500} style={{margin: "30px 0 30px 0"}}>
                    {this.props.showVerticalGridLines ? <VerticalGridLines /> : <span></span>  }                    
                    {this.props.showHorizontalGridLines ? <HorizontalGridLines /> : <span></span> }
                    {this.props.showXAxis ? <XAxis /> : <span></span>  }
                    {this.props.showYAxis ? <YAxis /> : <span></span>  }
                    <LineSeries data={this.props.data}/>
                </XYPlot>
            </React.Fragment>
        );
    }
}