import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMangas } from "../../store/Actions/actionCreator";
import "./Home.css";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MangaComponent } from "../../components/manga/MangaComponents";
import { Paginations } from "../../components/pagination/Paginations";
import Preloader from "../../components/Preloaders/Preloader";

export default function HomePages() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const pageQuery = parseInt(query?.get("page"));
  const { mangas, mangasLoading } = useSelector((state) => state.mangas);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sessionMangaStorage = JSON.parse(sessionStorage.getItem("%"))

  // useEffect(() => {
    // if (!pageQuery) {
    //   navigate(`/?page=${currentPage}`)
    // }
  //   if (pageQuery) {
  //     fetchMangasPage(pageQuery);
  //   }
  // }, [currentPage,pageQuery]);

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
  }, [mangas]);

  const fetchMangasPage = (page) => {
    console.log(page, " ini page");
    let offset = (page - 1) * sessionMangaStorage?.l;
    console.log(offset, "offset");
    if (offset === NaN) {
      offset = 0
    }

    dispatch(fetchMangas("", offset ));
  };

  const handlePageChange = (selectedPage) => {
    const pages = selectedPage.selected + 1;
    console.log(pages, "pages");
    if (pageQuery) {
      setCurrentPage(pageQuery);
      navigate(`/?page=${pageQuery}`);
    }
    if (+pageQuery !== +pages) {
      setCurrentPage(pages);
      navigate(`/?page=${pages}`);
    }
  };
  // console.log(mangasLoading);

  return (
    <>
      <div className="background-set bg-dark"></div>
      {mangasLoading ? (
        <Preloader />
      ) : (
        <>
          <div className="manga">
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
      <Outlet />
    </>
  );
}
