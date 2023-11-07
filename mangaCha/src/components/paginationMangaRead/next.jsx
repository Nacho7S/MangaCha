import React from 'react'
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export const NextButton = ({next}) => {
  return (
    <button
            className="button-next"
            onClick={() => next("next")}
          >
            <ArrowForwardIosIcon
              style={{ paddingRight: 7, color: "#212529" }}
            />
          </button>
  )
}
