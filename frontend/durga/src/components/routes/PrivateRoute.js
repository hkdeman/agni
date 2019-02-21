import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';

export default class PrivateRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: this.checkToken(props),
    };
  }

  componentWillReceiveProps(props) {
    if(this.checkToken(props)) {
      this.setState({
        isAuthenticated: true,
      })
    }
  }

  checkToken(props) {
    if(props.auth) {
      if(props.auth.token) {
        return true;
      }
    }
    return false;
  }

  render() {
    const PrivateComponent = this.props.component;
    return (
        <React.Fragment>
          <Route
            path={this.props.path}
            render={(props) => (
                this.state.isAuthenticated
              ?
                <PrivateComponent {...props} /> 
              :
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            )}
          />
        </React.Fragment>
    );
  }
}