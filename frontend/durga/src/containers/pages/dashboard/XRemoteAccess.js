import { connect } from 'react-redux';
import RemoteAccess from '../../../components/pages/dashboard/RemoteAccess';

const mapStateToProps = (state) => {
    return state;
}

const XRemoteAccess = connect(
    mapStateToProps,
    null,
)(RemoteAccess);

export default XRemoteAccess;