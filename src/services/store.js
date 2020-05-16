import { createStore as createReduxStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

export const initialState = {
  /** Absolute path to currently imported file */
  isGuest: false,
  currentImport: null,
  nightMode: false,
  inputsOrder: {
    husband: ['first_name', 'last_name', 'maiden_name', 'age', 'mother', 'father', 'other'],
    wife: ['first_name', 'last_name', 'maiden_name', 'age', 'mother', 'father', 'other'],
  },
  pin: false,
  enablePolishLetters: true,
}

export const actionTypes = {
  SET_PREFERENCES: 'SET_PREFERENCES',
}

const reducer = (state = initialState, { type, payload }) => {
  switch(type) {
    case actionTypes.SET_PREFERENCES:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}

export const setPreferences = (payload) => ({ type: actionTypes.SET_PREFERENCES, payload })


export function createStore(state) {
  return createReduxStore(
      reducer, state, composeWithDevTools(applyMiddleware()),
  )
}
