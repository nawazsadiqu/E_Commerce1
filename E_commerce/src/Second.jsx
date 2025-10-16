import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillCreditCard, AiFillTruck } from "react-icons/ai";
import { BsBoxSeam, BsHeart } from "react-icons/bs";


const Second = () => {
  return (
     <div className="features-section bg-light py-5" style={{ borderBottom: "1px solid #000000ff" }}>
      <Container>
        <Row className="text-center">
          <Col md={3} sm={6} className="mb-2 mt-4">
            <AiFillCreditCard size={60}  />
            <h6 className="fw-bold mt-4">Secure Payment</h6>
            <p className="small text-muted">
              Shop confidently with fast and secure payment options.
            </p>
          </Col>

          <Col md={3} sm={6} className="mb-2 mt-4">
             <AiFillTruck size={60} />
            <h6 className="fw-bold mt-4">Free Shipping</h6>
            <p className="small text-muted">
              Get your favorite treats delivered with no extra cost.
            </p>
          </Col>

          <Col md={3} sm={6} className="mb-2 mt-4">
            <BsBoxSeam size={60}/>
            <h6 className="fw-bold mt-4">Delivered with Care</h6>
            <p className="small text-muted">
              Carefully packed and delivered to preserve quality and taste.
            </p>
          </Col>

          <Col md={3} sm={6} className="mb-2 mt-4">
            <BsHeart size={60}/>
            <h6 className="fw-bold mt-4" >Excellent Service</h6>
            <p className="small text-muted">
              We’re here to serve you with a smile and quick assistance.  
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Second