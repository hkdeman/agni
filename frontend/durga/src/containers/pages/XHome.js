import { connect } from 'react-redux';
import Home from '../../components/pages/Home';
import { withRouter } from 'react-router-dom';


const mapStateToProps = (state) => {
    return state;
}

const XHome = connect(
    mapStateToProps,
    null,
)(Home);

export default withRouter(XHome);