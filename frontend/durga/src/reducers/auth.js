const auth = (state = {}, action) => {
    switch (action.type) {
      case 'ADD_TOKEN':
        let newState = Object.assign({}, state, {
                            token: action.token,
                        });
        return newState;
      default:
        return state;
    }
  };
  
  export default auth;