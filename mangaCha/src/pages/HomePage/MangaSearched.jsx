import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMangas } from "../../store/Actions/actionCreator";
import { Paginations } from "../../components/pagination/Paginations";
import { MangaComponent } from "../../components/manga/MangaComponents";
import Preloader from "../../components/Preloaders/Preloader";

export const MangaSearched = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const { mangas, mangasLoading } = useSelector((state) => state.mangas);
  const dispatch = useDispatch();
  const query = new URLSearchParams(location.search);
  const searchQuery = query.get("search")
  const pageQuery = parseInt(query?.get("page"));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sessionMangaStorage = JSON.parse(sessionStorage.getItem("%"))

  useEffect(() => {
    if (pageQuery) {
      fetchMangasPage(pageQuery);
    } else {
      fetchMangasPage(currentPage);
    }
  }, [currentPage, pageQuery]);

  useEffect(() => {
    sessionStorage.setItem("%", JSON.stringify({ l: mangas.limit , t: mangas.total}))
    setTotalPages(Math.ceil(sessionMangaStorage?.t / sessionMangaStorage?.l));
    // console.log(window.location.pathname)
  }, [mangas]);

  const fetchMangasPage = (page) => {
    console.log(page, " ini page");
    let offset = (page - 1) * sessionMangaStorage?.l;
    console.log(offset, "offset");
    if (offset === NaN) {
      offset = 0
    }

    // if (offset > 0 ) {
    //   offset++;
    // }
    dispatch(fetchMangas(searchQuery, offset));
  };

  const handlePageChange = (selectedPage) => {
    const pages = selectedPage.selected + 1;
    console.log(pages, "pages");
    if (pageQuery) {
      setCurrentPage(pageQuery);
      navigate(`${window.location.pathname}?search=${searchQuery}&page=${pageQuery}`);
    }
    if (+pageQuery !== +pages) {
      setCurrentPage(pages);
      navigate(`${window.location.pathname}?search=${searchQuery}&page=${pages}`);
    }
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
          <Paginations
            className={mangasLoading ? "preloader-paginate" : ""}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            pageQuery={pageQuery || currentPage}
          />
        </>
      )}
    </div>
  );
};
