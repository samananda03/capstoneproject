import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Alert, DropdownButton, Dropdown, Row, Col } from 'react-bootstrap';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('deposit'); // 'deposit' or 'withdrawal'
  const [details, setDetails] = useState('');
  const [userId, setUserId] = useState(null);
  const [balance, setBalance] = useState(0); // To track user balance
  const [error, setError] = useState(null); // For handling errors
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUserId(storedUser ? storedUser.id : null);

    if (storedUser && storedUser.id) {
      // Fetch user's transactions
      axios
        .get(`http://localhost:8080/api/transactions?userId=${storedUser.id}`)
        .then(response => {
          setTransactions(response.data);
        })
        .catch(err => {
          setError('Error fetching transactions.');
          console.error(err);
        });

      // Fetch user's balance
      axios
        .get(`http://localhost:8080/api/user-balance?userId=${storedUser.id}`)
        .then(response => {
          setBalance(response.data);  // Balance is returned directly as a number
        })
        .catch(err => {
          setError('Error fetching balance.');
          console.error(err);
        });
    }
  }, []);

  const handleTransactionSubmit = (e) => {
    e.preventDefault();

    // Validate amount (for withdrawal, ensure sufficient balance)
    if (type === 'withdrawal' && parseFloat(amount) > balance) {
      setError('Insufficient balance for withdrawal.');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    const transaction = {
      amount: parseFloat(amount),
      type,
      details,
    };

    axios
      .post(`http://localhost:8080/api/add-transaction?userId=${userId}`, transaction)
      .then(response => {
        setTransactions([...transactions, response.data]);
        setBalance(balance + (type === 'deposit' ? parseFloat(amount) : -parseFloat(amount))); // Update balance
        setAmount('');
        setDetails('');
        setSuccessMessage('Transaction successful!');
        setError(null); // Clear error
      })
      .catch(err => {
        setError('Error adding transaction.');
        console.error('Error adding transaction:', err);
      });
  };

  return (
    <Container className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* Transactions Section */}
      <Row className="mb-4">
        {/* Left Side: Recent Transactions and Current Balance */}
        <Col md={7}> <br/>
          <h3>Transaction History</h3>
          <ul>
            {transactions.length ? (
              transactions.map((transaction, index) => (
                <li key={index}>
                  {transaction.details} - ${transaction.amount} ({transaction.type})
                </li>
              ))
            ) : (
              <p>No transactions found.</p>
            )}
          </ul>
        </Col>

        <Col md={5} className="d-flex flex-column align-items-end"><br/>
          <h4>Current Balance: ${balance}</h4>
        </Col>
      </Row>

      {/* Add Transaction Form - Card */}
      <Row>
        <Col md={5} className="mx-auto">
          <Card style={{ width: '100%', padding: '20px' }} className="shadow-lg">
            <Card.Body>
              <h3 className="text-center mb-4">Add a New Transaction</h3>

              {error && <Alert variant="danger" className="text-center">{error}</Alert>}
              {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}

              <Form onSubmit={handleTransactionSubmit}>
                <Form.Group controlId="amount" className="mb-3">
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0.01"
                  />
                </Form.Group>

                <Form.Group controlId="type" className="mb-3">
                  <DropdownButton
                    id="dropdown-basic-button"
                    title={type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    onSelect={(selectedType) => setType(selectedType)}
                    variant="secondary"
                    className="w-100"
                  >
                    <Dropdown.Item eventKey="deposit">Deposit</Dropdown.Item>
                    <Dropdown.Item eventKey="withdrawal">Withdrawal</Dropdown.Item>
                  </DropdownButton>
                </Form.Group>

                <Form.Group controlId="details" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter transaction details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Submit Transaction
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Transactions;
