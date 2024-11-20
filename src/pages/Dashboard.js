import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Card, Row, Col } from 'react-bootstrap'; // Using React Bootstrap components
import axios from 'axios';  // Make sure axios is imported
import './Dashboard.css'; // Updated styling file

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [balance, setBalance] = useState(0);  // State to hold account balance
  const [status, setStatus] = useState('');  // State to hold account status
  const [loading, setLoading] = useState(true); // For loading state
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      // Fetch user data (including transactions)
      setUserData(storedUser);

      // Fetch the account balance and status from the backend
      axios
        .post(`http://localhost:8080/api/accounts`) // Adjust the endpoint to fetch account details
        .then(response => {
          setBalance(response.data.balance); // Assuming the balance is available in the response
          setStatus(response.data.status);  // Get account status from response
          setUserData(prevData => ({
            ...prevData,
            accountNumber: response.data.accountNumber,  // Also update account number if needed
          }));
          setLoading(false); // Set loading to false once data is fetched
        })
        .catch(err => {
          console.error('Error fetching account details.', err);
          setLoading(false); // Set loading to false in case of error
        });

      // Fetch the user's transactions
      axios
        .get(`http://localhost:8080/api/transactions?userId=${storedUser.id}`)
        .then(response => {
          setUserData(prevData => ({
            ...prevData,
            transactions: response.data,  // Add transactions to the user data
          }));
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching transactions.', err);
          setLoading(false);
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdateBalance = (newBalance) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      // Update user data with the new balance
      const updatedUser = { ...storedUser, balance: newBalance };

      // Update the user state to reflect the new balance immediately
      setBalance(newBalance);
      setUserData(updatedUser);

      // Save the updated user data back to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Optional: If you want to update the balance on the backend, make an API call here
      axios
        .put(`http://localhost:8080/api/accounts/${storedUser.accountId}/balance`, { balance: newBalance })
        .then(response => {
          console.log('Balance updated on the server:', response.data);
        })
        .catch(err => {
          console.error('Error updating balance on the server:', err);
        });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="dashboard-container">
      <Row className="mb-4">
        <Col className="text-center">
          <h1>Welcome, {userData.name}</h1>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2>User Details</h2>
              <div className="account-info">
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Account ID:</strong> {userData.accountNumber}</p>
                <p><strong>City:</strong> {userData.city}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <h3><strong>View your Account Now!:</strong></h3><br/>
              <Button onClick={() => navigate('/account-details')}> Account </Button>
              <br/><p>Note: You should minimum have $200 in your account</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h2>Recent Transactions</h2>
          <Card className="shadow-sm">
            <Card.Body>
              <ul className="transaction-list">
                {userData.transactions && userData.transactions.length > 0 ? (
                  userData.transactions.map((transaction, index) => (
                    <li key={index} className="transaction-item">
                      {transaction.details} - <span className="transaction-amount">${transaction.amount}</span>
                    </li>
                  ))
                ) : (
                  <p>No recent transactions.</p>
                )}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
