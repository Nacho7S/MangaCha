import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from "react-router-dom";
import "./BackButton.css"

export const BackButton = ({ path }) => {
  const navigate = useNavigate()
  return (
    <button title="back" className="back-button" onClick={() => navigate(path)}><ArrowBackIcon/></button>
  )
}
