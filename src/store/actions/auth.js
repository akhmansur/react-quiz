import axios from 'axios';
import {AUTH_LOGOUT, AUTH_SUCCESS} from './actionTypes';

export function auth(email, password, isLogin) {
  return async dispatch => {
    const authData = {
      email, password,
      returnSecureToken: true
    }

    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}'

    if (isLogin) {
      url ='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}'
    }
    const response = await axios.post(url, authData)
    const data = response.data

    const expirationDate =
      new Date(new Date().getTime() + data.expiresIn * 1000)

    localStorage.setItem('expirationDate', expirationDate)
    localStorage.setItem('token', data.idToken)
    localStorage.setItem('userId', data.localId)

    dispatch(authSuccess(data.idToken))
    dispatch(autoLogout(data.expiresIn))
  }
}

export function logout() {
  localStorage.removeItem('expirationDate')
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  return {
    type: AUTH_LOGOUT
  }
}

export function autoLogout(time) {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout())
    }, time * 1000)
  }
}

export function authSuccess(token) {
  return {
    type: AUTH_SUCCESS,
    token
  }
}

export function autoLogin() {
  return dispatch => {
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch(logout())
    } else {
      const expirationDate =
        new Date(localStorage.getItem('expirationDate'))
      if (expirationDate <= new Date()) {
        dispatch(logout())
      } else {
        dispatch(authSuccess(token))
        dispatch(
            autoLogout((expirationDate.getTime() - new Date().getTime())/1000)
        )
      }
    }
  }
}
