import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChapter,
  fetchMangaDetails,
} from "../../store/Actions/actionCreator";
import { mangaDexChapter, mangadexChpaterSaver } from "../../config/url";
import "./MangaRead.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Preloader from "../../components/Preloaders/Preloader";
import { BackButton } from "../../components/backButton/BackButton";
import { PrevButton } from "../../components/paginationMangaRead/prev";
import { NextButton } from "../../components/paginationMangaRead/next";
import scrollToTop from "../../utils/AutoScroll";

export const MangaRead = ({ qualitySpeed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef(null);
  const query = new URLSearchParams(location.search);
  const mangaId = query?.get("mId");
  const { mangaName, chapter, chapterId } = useParams();
  const { chapters, chaptersLoading } = useSelector(
    (state) => state.chapterList
  );
  // console.log(qualitySpeed);
  const { manga, mangaLoading } = useSelector((state) => state.mangaDetails);
  const [cover, setCover] = useState(
    manga?.mangaDetails?.data?.relationships.find(
      (rel) => rel.type === "cover_art"
    ).attributes.fileName
  );
  // console.log(manga);
  const [openQuality, setOpenQuality] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showPaginate, setShowPaginate] = useState({
    next: true,
    previous: true,
  });
  const [showPaginatePanel, setShowPaginatePanel] = useState({
    next: true,
    previous: true,
  });
  const [quality, setQuality] = useState({
    value: "highQuality",
    loading: false,
  });
  // const mangaId = chapters?.dataChapters?.data?.relationships.find(
  //   (rel) => rel.type === "manga"
  // ).id;
  const currentChapter = chapters?.dataChapters?.data?.attributes?.chapter;

  // console.log(mangaName, mangaId,chapter, chapterId);

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
  const hash = chapters?.chapter?.chapter?.hash;
  const chapterImgData = chapters?.chapter?.chapter?.data;
  const chapterImgDataSaver = chapters?.chapter?.chapter?.dataSaver;

  // console.log(mangaDexChapter, hash, chapterImgData);
  const fetchInitialData = async () => {
    await dispatch(fetchChapter(chapterId));
    await dispatch(fetchMangaDetails(mangaId));
  };

  useEffect(() => {
    fetchInitialData();
    addMangaHistory();
    if (manga) {
      setCover(
        manga?.mangaDetails?.data?.relationships.find(
          (rel) => rel.type === "cover_art"
        ).attributes.fileName
      );
    }
    ref?.current?.focus();
  }, [mangaId, chapterId]);

  const showFocusedPanel = (index) => {
    setFocusedIndex(index);
  };

  console.log(focusedIndex, "focused");

  // console.log(window.location.pathname === `/manga/${mangaName}/${chapter}/${chapterId}`);
  // console.log(window.location.pathname);

  const renderImages = () => {
    if (quality.value === "highQuality" || qualitySpeed === "highQuality") {
      return (
        <>
          {quality.loading || chaptersLoading ? (
            <Preloader />
          ) : (
            <>
              {chapterImgData
                ?.filter((img, i) => i === focusedIndex)
                ?.map((img, index) => (
                  <div className={`manga-panel`}>
                    <span>Page {index + 1}</span>
                    <img key={index} src={`${mangaDexChapter}${hash}/${img}`} />
                  </div>
                ))}
            </>
          )}
        </>
      );
    }

    if (quality.value === "lowQuality" || qualitySpeed === "lowQuality") {
      return (
        <>
          {quality.loading || chaptersLoading ? (
            <Preloader />
          ) : (
            chapterImgDataSaver
              ?.filter((img, i) => i === focusedIndex)
              ?.map((img, index) => (
                <div className={`manga-panel`}>
                  <img
                    key={index}
                    src={`${mangadexChpaterSaver}${hash}/${img}`}
                    alt={index}
                  />
                </div>
              ))
          )}
        </>
      );
    }
  };

  // console.log(renderImages());

  const handleChangeChapter = (action) => {
    const volumes = manga?.chapters?.volumes;
    let currentVolume = chapters?.dataChapters?.data?.attributes.volume;
    if (!volumes) {
      return null;
    }

    let currentVolumeObj = volumes[currentVolume];
    if (!currentVolumeObj) {
      currentVolumeObj = volumes["none"];
    }
    const chapterNumbers = Object.keys(currentVolumeObj.chapters).map(Number);

    if (chapterNumbers.length === 0) {
      return null;
    }

    if (action === "previous") {
      setFocusedIndex(0);
      const minChapterNumber = Math.min(...chapterNumbers);
      if (minChapterNumber < currentChapter) {
        const previousChapterNumber = chapterNumbers.reduce((prev, curr) => {
          return curr < currentChapter && curr > prev ? curr : prev;
        }, minChapterNumber);
        const currentChapterObj =
          currentVolumeObj.chapters[previousChapterNumber];
        navigate(
          `/manga/${mangaName}/chapter-${currentChapterObj.chapter}/${currentChapterObj.id}?mId=${mangaId}`
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
            `/manga/${mangaName}/chapter-${previousChapterVolumeObj.chapter}/${previousChapterVolumeObj.id}?mId=${mangaId}`
          );
        } else {
          setShowPaginate({ ...showPaginate, [action]: false });
          console.log("No previous chapter or volume available.");
        }
      }
    } else if (action === "next") {
      setFocusedIndex(0);
      const maxChapterNumber = Math.max(...chapterNumbers);
      if (maxChapterNumber > currentChapter) {
        const nextChapterNumber = chapterNumbers.reduce((prev, curr) => {
          return curr > currentChapter && curr < prev ? curr : prev;
        }, maxChapterNumber);
        const currentChapterObj = currentVolumeObj.chapters[nextChapterNumber];
        console.log(currentChapterObj);
        navigate(
          `/manga/${mangaName}/chapter-${currentChapterObj.chapter}/${currentChapterObj.id}?mId=${mangaId}`
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
            `/manga/${mangaName}/chapter-${nextChapterVolumeObj.chapter}/${nextChapterVolumeObj.id}?mId=${mangaId}`
          );
        } else {
          // setShowPaginate({...showPaginate, [action]: false})
          console.log("No next chapter available.");
        }
      }
    }
  };

  const renderChapterList = () => {
    const volumes = manga?.chapters?.volumes;

    if (!volumes) {
      return <Preloader />;
    }

    const handleChapterChange = async (event) => {
      // console.log(event.target.value);
      const { idSelected, chapterSelected } = JSON.parse(event.target.value);
      // console.log(idSelected, chapterSelected);
      await setFocusedIndex(0);
      await navigate(
        `/manga/${mangaName}/chapter-${chapterSelected}/${idSelected}?mId=${mangaId}`
      );
    };

    return (
      <select onChange={handleChapterChange}>
        <option disabled="true" selected="true" hidden="true">
          Select Chapter
        </option>
        {Object.keys(volumes).map((volumeNumber) => {
          const volume = volumes[volumeNumber];
          return (
            <>
              <option disabled="true">Volume {volumeNumber}</option>
              {Object.keys(volume.chapters).map((chapterNumber) => {
                const chapter = volume.chapters[chapterNumber];
                return (
                  <option
                    selected={chapterId === chapter.id ? "selected" : ""}
                    disabled={chapterId === chapter.id ? "true" : ""}
                    className={`${chapterId === chapter.id ? "font-bold": ""}`}
                    key={chapter.id}
                    value={JSON.stringify({
                      idSelected: chapter.id,
                      chapterSelected: chapter.chapter,
                    })}
                  >
                    Chapter {chapter?.chapter} 
                  </option>
                );
              })}
            </>
          );
        })}
      </select>
    );
  };

  const renderPageList = () => {
    const onChangePage = (e) => {
      const { value } = e.target;
      setFocusedIndex(+value);
    };

    return (
      <select onChange={onChangePage}>
        <option value="" hidden="true" selected>
          Select Page
        </option>
        {chapterImgData?.map((manga, i) => {
          return (
            <option
              key={i}
              value={i}
              selected={focusedIndex === i ? "selected" : ""}
              className={`${focusedIndex === i ? "font-bold" : ""}`}
            >
              Page {i + 1}
            </option>
          );
        })}
      </select>
    );
  };

  const renderPaginationManga = () => {
    return (
      <div className="display-flex-row manga-pagination">
        {showPaginate.previous ? (
          <PrevButton previous={handleChangeChapter} />
        ) : (
          <></>
        )}
        {renderChapterList()}
        {showPaginate.next ? <NextButton next={handleChangeChapter} /> : <></>}
      </div>
    );
  };

  const changePagePanel = async (action) => {
    const dataimg = chapterImgData || chapterImgDataSaver;
    // console.log(dataimg);
    if (action === "next") {
      await setFocusedIndex(focusedIndex + 1);
      // console.log(dataimg.length < focusedIndex);
      scrollToTop()
      if (dataimg.length - 1 <= focusedIndex) {
        await handleChangeChapter("next");
        await setFocusedIndex(0);
        // window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
    if (action === "previous") {
      await setFocusedIndex(focusedIndex - 1);
      scrollToTop()
      if (focusedIndex <= 0) {
        // alert("oops")
        await handleChangeChapter("previous");
        await setFocusedIndex(0);
      }
    }
  };

  const handleKeydown = (e) => {
    const { key } = e;
    if (key === "ArrowRight") {
      changePagePanel("next");
    }
    if (key === "ArrowLeft") {
      changePagePanel("previous");
    }
  };

  const renderPaginationPanel = () => {
    return (
      <>
        {focusedIndex || focusedIndex === 0 ? (
          <div className="display-flex-row manga-pagination">
            {showPaginatePanel.previous ? (
              <div tabIndex={-1} onKeyDown={handleKeydown} ref={ref}>
                <PrevButton previous={changePagePanel} />
              </div>
            ) : (
              <></>
            )}
            {renderPageList()}
            {showPaginatePanel.next ? (
              <div tabIndex={-1} onKeyDown={handleKeydown} ref={ref}>
                <NextButton next={changePagePanel} />
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </>
    );
  };

  function addMangaHistory() {
    const currentHistory = JSON.parse(localStorage.getItem("history"));
    const objHistory = {
      n: mangaName,
      mId: mangaId,
      i: cover,
      c: chapter.split("chapter-")[1],
      cId: chapterId,
    };
    let dataHistory = [];
    if (currentHistory) {
      dataHistory = currentHistory;
      dataHistory.push(objHistory);
      const reverseArr = dataHistory.reverse();
      const unique = dataHistory.filter((obj, index) => {
        const findByName =
          reverseArr.findIndex((mangaItem) => {
            return mangaItem.n === obj.n;
          }) === index;
        return findByName;
      });
      localStorage.setItem("history", JSON.stringify(unique));
    } else {
      dataHistory.push(objHistory);
      localStorage.setItem("history", JSON.stringify(dataHistory));
    }

    console.log(dataHistory);
  }

  return (
    <>
      {(mangaLoading || chaptersLoading) && !manga && !chapters ? (
        <Preloader />
      ) : (
        <div
          className="manga-body"
          tabIndex={-1}
          onKeyDown={handleKeydown}
          ref={ref}
        >
          <BackButton path={`/manga/${mangaId}`} />
          <div className="header">
            <div className="title-chapter">
              <h1 className="text-color-light">CHAPTER - {currentChapter}</h1>
              <h4 className="text-color-darker-light">
                {chapters?.dataChapters?.data?.attributes?.title}
              </h4>
            </div>
            <div className="option-box">
              <div className="display-flex-row">
                <div className="settings-quality">
                  <MoreVertIcon onClick={openQualityMenu} />
                </div>
                <p style={{ color: "white" }}>Change Quality</p>
              </div>
              {renderPaginationManga()}
              {/* <p style={{color: 'white'}}>Select Page</p> */}
              {renderPaginationPanel()}
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
            </div>
          </div>
          <div className="manga-page">{renderImages()}</div>
        </div>
      )}
    </>
  );
};
