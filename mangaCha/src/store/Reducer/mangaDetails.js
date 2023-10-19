import { LOADING, SUCCESS_FETCH_MANGA_DETAIL } from "../Actions/actionType";

const initialState = {
  manga: '',
  mangaLoading: false
}

const mangaDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_MANGA_DETAIL:
      return {
        ...state,
        manga: action.payload
      }
    case LOADING: 
      return {
        ...state,
        mangaLoading: action.payload
      }
    default:
      return state
  }
}

export default mangaDetailsReducer