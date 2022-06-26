import React, { useCallback, useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth, useProxyClient } from '../hooks';

const SettingsPage = () => {

  const [ loading, setLoading ] = useState(true);
  const [ content, setContent ] = useState(null);
  const { authData, refreshAuth, logOut } = useAuth();
  const proxyClient = useProxyClient(true);

  const getContent = useCallback(async () => {
    try {
      const { data } = await proxyClient.get('/api/settings');
      if (data) setContent(data);
    } catch (err) {
      // console.log(err);
    }
  });

  const getAuthenticationStatus = useCallback(async () => {
    refreshAuth();
    console.log(authData);
  });

  useEffect(() => {
    getContent();
    setLoading(false);
  }, []);

  return (
    <div className="content bg-primary py-5">
      <Row>
        <Col md={6} className="mx-auto">
          <Card>
            <Card.Body>
              { loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <p>user logged: { authData.user.fullname }</p>
                  <p>{ content?.msg }</p>
                  <p>Click here to go back to <Link to="/chat">Chat page</Link></p>
                  <p>Click here to <Link to="#" onClick={logOut}>LogOut</Link></p>
                  <p>Return to <Link to="/login">Login Page</Link></p>
                  <p>You can laso <Link to="#" onClick={getAuthenticationStatus}>get the authentication status</Link></p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage;
