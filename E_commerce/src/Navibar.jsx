import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./Css/Navibar.css";
import {
  BsFacebook,
  BsFillPersonFill,
  BsInstagram,
  BsTwitterX,
  BsYoutube,
  BsFillBalloonHeartFill,
} from "react-icons/bs";
import { BiSolidShoppingBagAlt } from "react-icons/bi";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const Navibar = () => {
  const navi = useNavigate();
  const location = useLocation();

  const changepage = () => {
    navi("/Shop");
  };

  const isHome = location.pathname === "/" || location.pathname === "/home";
  const linkColorClass = isHome ? "text-white" : "text-dark";

  const isLoggedIn = !!localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      navi("/login");
    }
  };

  return (
    <Navbar
      expand="lg" // 
      
      className={`navbar-on-carousel ${isHome ? "bg-transparent" : "bg-light shadow-sm"}`}
      collapseOnSelect
    >
      <Container fluid>
        {/* Brand Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          className={`d-flex align-items-center ${linkColorClass}`}
        >
          <img
            src="/images/Logo1.png"
            alt="Logo"
            width="130"
            height="70"
            className="d-inline-block align-top ms-3"
          />
        </Navbar.Brand>

        {/* Hamburger icon for small screens */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center me-3 fs-6 gap-lg-3 gap-2">
            <Nav.Link as={Link} to="/" className={linkColorClass}>
              Home
            </Nav.Link>
            <Nav.Link onClick={changepage} className={linkColorClass}>
              Shop
            </Nav.Link>
            <Nav.Link href="#about" className={linkColorClass}>
              About
            </Nav.Link>
            <Nav.Link href="#contact" className={linkColorClass}>
              Contact
            </Nav.Link>

            {/* Social Icons */}
            <div className="d-flex gap-2 flex-wrap justify-content-center">
              <Nav.Link href="#instagram" className={linkColorClass}>
                <BsInstagram />
              </Nav.Link>
              <Nav.Link href="#facebook" className={linkColorClass}>
                <BsFacebook />
              </Nav.Link>
              <Nav.Link href="#youtube" className={linkColorClass}>
                <BsYoutube />
              </Nav.Link>
              <Nav.Link href="#twitter" className={linkColorClass}>
                <BsTwitterX />
              </Nav.Link>
              <Nav.Link as={Link} to="/wishlist" className={linkColorClass}>
                <BsFillBalloonHeartFill />
              </Nav.Link>
            </div>

            {/* Cart */}
            <Nav.Link
              as={Link}
              to="/cart"
              className={linkColorClass}
              style={{ position: "relative" }}
            >
              <BiSolidShoppingBagAlt size={22} />
            </Nav.Link>

            {/* Profile Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle
                as={Nav.Link}
                className={`${linkColorClass} d-flex align-items-center`}
                id="profile-dropdown"
              >
                <BsFillPersonFill size={20} />
                {isLoggedIn && <span className="ms-2">{userName}</span>}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {isLoggedIn ? (
                  <>
                    <Dropdown.Item as={Link} to="/profile">
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item as={Link} to="/register">
                      Register
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/login">
                      Login
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navibar;
