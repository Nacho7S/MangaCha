import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as Ai from "react-icons/ai";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  openLoginModal,
  closeLoginModal,
  getCurrentUser,
} from "../../store/Actions/actionCreator";
import { useSearchParams, useNavigate } from "react-router-dom";
import OffCanvas from "./OffCanvas";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

export const Navbars = () => {
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const { currentUserData, userLoading } = useSelector(
    (state) => state.currentUser
  );
  const [login, setLogin] = useState(false);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const logoBrand = "/preloader.png";

  // console.log(searchParams.size);
  console.log(currentUserData);

  useEffect(() => {
    const savedSearch = localStorage.getItem("search");
    if (savedSearch) {
      setSearch({ search: savedSearch });
    }
    if (window.location.pathname === "/") {
      localStorage.removeItem("search");
      resetSearch();
    }
    if (cookies.get("access_token")) {
      dispatch(getCurrentUser());
    }
  }, [searchParams, cookies]);

  useEffect(() => {
    if (currentUserData) {
      setLogin(true);
    }
  }, [currentUserData]);

  const onChangeSearch = (e) => {
    const { name, value } = e.target;
    // navigate("/manga/search");
    setSearch({ [name]: value });
    // setSearchParams({ search: value });

    if (value === "") {
      // If the input is cleared, delete the 'search' parameter
      navigate("/");
      localStorage.removeItem("search");
      setSearchParams((params) => {
        params.delete("search");
        return params;
      });
    }
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();

    if (search.search === "") {
      // If search is empty, delete the 'search' parameter
      navigate("/");
      // setSearchParams((params) => {
      //   params.delete("search");
      //   return params;
      // });
    } else {
      // If search is not empty, set the 'search' parameter
      navigate(`/manga/search?search=${search.search}`);
      // setSearchParams({ search: search.search });
      localStorage.setItem("search", search.search);
    }
  };

  const handleOpenLogin = (e) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      navigate("/login");
    } else if (window.location.pathname === "/register") {
      dispatch(closeLoginModal());
    } else {
      dispatch(openLoginModal());
    }
  };

  const handleLogout = () => {
    cookies.remove("access_token")
    setLogin(false)
  }

  const resetSearch = () => {
    setSearch({ ...search, search: "" });
  };

  const handleOffcanvasOpen = () => {
    setShowOffcanvas(true);
  };

  const handleOffcanvasClose = () => {
    setShowOffcanvas(false);
  };

  return (
    <>
      {/* Show the Navbar content on screens larger than lg */}
      <div className="d-none d-lg-block">
        <Navbar bg="dark" data-bs-theme="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#home">
              <img
                alt=""
                src={logoBrand}
                width="auto"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              MangaCha
            </Navbar.Brand>
            <Nav className="me-auto">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
              <NavLink className="nav-link" to="/favourite">
                Favourites
              </NavLink>
              <NavLink className="nav-link" to="/history">
                History
              </NavLink>
            </Nav>
            <Form inline onSubmit={onSubmitSearch}>
              <Row>
                <Col xs="auto">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2 ms-3"
                    aria-label="Search"
                    name="search"
                    value={search.search}
                    onChange={onChangeSearch}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    className="btn btn-dark btn-outline-warning"
                    onClick={onSubmitSearch}
                  >
                    <Ai.AiOutlineSearch />
                  </Button>
                </Col>
              </Row>
            </Form>
            <Nav>
              {!login ? (
                <NavLink onClick={handleOpenLogin} className="nav-link ms-3">
                  Login
                </NavLink>
              ) : (
                <>
                  <img
                    src="/userDefault.png"
                    style={{ width: 50, height: 50, marginLeft: 40, }}
                  />
                  <Nav>
                    <NavDropdown
                      id="nav-dropdown-dark-example"
                      title={currentUserData?.user?.username}
                        menuVariant="dark"
                        className="mt-1"
                    >
                      <NavDropdown.Item href="#action/3.1">
                        Action
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.2">
                        Another action
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.3">
                        Something
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </>
              )}
            </Nav>
          </Container>
        </Navbar>
      </div>

      {/* Show the Offcanvas button and menu on all screens */}
      <Navbar bg="dark" data-bs-theme="dark" className="d-lg-none">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/favicon.ico"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            MangaCha
          </Navbar.Brand>
          <Button variant="outline-light" onClick={handleOffcanvasOpen}>
            <Ai.AiOutlineMenu />
          </Button>
        </Container>
      </Navbar>
      <OffCanvas
        showOffcanvas={showOffcanvas}
        handleOffcanvasClose={handleOffcanvasClose}
        handleOffcanvasOpen={handleOffcanvasOpen}
      />
    </>
  );
};
