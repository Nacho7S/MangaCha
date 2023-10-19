import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFavouriteUser } from '../../store/Actions/actionCreator'

export const FavouritePages = () => {
  const dispatch = useDispatch()
  const {} = useSelector((state) => state.)
  useEffect(() => {
    dispatch(getFavouriteUser)
  }, [])
  return (
    <div>FavouritePages</div>
  )
}
