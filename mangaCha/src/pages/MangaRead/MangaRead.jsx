import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import {
  fetchChapter,
  fetchMangaDetails,
} from "../../store/Actions/actionCreator";
import { mangaDexChapter, mangadexChpaterSaver } from "../../config/url";
import "./MangaRead.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Preloader from "../../components/Preloaders/Preloader";
import { BackButton } from "../../components/backButton/BackButton";

export const MangaRead = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mangaName, chapter, chapterId } = useParams();
  const { chapters, chaptersLoading } = useSelector(
    (state) => state.chapterList
  );
  const { manga, mangaLoading } = useSelector((state) => state.mangaDetails);
  const [openQuality, setOpenQuality] = useState(false);
  const [showPaginate, setShowPaginate] = useState({
    next: true,
    previous: true,
  });
  const [quality, setQuality] = useState({
    value: "highQuality",
    loading: false,
  });
  const mangaId = chapters?.dataChapters?.data?.relationships.find(
    (rel) => rel.type === "manga"
  ).id;
  const currentChapter = chapters?.dataChapters?.data?.attributes?.chapter;

  const openQualityMenu = () => {
    setOpenQuality(!openQuality);
  };

  const handleQualityChange = (newQuality) => {
    setQuality({ value: newQuality, loading: true });
    setTimeout(() => {
      setQuality({ value: newQuality, loading: false });
      setOpenQuality(false); // Close the quality menu
    }, 1000); // Simulating a delay, you can adjust the duration as needed
  };

  const renderImages = () => {
    if (quality.value === "highQuality") {
      return (
        <>
          {quality.loading || chaptersLoading ? (
            <Preloader />
          ) : (
            chapterImgData?.map((img, index) => (
              <img
                key={index}
                className="manga-panel"
                src={`${mangaDexChapter}${hash}/${img}`}
              />
            ))
          )}
        </>
      );
    }

    if (quality.value === "lowQuality") {
      return (
        <>
          {quality.loading || chaptersLoading ? (
            <Preloader />
          ) : (
            chapterImgDataSaver?.map((img, index) => (
              <img
                key={index}
                className="manga-panel"
                src={`${mangadexChpaterSaver}${hash}/${img}`}
              />
            ))
          )}
        </>
      );
    }
  };

  const fetchInitialData = async () => {
    await dispatch(fetchMangaDetails(mangaId));
    await dispatch(fetchChapter(chapterId));
  };

  useEffect(() => {
    fetchInitialData();
  }, [mangaId, chapterId]);

  const handleChangeChapter = (action) => {
    const volumes = manga?.chapters?.volumes;
    let currentVolume = chapters?.dataChapters?.data?.attributes.volume;

    if (!volumes) {
      return null;
    }

    // Get the current volume object
    let currentVolumeObj = volumes[currentVolume];

    if (!currentVolumeObj) {
      currentVolumeObj = volumes["none"];
    }
    const chapterNumbers = Object.keys(currentVolumeObj.chapters).map(Number);

    if (chapterNumbers.length === 0) {
      return null;
    }

    if (action === "previous") {
      const minChapterNumber = Math.min(...chapterNumbers);
      if (minChapterNumber < currentChapter) {
        const previousChapterNumber = chapterNumbers.reduce((prev, curr) => {
          return curr < currentChapter && curr > prev ? curr : prev;
        }, minChapterNumber);
        const currentChapterObj =
          currentVolumeObj.chapters[previousChapterNumber];
        navigate(
          `/manga/${mangaName}/chapter-${currentChapterObj.chapter}/${currentChapterObj.id}`
        );
      } else {
        let previousVolume = currentVolume - 1;
        let previousVolumeObj = volumes[previousVolume];
        if (+currentVolume === 1) {
          console.log("error");
          setShowPaginate({ ...showPaginate, [action]: false });
        } else if (!previousVolumeObj) {
          const previousVolumeNone = Object.keys(volumes);
          previousVolume = previousVolumeNone[previousVolumeNone.length - 2];
          previousVolumeObj = volumes[previousVolume];
        }
        console.log(previousVolumeObj);
        if (previousVolumeObj) {
          const chapterNumbers = Object.keys(previousVolumeObj.chapters).map(
            Number
          );
          const previousMaxChapterNumber = Math.max(...chapterNumbers);
          const previousChapterVolumeObj =
            previousVolumeObj.chapters[previousMaxChapterNumber];
          navigate(
            `/manga/${mangaName}/chapter-${previousChapterVolumeObj.chapter}/${previousChapterVolumeObj.id}`
          );
        } else {
          setShowPaginate({ ...showPaginate, [action]: false });
          console.log("No previous chapter or volume available.");
        }
      }
    } else if (action === "next") {
      const maxChapterNumber = Math.max(...chapterNumbers);
      if (maxChapterNumber > currentChapter) {
        const nextChapterNumber = chapterNumbers.reduce((prev, curr) => {
          return curr > currentChapter && curr < prev ? curr : prev;
        }, maxChapterNumber);
        const currentChapterObj = currentVolumeObj.chapters[nextChapterNumber];
        console.log(currentChapterObj);
        navigate(
          `/manga/${mangaName}/chapter-${currentChapterObj.chapter}/${currentChapterObj.id}`
        );
      } else {
        const nextVolume = +currentVolume + 1;
        let nextVolumeObj = volumes[nextVolume];
        if (!nextVolumeObj) {
          nextVolumeObj = volumes["none"];
        }
        if (nextVolumeObj) {
          // console.log(nextVolumeObj);
          const chapterNumbers = Object.keys(nextVolumeObj.chapters).map(
            Number
          );
          const nextMinChapterNumber = Math.min(...chapterNumbers);
          const nextChapterVolumeObj =
            nextVolumeObj.chapters[nextMinChapterNumber];
          navigate(
            `/manga/${mangaName}/chapter-${nextChapterVolumeObj.chapter}/${nextChapterVolumeObj.id}`
          );
        } else {
          // setShowPaginate({...showPaginate, [action]: false})
          console.log("No next chapter available.");
        }
      }
    }
  };

  const renderPaginationManga = () => {
    return (
      <div className="display-flex-row manga-pagination">
        {showPaginate.previous ? (
          <button
            className="button-prev"
            onClick={() => handleChangeChapter("previous")}
          >
            <ArrowBackIosIcon style={{ paddingLeft: 7, color: "#212529" }} />
          </button>
        ) : (
          <></>
        )}
        {showPaginate.next ? (
          <button
            className="button-next"
            onClick={() => handleChangeChapter("next")}
          >
            <ArrowForwardIosIcon
              style={{ paddingRight: 7, color: "#212529" }}
            />
          </button>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const hash = chapters?.chapter?.chapter?.hash;
  const chapterImgData = chapters?.chapter?.chapter?.data;
  const chapterImgDataSaver = chapters?.chapter?.chapter?.dataSaver;

  return (
    <>
      {(mangaLoading || chaptersLoading) && !manga && !chapters ? (
        <Preloader/>
      ) : (
          <div className="manga-body">
            <BackButton path={ `/manga/${mangaId}` } />
          <div className="title-chapter">
            <h1 className="text-color-light">CHAPTER - {currentChapter}</h1>
            <h4 className="text-color-darker-light">
              {chapters?.dataChapters?.data?.attributes?.title}
            </h4>
          </div>
          {renderPaginationManga()}
          <div className="settings-quality">
            <MoreVertIcon onClick={openQualityMenu} />
          </div>
          {openQuality ? (
            <div className="menu-quality">
              <div
                className="quality-text"
                onClick={() => handleQualityChange("highQuality")}
              >
                High Quality
              </div>
              <div
                className="quality-text"
                onClick={() => handleQualityChange("lowQuality")}
              >
                Low Quality
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="manga-page display-flex-row">{renderImages()}</div>
          {renderPaginationManga()}
        </div>
      )}
    </>
  );
};
