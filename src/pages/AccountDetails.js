import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup, Form, Card, Container, Row, Col } from 'react-bootstrap';

const AccountDetails = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.id) {
      const userId = storedUser.id;
      axios
        .get(`http://localhost:8080/api/accounts/user/${userId}`)
        .then((response) => {
          setAccounts(response.data);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setAccounts([]);
            setError(null);
          } else {
            setError("Error fetching account details.");
          }
          setLoading(false);
        });
    }
  }, []);

  const handleCreateAccount = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser.id;

    const accountNumber = `AC-${Math.floor(Math.random() * 1000000000)}`;
    const accountData = {
      accountNumber: accountNumber,
      balance: 0.0,
      accountType: "Savings",
      status: "Active",
      branch: "Main Branch",
      accountCreationDate: new Date().toISOString(),
      lastTransactionDate: new Date().toISOString(),
      user: { id: userId },
    };
    setCreatingAccount(true);
    axios
      .post('http://localhost:8080/api/accounts', accountData)
      .then((response) => {
        setAccounts([response.data]);
        setCreatingAccount(false);
      })
      .catch((error) => {
        setError("Error creating account.");
        setCreatingAccount(false);
        console.error("Error creating account:", error);
      });
  };

  const handleUpdateAccountBalance = () => {
    if (newBalance && selectedAccountId) {
      axios
        .put(`http://localhost:8080/api/accounts/${selectedAccountId}/balance?newBalance=${newBalance}`)
        .then((response) => {
          setAccounts(accounts.map(account => account.id === selectedAccountId ? response.data : account));
          setError(null);
          setNewBalance('');
          setSelectedAccountId(null);
        })
        .catch((error) => {
          setError("Error updating account balance.");
          console.error("Error updating account balance:", error);
        });
    }
  };

  const handleUpdateAccountStatus = (accountId, newStatus) => {
    const statusData = { status: newStatus };
    axios
      .put(`http://localhost:8080/api/accounts/${accountId}/status`, statusData)
      .then((response) => {
        setAccounts(accounts.map(account => account.id === accountId ? response.data : account));
        setError(null);
      })
      .catch((error) => {
        setError("Error updating account status.");
        console.error("Error updating account status:", error);
      });
  };

  const handleDeleteAccount = (accountId) => {
    axios
      .delete(`http://localhost:8080/api/accounts/${accountId}`)
      .then(() => {
        setAccounts(accounts.filter(account => account.id !== accountId));
        setError(null);
      })
      .catch((error) => {
        setError("Error deleting account.");
        console.error("Error deleting account:", error);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container style={{ padding: '2rem', maxWidth: '1200px' }}>
      <h1 className="text mb-4">Account Details</h1>

      {/* Conditionally render the Create Account button */}
      {accounts.length === 0 && (
        <div className="text-center mb-4">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateAccount}
            disabled={creatingAccount}
            style={{ marginBottom: '1rem' }}
          >
            {creatingAccount ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      )}

      <Row>
        {accounts.length === 0 ? (
          <Col>
            <Card className="text-center" style={{ padding: '2rem' }}>
              <Card.Body>
                <Card.Text>No accounts found for this user.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          accounts.map((account) => (
            <Col key={account.id} md={6} lg={4} className="justify-content-center">
              <Card className="shadow" style={{ width: '100%', minHeight: '350px'}}>
                <Card.Body>
                  <Card.Title className="text-center">{account.accountType} Account</Card.Title>
                  <Card.Text><strong>Account Number:</strong> {account.accountNumber}</Card.Text>
                  <Card.Text><strong>Balance:</strong> ${account.balance}</Card.Text>
                  <Card.Text><strong>Status:</strong> {account.status}</Card.Text>
                  <Card.Text><strong>Branch:</strong> {account.branch}</Card.Text>
                  <Card.Text><strong>Created On:</strong> {new Date(account.accountCreationDate).toLocaleDateString()}</Card.Text>
                  <Card.Text><strong>Last Transaction:</strong> {new Date(account.lastTransactionDate).toLocaleDateString()}</Card.Text>
                  {selectedAccountId === account.id && (
                    <Form.Group className="text-center">
                      <Form.Control
                        type="number"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                        placeholder="Enter new balance"
                        style={{ width: '70%', margin: '10px auto' }}
                      />
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleUpdateAccountBalance}
                      >
                        Update Balance
                      </Button>
                    </Form.Group>
                  )}
                  <div className="text-center mt-3">
                    <ButtonGroup>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => {
                          setSelectedAccountId(account.id);
                          setNewBalance(account.balance);
                        }}
                        style={{ marginRight: '10px' }}
                      >
                        Update Balance
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleUpdateAccountStatus(account.id, 'Frozen')}
                        style={{ marginRight: '10px' }}
                      >
                        Freeze Account
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        Delete Account
                      </Button>

                    </ButtonGroup> <br/> <br/>
                    <Button onClick={() => navigate('/transactions')}>View Transactions</Button>

                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}

      </Row>
    </Container>
  );
};

export default AccountDetails;
