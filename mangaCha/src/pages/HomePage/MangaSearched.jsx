import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMangas } from "../../store/Actions/actionCreator";
import { Paginations } from "../../components/pagination/Paginations";
import { MangaComponent } from "../../components/manga/MangaComponents";
import Preloader from "../../components/Preloaders/Preloader";

export const MangaSearched = () => {
  const location = useLocation();
  const { mangas, mangasLoading } = useSelector((state) => state.mangas);
  const dispatch = useDispatch();
  const searchQuery = new URLSearchParams(location.search).get("search");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMangasPage(currentPage);
  }, [searchQuery, currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(mangas.total / mangas.limit));
  }, [mangas]);

  const fetchMangasPage = (page) => {
    console.log(page, " ini page");
    let offset = (page - 1) * mangas.limit;

    // if (offset > 0 ) {
    //   offset++;
    // }
    dispatch(fetchMangas(searchQuery, offset));
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };
  return (
    <div>
      <div className="background-set bg-dark"></div>
      {mangasLoading ? (
        <Preloader />
      ) : (
        <>
          <div className="manga bg-dark">
            {mangas?.data?.map((manga) => (
              <MangaComponent manga={manga} />
            ))}
          </div>
        </>
      )}
      <Paginations
        className={mangasLoading ? "preloader-paginate" : ""}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};
