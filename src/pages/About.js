import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h2>About Our Bank</h2>
      <p>
        Welcome to FutureBank, where we prioritize customer satisfaction and seamless banking experiences. 
        With cutting-edge technology and dedicated support, we’re here to make your financial journey easy and secure.
      </p>
      <div className="about-images">
        <img src="https://via.placeholder.com/300" alt="Banking Services" />
        <img src="https://via.placeholder.com/300" alt="Customer Support" />
      </div>
    </div>
  );
};

export default About;
