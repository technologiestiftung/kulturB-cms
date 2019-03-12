import history from '~/history';
import userApi from '~/services/userApi';
import storage from '~/services/storage';

const LOGIN = 'App/AppState/LOGIN';
const LOGIN_COMPLETED = 'App/AppState/LOGIN_COMPLETED';
const LOGIN_FAILED = 'App/AppState/LOGIN_FAILED';
const LOGOUT = 'App/AppState/LOGOUT';
const LOGOUT_COMPLETED = 'App/AppState/LOGOUT_COMPLETED';

const tokenStorageKey = 'accessToken';
const refreshTokenStorageKey = 'refreshToken';

const initialState = {
  token: storage.get(tokenStorageKey),
  loginError: null,
  isLogginIn: false
};

function loginFailed() {
  storage.remove(tokenStorageKey);
  return { type: LOGIN_FAILED, payload: { loginError: true, isLogginIn: false } };
}

function loginCompleted(response) {
  const { accessToken, refreshToken } = response;
  if (!accessToken) return loginFailed();
  storage.set(tokenStorageKey, accessToken);
  storage.set(refreshTokenStorageKey, refreshToken);

  return {
    type: LOGIN_COMPLETED,
    payload: {
      token: accessToken,
      loginError: null,
      isLogginIn: false
    }
  };
}

export function login(values) {
  return (dispatch) => {
    dispatch({ type: LOGIN, payload: { isLogginIn: true } });

    userApi.login(values)
      .then(res => dispatch(loginCompleted(res)))
      .catch(() => dispatch(loginFailed()));
  };
}

function logoutCompleted() {
  history.push('/login');
  return { type: LOGOUT_COMPLETED, payload: { token: null, loginError: null } };
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: LOGOUT });

    storage.remove(tokenStorageKey);
    storage.remove(refreshTokenStorageKey);
    dispatch(logoutCompleted());
  };
}

export default function AppStateReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGOUT:
    case LOGOUT_COMPLETED:
    case LOGIN:
    case LOGIN_COMPLETED:
    case LOGIN_FAILED:
      return Object.assign({}, state, action.payload || {});
    default:
      return Object.assign({}, state);
  }
}
