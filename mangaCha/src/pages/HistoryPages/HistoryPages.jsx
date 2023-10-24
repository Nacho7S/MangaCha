import React, { useEffect, useState } from "react";
import { mangaDexImageUrl } from "../../config/url";
import './history.css'
import { useNavigate } from "react-router-dom";

export const HistoryPages = () => {
  const navigate = useNavigate()
  const historyManga = JSON.parse(localStorage.getItem("history"));

  return (
    <>
          {/* <div>HistoryPages</div> */}
      {/* {JSON.stringify(historyManga)} */}
      {historyManga ? (
    <div className="bg-dark history-page">
          {historyManga?.map(el => (
            <div className="history-card" onClick={() => navigate(`/manga/${el.n}/chapter-${el.c}/${el.cId}`)}>
              <div className="history-content">
                <img src={mangaDexImageUrl + el.mId + "/" + el.i} />
                <div className="history-detail">
                  <h2>{el.n.split("-").join(" ")}</h2>
                  <p>Chapter - {el.c}</p>
                </div>
              </div>
            </div>
          ))}
    </div>
        ) : (<p>empty</p>)}
        </>
  );
};
