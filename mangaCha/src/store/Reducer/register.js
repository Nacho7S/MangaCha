import { REGISTER_USER } from "../Actions/actionType"

const initialState = {
  registerStatus: ''
}

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      return {
        ...state,
        registerStatus: action.payload
      }
    default:
      return state
  }
}

export default registerReducer
