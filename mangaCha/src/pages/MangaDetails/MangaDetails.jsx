import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addMangaFavourite, deleteMangaFavourite, fetchMangaDetails, getFavouriteUser } from "../../store/Actions/actionCreator";
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
  const { addedFavourite, deleteFavourite } = useSelector((state) => state.userFavourites);
  const mangaDetails = manga?.mangaDetails?.data;
  const titleDetails = mangaDetails?.attributes?.title.en;
  const slugDetails = titleDetails
    ?.replace(/\?/g, '')
    .split(' ')
    .filter(word => word)
    .join('-');
  const description = mangaDetails?.attributes.description.en;
  const [fav, setFav] = useState(false)
  console.log(manga, mangaLoading);


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
            ) : (<></>)}
          </div>
        </>
      );
    }
  });

  
  useEffect(() => {
    dispatch(fetchMangaDetails(mangaId));
  }, []);

  useEffect(() => {
    if (manga?.isFavorite) {
      setFav(true)
    } else if (!manga.isFavorite){
      setFav(false)
    }
  }, [manga?.isFavorite])

  console.log(fav);

  const renderChapterList = () => {
    const volumes = manga?.chapters?.volumes;
    console.log(manga);

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
                <li onClick={() => navigate(`/manga/${slugDetails}/chapter-${chapter.chapter}/${chapter.id}?mId=${mangaId}`)} className="chapter" key={chapterNumber}>
                  Chapter {chapterNumber}
                </li>
              );
            })}
          </ul>
        </div>
      );
    });
  };

  const handleAddFavourite = () => {
    setFav(true)
    dispatch(addMangaFavourite(mangaId))
    dispatch(getFavouriteUser())
  }

  const handleDeleteFavourite = () => {
    setFav(false)
    dispatch(deleteMangaFavourite(mangaId))
    dispatch(getFavouriteUser())
  }
  console.log(addedFavourite, deleteFavourite);
  const renderFavouriteButtom = () => {
    if (fav) {
      return <button className="btn btn-dark border" onClick={handleDeleteFavourite}>Remove From Favourite</button>
    } else if (!fav) {
      return <button className="btn btn-dark border" onClick={handleAddFavourite}>Add to Favourites</button>
    }
  }
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
                {renderFavouriteButtom()}
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
