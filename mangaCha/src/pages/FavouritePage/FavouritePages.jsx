import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFavouriteUser } from '../../store/Actions/actionCreator'
import Cookies from 'universal-cookie';
import { MangaComponent } from '../../components/manga/MangaComponents';
const cookies = new Cookies(null ,{ path: '/' });
export const FavouritePages = () => {
  const dispatch = useDispatch()
  const { favourites, loadingFavourites } = useSelector((state) => state.userFavourites)
  const currentCookie = cookies.get("access_token")
  useEffect(() => {
    if (currentCookie) {
      dispatch(getFavouriteUser())
    }
  }, [])
  return (
    <>
      {currentCookie ? (
      <div className='manga bg-dark'>
      {favourites?.map((manga) => (
        // <p>{JSON.stringify(manga.data)}</p>
        <MangaComponent manga={manga.data}/>
        ))}
        </div>
        ) : (<> <h1>ooppss...</h1></>)}
    </>
  )
}
