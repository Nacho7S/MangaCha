import React from 'react'
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export const PrevButton = ({previous}) => {
  return (
    <button
            className="button-prev"
            onClick={() => previous("previous")}
          >
            <ArrowBackIosIcon style={{ paddingLeft: 7, color: "#212529" }} />
          </button>
  )
}
