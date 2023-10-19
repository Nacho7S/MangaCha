import { combineReducers } from 'redux'
import mangaReducer from './manga'
import mangaDetailsReducer from './mangaDetails'
import chapterReducer from './chapter'
import { loginModalReducer } from './loginModal'
import registerReducer from './register'
import loginReducer from './login'
import currentUserReducer from './currentUser'
import favouritesMangaReducer from './getFavourite'

const rootReducer = combineReducers({
  mangas: mangaReducer,
  mangaDetails: mangaDetailsReducer,
  chapterList: chapterReducer,
  loginModal: loginModalReducer,
  registerUser: registerReducer,
  loginUser: loginReducer,
  currentUser: currentUserReducer,
  userFavourites: favouritesMangaReducer
})

export default rootReducer