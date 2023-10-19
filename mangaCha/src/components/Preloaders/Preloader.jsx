import React from 'react'
import "./Preloader.css"

export default function Preloader({img}) {
  return (
    <div className='preloader-bg'>
      <img src='/preloader.png' alt='preloader' className='preloader-img'/>
    </div>
  )
}
