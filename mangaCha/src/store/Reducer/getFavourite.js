import { ADD_LIST_FAVOURITE, CURRENT_USER_FAVOURITE, DELETE_FROM_FAVOURITE, LOADING_FAVOURITE } from "../Actions/actionType"

const initialState = {
  favourites: [],
  addedFavourite: '',
  deleteFavourite: '',
  loadingFavourites: false
}

const favouritesMangaReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_USER_FAVOURITE:
      return {
        ...state,
        favourites: action.payload,
      }
    case ADD_LIST_FAVOURITE:
      return {
        ...state,
        addedFavourite: action.payload
      }
    case DELETE_FROM_FAVOURITE:
      return {
        ...state,
        deleteFavourite: action.payload
      }
    case LOADING_FAVOURITE:
      return {
        ...state,
        loadingFavourites: action.payload
      }
    default:
      return state
  }
}

export default favouritesMangaReducer