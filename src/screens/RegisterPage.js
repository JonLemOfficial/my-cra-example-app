import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import qs from 'qs';
import { useAuth, useNotificationManager } from '../hooks';

const RegisterPage = () => {

  const notificationManager = useNotificationManager();
  const { authData, register } = useAuth();
  const [ fullname, setFullname ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ repeatPassword, setRepeatPassword ] = useState('');
  const [ redirectTo, setRedirectTo ] = useState('');
  const [ error, setError ] = useState({ hasError: false, msg: null });
  const [ showError, setShowError ] = useState(false);
  const [ submitting, setSubmitting ] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = ( event ) => {
    event.preventDefault();
    setSubmitting(true);
    if ( password === repeatPassword ) {
      register({ fullname, username, email, password }, ( err, response ) => {
        if ( err ) {
          setError({
            hasError: true,
            msg: err.message
          });
          setShowError(true);
          setSubmitting(false);
        } else if ( response?.data?.newUser ) {
          notificationManager.add('Registry successfully', 'You can access now to the app', 'success', 3000);
          navigate('/login', {
            replace: true,
            state: {
              from: location
            }
          });
        } else {
          setError({
            hasError: response?.data?.error?.hasError,
            msg: response?.data?.error?.msg
          });
          setShowError(true);
          setSubmitting(false);
        }
      });
    } else {
      setError({
        hasError: true,
        msg: 'Passwords should be equals'
      });
      setShowError(true);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const urlQuery = qs.parse(
      location.search.split("").slice(1).join("")
    );  // removes the '?' character at the beggining of the query params
    urlQuery.redirectTo && setRedirectTo(urlQuery.redirectTo); 
  }, []);

  return authData?.isAuthenticated ? <Navigate to={ redirectTo ? redirectTo : "/dashboard" } state={{ from: location }} replace /> : (
    <div className="content bg-primary py-5">
      <Container>
        <Row>
          <Col md={4} className="mx-auto">
            <Card>
              <Card.Header className="text-center">
                Register
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  { error.hasError && (
                    <Alert variant="danger" show={showError} onClose={() => setShowError(false)} dismissible>
                      <p>{error.msg}</p>
                    </Alert>
                  )}
                  <Form.Group className="mb-3 px-5" controlId="fullname">
                    <Form.Label className="w-100">
                      Fullname
                      <Form.Control type="text" placeholder="ej: Jhon Doe" onChange={e => setFullname(e.target.value)} required/>
                    </Form.Label>
                  </Form.Group>
                  <Form.Group className="mb-3 px-5" controlId="username">
                    <Form.Label className="w-100">
                      Username
                      <Form.Control type="text" placeholder="jon123" onChange={e => setUsername(e.target.value)} required/>
                    </Form.Label>
                  </Form.Group>
                  <Form.Group className="mb-3 px-5" controlId="email">
                    <Form.Label className="w-100">
                      Email
                      <Form.Control type="text" placeholder="user@domain.com" onChange={e => setEmail(e.target.value)} required/>
                    </Form.Label>
                  </Form.Group>
                  <Form.Group className="mb-3 px-5" controlId="password">
                    <Form.Label className="w-100">
                      Password
                      <Form.Control type="password" onChange={e => setPassword(e.target.value)} required/>
                    </Form.Label>
                  </Form.Group>
                  <Form.Group className="mb-3 px-5" controlId="repeatPassword">
                    <Form.Label className="w-100">
                      Repeat Password
                      <Form.Control type="password" onChange={e => setRepeatPassword(e.target.value)} required/>
                    </Form.Label>
                  </Form.Group>
                  <Form.Group className="mb-3 px-5">
                    <Button type="submit" className="d-block mx-auto" variant="primary" {...( submitting || !fullname || !username || !email || !password || !repeatPassword ) ? { disabled: true } : null}>
                      { submitting ? 'Submitting' : 'Sign Up' }
                    </Button>
                    <div className="my-3" style={{ textAlign: 'left' }}>
                      <p>Already have an account <Link to="/login">Log in</Link></p>
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

export default RegisterPage;
