import React, { Component } from 'react';
import { Grid, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import FixedAppBar from './components/ui/FixedAppBar';
import SideDrawer from './components/ui/SideDrawer';
import Overview from './components/pages/dashboard/Overview';
import RemoteAccess from './components/pages/dashboard/RemoteAccess';
import Editor from './components/pages/dashboard/Editor';
import Dashboard from './components/pages/Dashboard';
import Network from './components/pages/dashboard/Network';
import Process from './components/pages/dashboard/Process';
import Login from './components/pages/Login';

export const InformationContext = React.createContext("No Context");


const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
  typography: { useNextVariants: true },
});


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
      <MuiThemeProvider theme={theme}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          style={{marginTop:"64px"}}
        >
          
            <Login />
        </Grid>
      </MuiThemeProvider>
    );
  }
}

export default App;
