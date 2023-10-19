import { BASE_URLS } from "../../config/url";
import { CURRENT_USER, HIDE_LOGIN_MODAL, LOADING, LOGIN_USER, REGISTER_USER, SHOW_LOGIN_MODAL, SUCCESSS_FETCH_MANGA, SUCCESS_FETCH_CHAPTER_LIST, SUCCESS_FETCH_MANGA_DETAIL } from "./actionType";
import Cookies from 'universal-cookie';
const cookies = new Cookies(null, { path: '/' });

export function fetchMangas(search, page) {
  return async (dispatch) => {
    dispatch({
      type: LOADING,
      payload: true
    })
    try {
      console.log({ search: search, page: +page });
      let urls = `${BASE_URLS}`
      if (page || page === 0) {
        urls += `/?page=${page}`
        if (search) {
          urls += `&search=${search}`
        }
      }
      else if (search || page === NaN) {
        urls += `/?search=${search}`
      }
      console.log(urls);
      const res = await fetch(urls)
      const dataJson = await res.json()
      // console.log("data", JSON.stringify(dataJson.data))
      dispatch({
        type: SUCCESSS_FETCH_MANGA,
        payload: dataJson
      })
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({
        type: LOADING,
        payload: false
      })
    }
  }
}

export function fetchMangaDetails(mangaId) {
  return async (dispatch) => {
    dispatch({
      type: LOADING,
      payload: true
    })

    try {
      let urls = `${BASE_URLS}`
      if (mangaId) {
        urls += `/${mangaId}`
      }
      const res = await fetch(urls)
      const dataJson = await res.json()
      // console.log("data", dataJson)
      dispatch({
        type: SUCCESS_FETCH_MANGA_DETAIL,
        payload: dataJson
      })
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({
        type: LOADING,
        payload: false
      })
    }
  }
}

export function fetchChapter(chapterId) {
  return async (dispatch) => {
    dispatch({
      type: LOADING,
      payload: true
    })

    try {
      let urls = `${BASE_URLS}/chapter/${chapterId}`
      const res = await fetch(urls)
      const dataJson = await res.json()
      dispatch({
        type: SUCCESS_FETCH_CHAPTER_LIST,
        payload: dataJson
      })
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({
        type: LOADING,
        payload: false
      })
    }
  }
}

export const openLoginModal = () => ({
  type: SHOW_LOGIN_MODAL
})

export const closeLoginModal = () => ({
  type: HIDE_LOGIN_MODAL
})

export function handleRegister(user) {
  return async (dispatch) => {
    try {
      const RegisterUser = {
        userName: user.firstName + " " + user.lastName,
        email: user.email,
        password: user.password,
        profilePicture: "urlimg.jpeg",
        description: 'hello there!'
      }
      console.log(RegisterUser);
      const urls = `${BASE_URLS}/register`
      const res = await fetch(urls, {
        method: 'POST',
        body: JSON.stringify(RegisterUser),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      const dataJson = await res.json()
      console.log(dataJson);
      dispatch({
        type: REGISTER_USER,
        payload: dataJson
      })
    } catch (err) {
      console.log(err);
    }
  }
}

export function handleLogin(user) {
  return async (dispatch) => {
    try {
      const urls = `${BASE_URLS}/login`
      const res = await fetch(urls, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      const dataJson = await res.json()
      dispatch({
        type: LOGIN_USER,
        payload: dataJson
      })
      cookies.set('access_token', dataJson.access_token)
    } catch (err) {
      console.log(err);
    }
  }
}

export function getCurrentUser(access_token) {
  return async (dispatch) => {
    dispatch({
      type: LOADING,
      action: true
    })
    try {
      const urls = `${BASE_URLS}/user`
      const res = await fetch(urls, {
        headers: {
          "Authorization": access_token || cookies.get("access_token")
        }
      })
      const dataJson = await res.json()
      dispatch({
        type: CURRENT_USER,
        payload: dataJson
      })
      // sessionStorage.setItem("currentUser", dataJson.user)
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({
        type: LOADING,
        payload: false
      })
    }
  }
}

export function getFavouriteUser() {
  return async (dispatch) => {
    dispatch({
      type: LOADING,
      action: true
    })
    try {
      const urls = `${BASE_URLS}/favourite`
      const res = await fetch(urls, {
        headers: { "Authorization": cookies.get("access_token") }
      })
      const dataJson = await res.json()
      console.log(dataJson);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({
        type: LOADING,
        action: false
      })
    }
  }
}