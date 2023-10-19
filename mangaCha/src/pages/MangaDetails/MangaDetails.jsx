import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMangaDetails } from "../../store/Actions/actionCreator";
import { mangaDexImageUrl } from "../../config/url";
import "./MangaDetails.css";
import TwitterIcon from "@mui/icons-material/Twitter";
import Preloader from "../../components/Preloaders/Preloader";
import { BackButton } from "../../components/backButton/BackButton";

export default function MangaDetails() {
  const currentSearch = localStorage.getItem("search") 
  const navigate = useNavigate()
  const { mangaId } = useParams();
  const dispatch = useDispatch();
  const { manga, mangaLoading } = useSelector((state) => state.mangaDetails);
  const mangaDetails = manga?.mangaDetails?.data;
  const titleDetails = mangaDetails?.attributes?.title.en;
  const slugDetails = titleDetails
  ?.replace(/\?/g, '') 
  .split(' ') 
  .filter(word => word) 
  .join('-');
  const description = mangaDetails?.attributes.description.en;

  const authors = mangaDetails?.relationships.map((rel) => {
    if (rel.type === "author") {
      const author = rel.attributes;
      // console.log(author, " authors nich");
      return (
        <>
          <div className="display-flex-row text-color-orange">
            <h5>Author:</h5>
            <h5 className="ms-2">{author?.name}</h5>
          </div>
          <div className="display-flex-row social-media">
            {author?.twitter ? (
            <a className="app-used" href={author?.twitter}>Twitter</a>
            ) : <></>}
            {author?.pixiv ? (
            <a className="app-used" href={author?.pixiv}>Pixiv</a>
            ) : <></>}
            {author?.website ? (
            <a className="app-used" href={author?.website}>Website</a>
            ) : (<></>)}
            {author?.tumblr ? (
            <a className="app-used" href={author?.tumblr}>Tumblr</a>
            ) : (<></>)}
            {author?.youtube ? (
              <a className="app-used" href={author?.youtube}>Youtube</a>
            ): (<></>)}
          </div>
        </>
      );
    }
  });

  useEffect(() => {
    dispatch(fetchMangaDetails(mangaId));
  }, []);

  // console.log(manga);

  const renderChapterList = () => {
    const volumes = manga?.chapters?.volumes;

    if (!volumes) {
      return null;
    }

    return Object.keys(volumes).map((volumeNumber) => {
      const volume = volumes[volumeNumber];
      return (
        <div key={volumeNumber}>
          <h6>Volume {volumeNumber}:</h6>
          <ul>
            {Object.keys(volume.chapters).map((chapterNumber) => {
              const chapter = volume.chapters[chapterNumber];
              return (
                <li onClick={() => navigate(`/manga/${slugDetails}/chapter-${chapter.chapter}/${chapter.id}`) } className="chapter" key={chapterNumber}>
                  Chapter {chapterNumber}
                </li>
              );
            })}
          </ul>
        </div>
      );
    });
  };

  return (
    <>
      {mangaLoading ? (
        <Preloader />
      ) : (
        <>
          <div className="background">
            <img
              src={
                mangaDexImageUrl +
                mangaId +
                "/" +
                mangaDetails?.relationships.find(
                  (rel) => rel.type === "cover_art"
                ).attributes.fileName
              }
              alt="Background"
              className="img-background"
            />
            </div>
            <BackButton path={ currentSearch ? `/manga/search?search=${currentSearch}` : `/`}/>
          <img
            src={
              mangaDexImageUrl +
              mangaId +
              "/" +
              mangaDetails?.relationships.find(
                (rel) => rel.type === "cover_art"
              ).attributes.fileName
            }
            alt="Manga Cover"
            className="img-cover"
          />
          <div className="div-details-left">
            {authors}
          </div>
          <div className="div-details-right text-color-orange">
            <div className="header-title">
              <h4>{titleDetails}</h4>
              <button className="btn btn-dark border">Add to Favourites</button>
            </div>
            <div className="display-flex-row mb-2 tags">
              {mangaDetails?.attributes.tags.map((tag) => (
                <h6 className="tag">{tag.attributes.name.en}</h6>
              ))}
            </div>
            <h6>{description}</h6>
            <h6>Chapters: </h6>
            <div className="chapters-list">
              {renderChapterList()}
            </div>
          </div>
        </>
      )}
    </>
  );
}
