import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFavouriteUser } from "../../store/Actions/actionCreator";
import Cookies from "universal-cookie";
import { MangaComponent } from "../../components/manga/MangaComponents";
import { Paginations } from "../../components/pagination/Paginations";
import Preloader from "../../components/Preloaders/Preloader";
const cookies = new Cookies(null, { path: "/" });
import './favourite.css'
export const FavouritePages = () => {
  const dispatch = useDispatch();
  const { favourites, loadingFavourites } = useSelector(
    (state) => state.userFavourites
  );
  const currentCookie = cookies.get("access_token");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (currentCookie) {
      fetchMangasPage(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(favourites.totalData / 10));
  }, [favourites?.mangaList]);

  const fetchMangasPage = (page) => {
    console.log(page, " ini page");
    let offset = (page - 1) * favourites.limit;
    console.log(offset, "offset");
    // if (offset > 0) {
    //   offset++;
    // }
    dispatch(getFavouriteUser(offset));
  };

  const handlePageChange = (selectedPage) => {
    const pages = selectedPage.selected + 1;
    console.log(pages, "pages");
    setCurrentPage(pages);
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
