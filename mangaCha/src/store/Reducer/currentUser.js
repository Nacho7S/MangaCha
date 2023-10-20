import { CURRENT_USER, LOADING_USER } from "../Actions/actionType"

const initialState = {
  currentUserData: '',
  userLoading: false
}

const currentUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_USER:
      return {
        ...state,
        currentUserData: action.payload
      }
    case LOADING_USER:
      return {
        ...state,
        userLoading: action.payload
      }
    default:
      return state
  }
}

export default currentUserReducer