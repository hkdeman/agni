import { connect } from 'react-redux';
import { setToken } from '../../actions';
import Login from '../../components/pages/Login';


const mapDispatchToProps = dispatch => ({
    setToken: (token) => dispatch(setToken(token))
});

const XLogin = connect(
    null,
    mapDispatchToProps
  )(Login);

export default XLogin;