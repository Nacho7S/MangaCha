import { LOGIN_USER } from "../Actions/actionType"

const initialState = {
  accessToken: '',
}

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        accessToken: action.payload,
      }
    default:
      return state
  }
}

export default loginReducer