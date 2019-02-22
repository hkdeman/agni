import { connect } from 'react-redux';
import PrivateRoute from '../../components/routes/PrivateRoute';
import { withRouter } from 'react-router-dom';


const mapStateToProps = (state) => {
    return state;
}

const XPrivateRoute = connect(
    mapStateToProps,
    null,
)(PrivateRoute);

export default withRouter(XPrivateRoute);