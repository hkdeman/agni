import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import Editor from './components/pages/dashboard/Editor';

export const InformationContext = React.createContext("No Context");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      SSHInformation: { 
        host: "", 
        username: "",
        password: "",
        isConnected: false,
      },
    };
    
    this.setSSHInformation = (host, username, password, status) => {
      let newSSHInformation = Object.assign({}, this.state.newSSHInformation);
      newSSHInformation.host = host;
      newSSHInformation.username = username;
      newSSHInformation.password = password;
      newSSHInformation.isConnected = status;
      this.setState({newSSHInformation: newSSHInformation});
    };
  }

  render() {
    return (
      <Grid 
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{minHeight: "100vh"}}
      >
        <Editor />
      </Grid>
    );
  }
}

export default App;
