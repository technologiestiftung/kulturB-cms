import history from '~/history';
import api from '~/services/api';
import storage from '~/services/storage';

const LOGIN = 'App/AppState/LOGIN';
const LOGIN_COMPLETED = 'App/AppState/LOGIN_COMPLETED';
const LOGIN_FAILED = 'App/AppState/LOGIN_FAILED';
const LOGOUT = 'App/AppState/LOGOUT';
const LOGOUT_COMPLETED = 'App/AppState/LOGOUT_COMPLETED';

const tokenStorageKey = 'jwt';

const initialState = {
  token: storage.get(tokenStorageKey)
};

function loginFailed() {
  storage.remove(tokenStorageKey);
  return { type: LOGIN_FAILED };
}

function loginCompleted(response) {
  const { token } = response;
  if (!token) return loginFailed();
  storage.set(tokenStorageKey, token);
  return { type: LOGIN_COMPLETED, payload: { token } };
}

export function login(values) {
  return (dispatch) => {
    dispatch({ type: LOGIN });

    api.login(values)
      .then(res => dispatch(loginCompleted(res)));
  };
}

function logoutCompleted() {
  history.push('/login');
  return { type: LOGOUT_COMPLETED };
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: LOGOUT });

    storage.remove(tokenStorageKey);
    console.log(storage.get(tokenStorageKey));
    dispatch(logoutCompleted());
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
