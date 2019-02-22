import { connect } from 'react-redux';
import { setSSHDetails } from '../../actions';
import SSHForm from '../../components/ui/SSHForm';


const mapDispatchToProps = dispatch => ({
  setSSHDetails: (host, username, password) => dispatch(setSSHDetails(host, username, password))
});

const XSSHForm = connect(
  null,
  mapDispatchToProps
)(SSHForm);

export default XSSHForm;