import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, Navigate, Link } from 'react-router-dom';
import qs from 'qs';
import { useAuth, useNotificationManager } from '../hooks';

const LoginPage = () => {

  const notificationManager = useNotificationManager();
  const { authData, setAuthData, removeAuthData, logIn } = useAuth();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ rememberMe, setRememberMe ] = useState(false);
  const [ redirectTo, setRedirectTo ] = useState('');
  const [ error, setError ] = useState({ hasError: false, msg: null });
  const [ showError, setShowError ] = useState(false);
  const [ submitting, setSubmitting ] = useState(false);
  const location = useLocation();
  const urlQuery = qs.parse(
    location.search.split("").slice(1).join("")
  );  // removes the '?' character at the beggining of the query params

  const handleSubmit = ( event ) => {
    event.preventDefault();
    setSubmitting(true);
    logIn({ username, password, rememberMe }, ( err, response ) => {
      if ( err ) {
        setError({
          hasError: true,
          msg: err.message
        });
        setShowError(true);
        setSubmitting(false);
      } else if ( response?.data?.accessToken ) {
        notificationManager.add('Login successfully', 'Wellcome ' + response?.data?.user?.username, 'success', 3000);
        setAuthData({ accessToken: response.data.accessToken, isAuthenticated: true, user: response.data.user });
      } else {
        setError({
          hasError: response?.data?.error?.hasError,
          msg: response?.data?.error?.msg
        });
        setShowError(true);
        setSubmitting(false);
        removeAuthData();
      }
    });
  };

  useEffect(() => {
    urlQuery.redirectTo && setRedirectTo(urlQuery.redirectTo);

    if ( urlQuery?.auto === 'true' && urlQuery?.as ) {
      logIn({ username: urlQuery.as, password: '123456', rememberMe: false }, ( err, response ) => {
        if ( err ) {
          setError({
            hasError: true,
            msg: err.message
          });
          setShowError(true);
          setSubmitting(false);
        } else if ( response?.data?.accessToken ) {
          notificationManager.add('Login successfully', 'Wellcome ' + response?.data?.user?.username, 'success', 3000);
          setAuthData({ accessToken: response.data.accessToken, isAuthenticated: true, user: response.data.user });
        } else {
          setError({
            hasError: response?.data?.error?.hasError,
            msg: response?.data?.error?.msg
          });
          setShowError(true);
          setSubmitting(false);
          removeAuthData();
        }
      });      
    }
  }, []);

  return authData?.isAuthenticated
    ? <Navigate to={ redirectTo ? redirectTo : "/chat" } state={{ from: location }} replace />
    : urlQuery?.auto
      ? null
      : (
        <div className="content bg-primary py-5">
          <Container>
            <Row>
              <Col md={4} className="mx-auto">
                <Card>
                  <Card.Header className="text-center">
                    Login
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleSubmit}>
                      { error.hasError && (
                        <Alert variant="danger" show={showError} onClose={() => setShowError(false)} dismissible>
                          <p>{error.msg}</p>
                        </Alert>
                      )}
                      <Form.Group className="mb-3 px-5" controlId="username">
                        <Form.Label className="w-100">
                          Username or Email
                          <Form.Control type="text" onChange={e => setUsername(e.target.value)} required/>
                        </Form.Label>
                      </Form.Group>
                      <Form.Group className="mb-3 px-5" controlId="password">
                        <Form.Label className="w-100">
                          Password
                          <Form.Control type="password" onChange={e => setPassword(e.target.value)} required/>
                        </Form.Label>
                      </Form.Group>
                      <Form.Group className="mb-3 px-5">
                        <Form.Check id="remember_me">
                          <Form.Check.Input type="checkbox" className="me-2" style={{ float: 'none' }} checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}/>
                          <Form.Check.Label>Keep me logged</Form.Check.Label>
                        </Form.Check>
                        <Button type="submit" className="d-block mx-auto" variant="primary" {...( submitting || !username || !password ) ? { disabled: true } : null}>
                          { submitting ? 'Submitting' : 'Log in' }
                        </Button>
                        <div className="my-3" style={{ textAlign: 'left' }}>
                          <p>Don't have an account <Link to="/register">create one</Link></p>
                        </div>
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      );
};

export default LoginPage;
