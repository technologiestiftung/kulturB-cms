import history from '~/history';

const LOGIN = 'App/AppState/LOGIN';
const LOGIN_COMPLETED = 'App/AppState/LOGIN_COMPLETED';
const LOGIN_FAILED = 'App/AppState/LOGIN_FAILED';

const initialState = {
  token: null
};

function loginCompleted() {
  return { type: LOGIN_COMPLETED, payload: { token: 123456 } };
}

function loginFailed() {
  return { type: LOGIN_FAILED };
}

export function login() {
  return (dispatch) => {
    dispatch({ type: LOGIN });

    setTimeout(() => dispatch(loginCompleted()), 500);
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
