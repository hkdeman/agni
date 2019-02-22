import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FixedAppBar from '../../components/ui/FixedAppBar';


const mapStateToProps = (state) => {
    return state;
}

const XFixedAppBar = connect(
    mapStateToProps,
    null,
)(FixedAppBar);

export default withRouter(XFixedAppBar);