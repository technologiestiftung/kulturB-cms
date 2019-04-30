import Store from '~/store';
import history from '~/history';
import userApi from '~/services/userApi';
import storage from '~/services/storage';

const LOGIN = 'App/AppState/LOGIN';
const LOGIN_COMPLETED = 'App/AppState/LOGIN_COMPLETED';
const LOGIN_FAILED = 'App/AppState/LOGIN_FAILED';
const LOGOUT = 'App/AppState/LOGOUT';
const LOGOUT_COMPLETED = 'App/AppState/LOGOUT_COMPLETED';
const REFRESH_TOKEN = 'App/AppState/REFRESH_TOKEN';
const REFRESH_COMPLETED = 'App/AppState/REFRESH_COMPLETED';

const tokenStorageKey = 'accessToken';
const refreshTokenStorageKey = 'refreshToken';
const roleStorageKey = 'role';
const organisationStorageKey = 'organisation';

const initialState = {
  role: storage.get(roleStorageKey) || 'ANONYMOUS',
  organisation: storage.get(organisationStorageKey),
  token: storage.get(tokenStorageKey),
  refreshToken: storage.get(refreshTokenStorageKey),
  loginError: null,
  isLogginIn: false
};

function clearStorage() {
  storage.remove(tokenStorageKey);
  storage.remove(refreshTokenStorageKey);
  storage.remove(organisationStorageKey);
  storage.remove(roleStorageKey);
}

function loginFailed() {
  clearStorage();

  return { type: LOGIN_FAILED, payload: { loginError: true, isLogginIn: false } };
}

function loginCompleted(response) {
  const {
    accessToken,
    refreshToken,
    role,
    organisation
  } = response;
  if (!accessToken) return loginFailed();
  storage.set(tokenStorageKey, accessToken);
  storage.set(refreshTokenStorageKey, refreshToken);
  storage.set(roleStorageKey, role);
  organisation && organisation.id && storage.set(organisationStorageKey, organisation.id);

  return {
    type: LOGIN_COMPLETED,
    payload: {
      role,
      organisation: organisation && organisation.id,
      token: accessToken,
      refreshToken,
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

function refreshCompleted(response) {
  const { accessToken } = response;
  if (!accessToken) return loginFailed();
  storage.set(tokenStorageKey, accessToken);

  return {
    type: REFRESH_COMPLETED,
    payload: {
      token: accessToken,
      loginError: null,
      isLogginIn: false
    }
  };
}

export function refreshAccessToken() {
  return (dispatch) => {
    dispatch({ type: REFRESH_TOKEN });
    const { refreshToken } = Store.getState().AppState;
    if (refreshToken) {
      userApi.refreshToken({ token: refreshToken })
        .then(res => dispatch(refreshCompleted(res)))
        .catch(() => dispatch(loginFailed()));
    }
  };
}

function logoutCompleted() {
  history.push('/login');
  return {
    type: LOGOUT_COMPLETED,
    payload: {
      token: null,
      loginError: null,
      role: 'ANONYMOUS',
      organisation: null
    }
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: LOGOUT });

    clearStorage();
    dispatch(logoutCompleted());
  };
}

export default function AppStateReducer(state = initialState, action = {}) {
  switch (action.type) {
    case REFRESH_TOKEN:
    case REFRESH_COMPLETED:
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
