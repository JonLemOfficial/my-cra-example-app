import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth, useProxyClient } from '../hooks';
import { Spinner, ContactList, ChatContainer } from '../components';

const ChatPage = () => {

  const [ loading, setLoading ] = useState(true);
  const [ content, setContent ] = useState(null);
  const [ userContacts, setUserContacts ] = useState([
    // { email: 'mail1@example.com', username: 'user1', selected: false },
    // { email: 'mail2@example.com', username: 'user2', selected: false },
    // { email: 'mail3@example.com', username: 'user3', selected: false },
    // { email: 'mail4@example.com', username: 'user4', selected: false },
    // { email: 'mail5@example.com', username: 'user5', selected: false },
    // { email: 'mail6@example.com', username: 'user6', selected: false },
    // { email: 'mail7@example.com', username: 'user7', selected: false },
    // { email: 'mail8@example.com', username: 'user8', selected: false },
    // { email: 'mail9@example.com', username: 'user9', selected: false },
    // { email: 'mail10@example.com', username: 'user10', selected: false },
    // { email: 'mail11@example.com', username: 'user11', selected: false },
    // { email: 'mail12@example.com', username: 'user12', selected: false },
    // { email: 'mail13@example.com', username: 'user13', selected: false },
    // { email: 'mail14@example.com', username: 'user14', selected: false },
    // { email: 'mail15@example.com', username: 'user15', selected: false }
  ]);
  const [ currentChat, setCurrentChat ] = useState(null);
  const { authData, logOut } = useAuth();
  const proxyClient = useProxyClient(true);

  const getContent = async () => {
    try {
      const { data } = await proxyClient.get('/api/chat');
      if (data) setContent(data);
    } catch (err) {
      // console.log(err);
    }
  };

  const getContacts = async () => {
    try {
      const { data } = await proxyClient.get(`/api/contacts/${authData.user.id}`);
      if (data) setUserContacts(data);
    } catch (err) {
      // console.log(err);
    }
  };

  const handleChatChange = ( contact, index ) => {
    setUserContacts(userContacts.map((contact, i) => ({ ...contact, selected: index === i ? true : false })));
    setCurrentChat(contact);
  };

  useEffect(() => {
    getContent();
    getContacts();
    setLoading(false);
  }, []);

  return (
    <div className="content bg-primary py-5">
      <Container>
        <Row>
          <Col md={3}>
            <Card className="mh-80">
              <Card.Header className="d-flex flex-row justify-content-between">
                <h4>Contacts</h4>
                <Nav>
                  <NavDropdown
                    className="user-settings-dropdown"
                    title={authData.user.username}
                    menuVariant="light">
                    <NavDropdown.Item href="#" onClick={logOut}>
                      Log Out
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Card.Header>
              <Card.Body
                className={`py-0 px-0 overflow-scroll ${loading || userContacts.length === 0 ? 'd-flex flex-direction-column align-items-center' : ''}`}>
                { loading && <Spinner/> || <ContactList contacts={userContacts} changeChat={handleChatChange}/> }
              </Card.Body>
            </Card>
          </Col>
          <Col md={9}>
            <Card className="mh-80">
              <ChatContainer
                loading={loading}
                content={content}
                chat={currentChat}/>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChatPage;
