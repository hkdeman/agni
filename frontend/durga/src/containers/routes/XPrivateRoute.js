import { connect } from 'react-redux';
import PrivateRoute from '../../components/routes/PrivateRoute';

const mapStateToProps = (state) => {
    return state;
}

const XPrivateRoute = connect(
    mapStateToProps,
    null,
)(PrivateRoute);

export default XPrivateRoute;