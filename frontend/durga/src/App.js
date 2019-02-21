import React, { Component } from 'react';
import { Grid, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';
import XHome from './containers/pages/XHome';


export const InformationContext = React.createContext("No Context");


const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
  typography: { useNextVariants: true },
});


class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            style={{marginTop:"64px"}}
          >
            <XHome />
          </Grid>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
