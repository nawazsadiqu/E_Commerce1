import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BsFacebook, BsInstagram, BsTwitterX, BsYoutube } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="footer bg-white text-dark mt-5 pt-4 pb-3 shadow-sm">
      <Container>
        <Row className="text-center text-md-start">
          {/* Logo / Brand */}
          <Col md={4} className="mb-3">
            <h3 className="fw-bold">Frostelier</h3>
            <p className="small">
              Amaze your tastebuds with our magic. Crafted with love & joy.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-3">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-dark text-decoration-none">Home</a></li>
              <li><a href="#shop" className="text-dark text-decoration-none">Shop</a></li>
              <li><a href="#about" className="text-dark text-decoration-none">About</a></li>
              <li><a href="#contact" className="text-dark text-decoration-none">Contact</a></li>
            </ul>
          </Col>

          {/* Social Media */}
          <Col md={4} className="mb-3">
            <h5 className="fw-bold">Follow Us</h5>
            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <a href="#" className="text-dark fs-5"><BsInstagram /></a>
              <a href="#" className="text-dark fs-5"><BsFacebook /></a>
              <a href="#" className="text-dark fs-5"><BsYoutube /></a>
              <a href="#" className="text-dark fs-5"><BsTwitterX /></a>
            </div>
          </Col>
        </Row>

        <hr />
        <Row>
          <Col className="text-center small">
            © {new Date().getFullYear()} Lickees. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
