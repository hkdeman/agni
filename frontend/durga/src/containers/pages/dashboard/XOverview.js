import { connect } from 'react-redux';
import Overview from '../../../components/pages/dashboard/Overview';

const mapStateToProps = (state) => {
    return state;
}

const XOverview = connect(
    mapStateToProps,
    null,
)(Overview);

export default XOverview;