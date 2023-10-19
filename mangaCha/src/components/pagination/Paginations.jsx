import React from "react";
import ReactPaginate from "react-paginate";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./pagination.css";
export const Paginations = ({ totalPages, handlePageChange, pageQuery }) => {
  return (
    <div className="div-pagination">
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
        onPageChange={handlePageChange}
        currentPage={pageQuery}
        activeClassName={"item active "}
        breakClassName={"item break-me "}
        breakLabel={"..."}
        containerClassName={"pagination"}
        disabledClassName={"disabled-page"}
        nextClassName={"item next "}
        nextLabel={
          <ArrowForwardIosIcon
            style={{ fontSize: 18, width: 150, color: "orange" }}
          />
        }
        previousClassName={"item previous"}
        previousLabel={
          <ArrowBackIosIcon
            style={{ fontSize: 18, width: 150, color: "orange" }}
          />
        }
        pageClassName={"item pagination-page "}
      />
    </div>
  );
};
