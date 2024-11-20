import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Home.css';  // Make sure your CSS is updated accordingly

const Home = () => {
  return (
    <div className="home-container">
      <Container>
        {/* Header Section */}
        <Row className="header-section text-center mb-5">
          <Col>
            <h1 className="main-title">Welcome to PaisaFi</h1>
            <p className="tagline">Your Trusted Partner for Financial Transactions</p>
          </Col>
        </Row>

        {/* Features Section */}
        <Row className="features-section">
          <Col md={4} className="feature-card">
            <h3 className="feature-title">Secure Transactions</h3>
            <p className="feature-description">
              With top-notch security measures, your transactions are safe and secure with PaisaFi.
            </p>
          </Col>
          <Col md={4} className="feature-card">
            <h3 className="feature-title">Easy Account Management</h3>
            <p className="feature-description">
              Effortlessly manage your account, view balance, and track your spending with a few clicks.
            </p>
          </Col>
          
        </Row>

        {/* Call to Action Section */}
        <Row className="cta-section text-center mt-5">
          <Col>
            <Button variant="primary" size="lg" href="/login" className="cta-button">
              Get Started with PaisaFi
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
