import { connect } from 'react-redux';
import { setToken } from '../../actions';
import Login from '../../components/pages/Login';
import { withRouter } from 'react-router-dom';


const mapDispatchToProps = dispatch => ({
    setToken: (token) => dispatch(setToken(token))
});

const XLogin = connect(
    null,
    mapDispatchToProps
  )(Login);

export default withRouter(XLogin);