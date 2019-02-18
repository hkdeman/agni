import React, { Component } from 'react';

const styles = {
    led : {
        margin: "20px auto",
        marginRight: "15px",
        width: "12px",
        height: "12px",
        backgroundColor: "#690",
        borderRadius: "50%",
        boxShadow: "#000 0 -1px 7px 1px, inset #460 0 -1px 9px, #7D0 0 2px 12px"
    }
}

export default class GreenLEDLight extends Component {
    render() {
        return(
            <div style={styles.led}></div>
        );
    }
}