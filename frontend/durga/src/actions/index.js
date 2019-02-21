export const setSSHDetails = (host, username, password) => ({
  type: 'ADD_SSH_DETAILS',
  host,
  username,
  password,
});

export const setToken = (token) => ({
  type: 'ADD_TOKEN',
  token,
});