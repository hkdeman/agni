import { connect } from 'react-redux';
import Editor from '../../../components/pages/dashboard/Editor';

const mapStateToProps = (state) => {
    return state;
}

const XEditor = connect(
    mapStateToProps,
    null,
)(Editor);

export default XEditor;