import { CURRENT_USER_FAVOURITE, LOADING } from "../Actions/actionType"

const initialState = {
  favourites: [],
  loadingFavourites: false
}

const favouritesMangaReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_USER_FAVOURITE:
      return {
        ...state,
        favourites: action.payload,
      }
    case LOADING:
      return {
        ...state,
        loadingFavourites: action.payload
      }
    default:
      return state
  }
}

export default favouritesMangaReducer