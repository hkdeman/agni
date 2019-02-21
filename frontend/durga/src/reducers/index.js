import { combineReducers } from 'redux';
import ssh from './ssh';
import auth from './auth';

export default combineReducers({
  ssh,
  auth,
});