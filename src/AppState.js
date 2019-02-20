import history from '~/history';
import api from '~/services/api';
import storage from '~/services/storage';

const LOGIN = 'App/AppState/LOGIN';
const LOGIN_COMPLETED = 'App/AppState/LOGIN_COMPLETED';
const LOGIN_FAILED = 'App/AppState/LOGIN_FAILED';

const initialState = {
  token: storage.get('jwt')
};

function loginFailed() {
  return { type: LOGIN_FAILED };
}

function loginCompleted(response) {
  const { token } = response;
  if (!token) return loginFailed();
  storage.set('jwt', token);
  return { type: LOGIN_COMPLETED, payload: { token } };
}

export function login(values) {
  return (dispatch) => {
    dispatch({ type: LOGIN });

    api.login(values)
      .then(res => dispatch(loginCompleted(res)));
  };
}

export default function AppStateReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN:
    case LOGIN_COMPLETED:
    case LOGIN_FAILED:
      return Object.assign({}, state, action.payload || {});
    default:
      return Object.assign({}, state);
  }
}
