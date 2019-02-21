import { connect } from 'react-redux';
import Process from '../../../components/pages/dashboard/Process';

const mapStateToProps = (state) => {
    return state;
}

const XProcess = connect(
    mapStateToProps,
    null,
)(Process);

export default XProcess;