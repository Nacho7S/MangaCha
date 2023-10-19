import { HIDE_LOGIN_MODAL, SHOW_LOGIN_MODAL } from "../Actions/actionType";

const initialState = {
  showLoginModal: false,
};

export const loginModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOGIN_MODAL:
      return { ...state, showLoginModal: true };
    case HIDE_LOGIN_MODAL:
      return { ...state, showLoginModal: false }
    default:
      return state
  }
}