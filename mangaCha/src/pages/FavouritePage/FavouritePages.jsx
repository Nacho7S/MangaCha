import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFavouriteUser } from "../../store/Actions/actionCreator";
import Cookies from "universal-cookie";
import { MangaComponent } from "../../components/manga/MangaComponents";
import { Paginations } from "../../components/pagination/Paginations";
import Preloader from "../../components/Preloaders/Preloader";
const cookies = new Cookies(null, { path: "/" });
import './favourite.css'
import { useNavigate } from "react-router-dom";


export const FavouritePages = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { favourites, loadingFavourites } = useSelector(
    (state) => state.userFavourites
  );
  const query = new URLSearchParams(location.search);
  const pageQuery = parseInt(query?.get("page"));
  const currentCookie = cookies.get("access_token");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const sessionMangaFavStorage = JSON.parse(sessionStorage.getItem("%f"))

  useEffect(() => {
    if (pageQuery) {
      fetchMangasPage(pageQuery);
    } else {
      fetchMangasPage(currentPage);
    }
  }, [currentPage,pageQuery]);

  useEffect(() => {
    sessionStorage.setItem("%f", JSON.stringify({l: favourites.limit, t: favourites.totalData}))
    setTotalPages(Math.ceil(sessionMangaFavStorage?.t / sessionMangaFavStorage?.l));
  }, [favourites]);

  const fetchMangasPage = (page) => {
    console.log(page, " ini page");
    let offset = (page - 1) * sessionMangaFavStorage?.l;
    console.log(offset, "offset");
    // if (offset > 0) {
    //   offset++;
    // }
    dispatch(getFavouriteUser(offset));
  };

  const handlePageChange = (selectedPage) => {
    const pages = selectedPage.selected + 1;
    console.log(pages, "pages");
    if (pageQuery) {
      setCurrentPage(pageQuery);
      navigate(`${window.location.pathname}?page=${pageQuery}`);
    }
    if (+pageQuery !== +pages) {
      setCurrentPage(pages);
      navigate(`${window.location.pathname}?page=${pages}`);
    }
  };

  return (
    <>
      <div className="background-set bg-dark">

      </div>
      {currentCookie ? (
        <>
          {loadingFavourites ? (
            <Preloader />
          ) : (
            <div >
              <div className="manga">
                {favourites?.mangaList?.map((manga) => (
                  // <p>{JSON.stringify(manga.data)}</p>
                  <MangaComponent manga={manga.data} />
                ))}
              </div>
            </div>
          )}
          <Paginations
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            pageQuery={pageQuery || currentPage}
          />
        </>
      ) : (
        <>
          {" "}
          <h1>ooppss...</h1>
        </>
      )}
    </>
  );
};
