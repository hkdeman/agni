import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import Graph from '../../ui/Graph';

export default class Overview extends Component {
    render() {
        const data = [
            {x: 0, y: 8},
            {x: 1, y: 5},
            {x: 2, y: 4},
            {x: 3, y: 9},
            {x: 4, y: 1},
            {x: 5, y: 7},
            {x: 6, y: 6},
            {x: 7, y: 3},
            {x: 8, y: 2},
            {x: 9, y: 0}
          ];
        return(
            <Grid container direction="row" justify="center" alignItems="center">            
                <Grid item lg={10} md={10} sm={10} xs={10}>
                    <Grid container direction="row" justify="space-around" alignItems="center">
                        <Grid item>
                            <Graph 
                                showYAxis={true}
                                showHorizontalGridLines={true}
                                showVerticalGridLines={true}
                                data={data}/>
                        </Grid>
                        <Grid item>
                            <Graph
                                showYAxis={true}
                                showHorizontalGridLines={true}
                                showVerticalGridLines={true}
                                data={data}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}