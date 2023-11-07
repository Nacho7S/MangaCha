import React, {useEffect, useState} from "react"; 
import Carousel from 'react-bootstrap/Carousel';
import "./mangaPanel.css"

function HomeCarousel({data, dataSaver, quality ,hash, chapter, page}) {
  

  // useEffect(() => {})
  console.log(quality);
  const qualityManga = () => {
    if (quality === "highQuality") {
      return data
    } else {
      return dataSaver
    }
  }

  console.log(qualityManga());

  return (
    <>
      {qualityManga()
    ?.filter((img, i) => i === page)
    .map((img, i) => (
      <div
        key={i}
      >
        <img src={`${chapter}${hash}/${img}`} />
      </div>
    ))
  }
    </>
  );
}
export default HomeCarousel;