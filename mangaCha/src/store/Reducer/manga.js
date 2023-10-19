import { SUCCESSS_FETCH_MANGA, LOADING } from '../Actions/actionType'

const initialState = {
  mangas: '',
  mangasLoading: false
}

const mangaReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUCCESSS_FETCH_MANGA:
      return {
        ...state,
        mangas: action.payload,
      }
    case LOADING: 
      return {
        ...state,
        mangasLoading : action.payload
      }
    default: 
      return state
  }
}

export default mangaReducer