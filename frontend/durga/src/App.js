import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import FixedAppBar from './components/ui/FixedAppBar';
import SideDrawer from './components/ui/SideDrawer';
import Overview from './components/pages/dashboard/Overview';

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
        drawerStatus: false,
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

  toggleDrawer(status) {
    this.setState({
        drawerStatus: status,
    });
  }

  render() {
    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        style={{marginTop:"65px"}}
      >
        <FixedAppBar toggleDrawer={this.toggleDrawer.bind(this)}/>
        <SideDrawer
            isOpen={this.state.drawerStatus} 
            toggleDrawer={this.toggleDrawer.bind(this)} />
        <Overview />
      </Grid>
    );
  }
}

export default App;
