import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import XLogin from '../../containers/pages/XLogin';
import SideDrawer from '../ui/SideDrawer';
import XNetwork from '../../containers/pages/dashboard/XNetwork';
import XEditor from '../../containers/pages/dashboard/XEditor';
import XOverview from '../../containers/pages/dashboard/XOverview';
import XProcess from '../../containers/pages/dashboard/XProcess';
import XRemoteAccess from '../../containers/pages/dashboard/XRemoteAccess';
import XPrivateRoute from '../../containers/routes/XPrivateRoute';
import FourOFour from './error/FourOFour';
import XFixedAppBar from '../../containers/ui/XFixedAppBar';


export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerStatus: false,
            isAuthenticated: this.checkToken(props),
        };
    }

    componentWillReceiveProps(props) {
        if(this.checkToken(props)) {
            this.setState({
                isAuthenticated: true,
            });
        }
    }
    
    checkToken(props) {
        if(props.auth !== void 0) {
            if(props.auth.token !== void 0) {
                return true;
            }
        }
        return false;
    }

    toggleDrawer(status) {
        this.setState({
            drawerStatus: status,
        });
    }

    render() {
        return(
            <React.Fragment>
                {
                    this.state.isAuthenticated 
                    ? 
                        <React.Fragment>
                            <XFixedAppBar toggleDrawer={this.toggleDrawer.bind(this)}/>
                            <SideDrawer
                                isOpen={this.state.drawerStatus}
                                toggleDrawer={this.toggleDrawer.bind(this)} />
                        </React.Fragment>
                    :
                        <span></span>
                }
                <Switch>
                    <Route path="/login" component={XLogin} />
                    <XPrivateRoute exact path="/" component={Dashboard} />
                    <XPrivateRoute path="/editor" component={XEditor} />
                    <XPrivateRoute path="/network" component={XNetwork} />
                    <XPrivateRoute path="/overview" component={XOverview} />
                    <XPrivateRoute path="/processes" component={XProcess} />
                    <XPrivateRoute path="/remote-access" component={XRemoteAccess} />
                    <Route component={FourOFour} />
                </Switch>
            </React.Fragment>
        );
    }
}