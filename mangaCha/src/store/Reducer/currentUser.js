import { CURRENT_USER, LOADING } from "../Actions/actionType"

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
    case LOADING:
      return {
        ...state,
        userLoading: action.payload
      }
    default:
      return state
  }
}

export default currentUserReducer