import React, { Component } from 'react';
import { Grid, Typography, GridList, GridListTile, ListItem, List } from '@material-ui/core';
import { PALETTE } from '../styles/ColorPalette';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';

export default class FileExplorerList extends Component {
    onFileClickHandler(index) {
        this.props.clickHandler(index);
    }

    render() {
        return(
            <List style={{height: "100%", overflowY: "scroll"}}>
                { this.props.files.map((file, index) => {
                    return <ListItem
                                key={index}
                                style={
                                    {
                                        padding: "20px 0 20px 30px", 
                                        backgroundColor: this.props.active !== index ? "inherit" : PALETTE.gray006,
                                    }
                                }
                                onClick={this.onFileClickHandler.bind(this, index)}>
                                <Grid item lg={10} md={10} sm={10} xs={10}>
                                    <Typography variant="body1" color="default">
                                        { file.name }
                                    </Typography>
                                </Grid>
                                {
                                    file.type === "d" ? 
                                    <Grid container justify="flex-end">
                                        <Grid item lg={2} md={2} sm={2} xs={2} style={{padding: "0 30px 0 0"}}>
                                            <PlayArrowOutlinedIcon style={{color: "white", fontSize:"1.2em"}}/>
                                        </Grid>
                                    </Grid>
                                : "" }
                            </ListItem>
                })}
            </List>
        );
    }
}