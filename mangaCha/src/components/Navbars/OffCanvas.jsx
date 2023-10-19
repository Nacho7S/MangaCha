import React from 'react'
import { NavLink } from "react-router-dom";
import Offcanvas from "react-bootstrap/Offcanvas";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as Ai from "react-icons/ai";

export default function OffCanvas({showOffcanvas, handleOffcanvasClose}) {
  return (
    <Offcanvas
        show={showOffcanvas}
        onHide={handleOffcanvasClose}
        placement="start"
        className="bg-dark"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-white">
            <Navbar.Brand href="#home">
              <img
                alt=""
                src="/img/logo.svg"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              MangaCha
            </Navbar.Brand>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Form inline>
              <Row>
                <Col xs="auto">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    className="mr-sm-2 ms-3"
                  />
                </Col>
                <Col xs="auto">
                  <Button type="submit">
                    <Ai.AiOutlineSearch />
                  </Button>
                </Col>
              </Row>
            </Form>
            <NavLink className="nav-link" to="/" onClick={handleOffcanvasClose}>
              Home
            </NavLink>
            <NavLink
              className="nav-link"
              to="/favourite"
              onClick={handleOffcanvasClose}
            >
              Favourites
            </NavLink>
            <NavLink
              className="nav-link"
              to="/history"
              onClick={handleOffcanvasClose}
            >
              History
            </NavLink>
            <NavLink className="nav-link" to="" onClick={handleOffcanvasClose}>
              Account
            </NavLink>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
  )
}
