import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Error404Page = () => (
  <div className="content bg-primary py-5">
    <Row>
      <Col md={6} className="mx-auto">
        <Card>
          <Card.Body>
            <div className="d-block">
              <h1>404</h1>
              <p>File not found</p>
              <p><Link to="/login">Click here</Link> to return to home page</p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
);

export default Error404Page;