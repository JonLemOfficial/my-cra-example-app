import React, { useCallback } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks';

const UnLoggedPage = () => {
  
  const { authData, refreshAuth } = useAuth();

  const getAuthenticationStatus = useCallback(async () => {
    refreshAuth();
    console.log(authData);
  });

  return (
    <div className="content bg-primary py-5">
      <Row>
        <Col md={6} className="mx-auto">
          <Card>
            <Card.Body>
              <div>
                <p>You need to be logged first to access this path. <Link to="/login">return to Log in Page</Link></p>
                <p>You can laso <Link to="#" onClick={getAuthenticationStatus}>get the authentication status</Link></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const AuthVerifier = () => {

  const { authData }  = useAuth();

  return authData?.isAuthenticated
    ? <Outlet/>
    : <UnLoggedPage/>;
}

export default AuthVerifier; 
