import React from 'react'


import {Outlet} from 'react-router-dom'
import { Navbars } from '../Navbars/Navbars'
import { TopBars } from '../Navbars/TopBars'
import { LoginPage } from '../../pages/LoginRegisterPage/LoginModal'

export const BaseLayout = () => {
  return (
    <>
      <TopBars/>
      <Navbars />
      <Outlet />
      <LoginPage/>
    </>
  )
}
