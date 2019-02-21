import { connect } from 'react-redux';
import Network from '../../../components/pages/dashboard/Network';

const mapStateToProps = (state) => {
    return state;
}

const XNetwork = connect(
    mapStateToProps,
    null,
)(Network);

export default XNetwork;