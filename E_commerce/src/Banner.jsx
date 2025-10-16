import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import './Css/Banner.css';
import { useNavigate } from 'react-router-dom';

const Banner = () => {

    const navi = useNavigate()
      const changepage = () => {
        navi("/Shop")
      }
    
  return (
    <div> 
        <Carousel controls={false} indicators={false} fade interval={4000} className="bg-carousel">
        <Carousel.Item>
          <img className="d-block w-100 carousel-img" src="/images/bg.jpg" alt="Slide 1" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 carousel-img" src="/images/icecream-bg.jpg" alt="Slide 2" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 carousel-img" src="/images/ice-cream-stick-collection.jpg" alt="Slide 3" />
        </Carousel.Item>
      </Carousel>

      <div className="welcome">
        <h5>Welcome to Frostelier.</h5>
        <h1>Amaze your tastebuds <br /> with our <span className="head-highlight">magic</span></h1>
        <button onClick={changepage}>Shop Now</button>
      </div>
</div>
  )
}

export default Banner