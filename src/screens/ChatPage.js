import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { useAuth, useProxyClient } from '../hooks';
import { Spinner, ContactList, ChatContainer } from '../components';

const ChatPage = () => {

  const [ loading, setLoading ] = useState(true);
  const [ content, setContent ] = useState(null);
  const [ userContacts, setUserContacts ] = useState([]);
  const [ currentChat, setCurrentChat ] = useState(null);
  const { authData, logOut } = useAuth();
  const proxyClient = useProxyClient(true);
  const urlQuery = qs.parse(
    location.search.split("").slice(1).join("")
  );  // removes the '?' character at the beggining of the query params

  const getContent = async () => {
    try {
      const { data } = await proxyClient.get('/api/chat');
      if (data) setContent(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getContacts = async () => {
    try {
      const { data } = await proxyClient.get(`/api/contacts/${authData.user.id}`);
      if (data) setUserContacts(data);
    } catch (err) {
      console.log(err);
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

  useEffect(() => {
    if ( urlQuery?.onlyWith ) {
      for ( let contact of userContacts ) {
        if ( urlQuery?.onlyWith === contact.username) {
          setCurrentChat(contact);
          break;
        }
      }
    }
  }, [ userContacts ]);

  return (
    <div className="content bg-primary py-5">
      <Container>
        <Row>
          {urlQuery?.onlyWith ? null : (
            <Col md={3}>
              <Card className="mh-80">
                <Card.Header className="d-flex flex-row justify-content-between">
                  <h4>Contacts</h4>
                  <Nav>
                    <NavDropdown className="user-settings-dropdown" title={authData.user.username} menuVariant="light">
                      <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                      <NavDropdown.Item href="#" onClick={logOut}>Log Out</NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </Card.Header>
                <Card.Body
                  className={`py-0 px-0 overflow-scroll ${loading || userContacts.length === 0 ? 'd-flex flex-direction-column align-items-center' : ''}`}>
                  { loading && <Spinner/> || <ContactList contacts={userContacts} changeChat={handleChatChange}/> }
                </Card.Body>
              </Card>
            </Col>
          )}
          <Col md={urlQuery?.onlyWith ? 12 : 9 }>
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
