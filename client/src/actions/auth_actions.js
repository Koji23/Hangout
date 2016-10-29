import axios from 'axios';
import { browserHistory } from 'react-router';

// Endpoints
const AUTH_URL = 'http://localhost:3090';

// Action Types
export const AUTH_USER = 'auth_user';
export const UNAUTH_USER = 'unauth_user';
export const AUTH_ERROR = 'auth_error';
export const FETCH_MESSAGE = 'fetch_message';

// Helper Action Creator - to place an error message on state
function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}

// Primary Action Creators
export function signInUser(email, password) {
  return function(dispatch) {
    axios.post(`${AUTH_URL}/signin`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/resource');
      })
      .catch(() => {
        dispatch(authError('Incorrect Login Info'));
      });
    };
}

export function signUpUser(email, password) {
  return function(dispatch) {
    axios.post(`${AUTH_URL}/signup`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/profilepic');
      })
      .catch(response => {
        dispatch(authError(response.data.error));
      });
  }
}

export function signOutUser() {
  localStorage.removeItem('token');

  return { type: UNAUTH_USER };
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(AUTH_URL, {
      headers: { Authorization: localStorage.getItem('token') }
    })
      .then(response => {
        console.log('~~~~~~~~~~~!@', response,response.data.hi);
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.hi
        });
      });
  }
}
