const ssh = (state = {}, action) => {
    switch (action.type) {
      case 'ADD_SSH_DETAILS':
        let newState = Object.assign({}, state, {
                            isConnected: true,
                            host: action.host,
                            username: action.username,
                            password: action.password,
                        });
        return newState;
      default:
        return state;
    }
  };
  
  export default ssh;