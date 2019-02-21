import { connect } from 'react-redux';
import Home from '../../components/pages/Home';

const mapStateToProps = (state) => {
    return state;
}

const XHome = connect(
    mapStateToProps,
    null,
)(Home);

export default XHome;