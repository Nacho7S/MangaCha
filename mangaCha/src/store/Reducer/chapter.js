import { LOADING, SUCCESS_FETCH_CHAPTER_LIST } from "../Actions/actionType";

const initialState = {
  chapters: '',
  chaptersLoading: false
}

const chapterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS_FETCH_CHAPTER_LIST:
      return {
        ...state,
        chapters: action.payload
      }
    case LOADING:
      return {
        ...state,
        chaptersLoading: action.payload
      }
    default:
      return state
  } 
}

export default chapterReducer