import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import _ from 'lodash';
import { io } from 'socket.io-client';
import { useAuth, useProxyClient } from '../hooks';
import { Spinner } from '../components';

const ChatContainer = ({ content, loading, chat }) => {
  
  const isProd = process.env.NODE_ENV === 'production';
  const proxyClient = useProxyClient(true);
  const { authData } = useAuth();
  const [ message, setMessage ] = useState('');
  const [ messages, setMessages ] = useState([
    // { message: "Hi", fromSelf: true },
    // { message: "Hello", fromSelf: false },
    // { message: "How are you?", fromSelf: true },
    // { message: "I'm good, thank you for asking and you?", fromSelf: false },
    // { message: "I'm fine too, what you gonna do today ", fromSelf: true },
    // { message: "I don't know, maybe watch some movies at home or walking in central park", fromSelf: false },
    // { message: "That sounds great", fromSelf: true },
  ]);
  const scrollRef = useRef(null);
  const socket = useRef(null);
  
  const sendMessage = (event) => {
    event.preventDefault();
    socket.current.emit("send-msg", {
      from: authData.user.id,
      to: chat.id,
      message
    });
    proxyClient.post('/api/messages/add', {
      from: authData.user.id,
      to: chat.id,
      message
    });
    setMessages(messages => [ ...messages, { message, fromSelf: true }]);
    setMessage('');
  };

  const getMessages = useCallback(async () => {
    try {
      const { data } = await proxyClient(`/api/messages?from=${authData.user.id}&to=${chat.id}`);
      if ( data ) {
        console.log(data);
        const sortedMessages = _.sortBy(data, message => {
          return new Date(message.sent_at);
        });
        console.log(sortedMessages);
        setMessages(sortedMessages.map(message => ({
          ...message,
          fromSelf: message.author === authData.user.id ? true : false
        })));
      }
    } catch ( err ) {

    }
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ messages ]);

  useEffect(() => {
    getMessages();
  }, [ chat ]);

  useEffect(() => {
    if ( authData ) {
      socket.current = io('https://unergapp-bk.herokuapp.com');
      socket.current.emit("add-user", authData.user.id);
    }
  }, [ authData ]);

  useEffect(() => {
    if ( socket.current ) {
      socket.current.on("msg-recieve", msg => {
        setMessages(messages => [ ...messages, { message: msg, fromSelf: false }]);
      });       
    }
  }, []);

  return !chat?.id && (
    <Card.Body className="d-flex flex-direction-column align-items-center">
      <div className="mx-auto">
        { loading && <Spinner/> || <p>{ content?.msg }</p> }
      </div>
    </Card.Body>
  ) || (
    <>
      <Card.Header>
        <h4 className="text-start">
          {chat?.username}
        </h4>
      </Card.Header>
      <Card.Body className={`overflow-scroll ${ messages.length === 0 ? 'd-flex flex-direction-column align-items-center' : '' }`}>
        {messages.length === 0 && (
          <div className="mx-auto">
            <p>There are no messages yet!!!</p>
          </div>
        ) || messages.map((msg, i) => (
          <div ref={scrollRef} key={i}>
            <div className={`message ${ msg.fromSelf ? "sent" : "received" }`}>
              <div className="msg-content">
                <p>{msg.message}</p>
              </div>
            </div>
          </div>
        ))}
      </Card.Body>
      <Card.Footer>
        <Form onSubmit={sendMessage}>
          <Row>
            <Col md={11} className="px-0">
              <Form.Group className="w-100">
                <Form.Control
                  type="text"
                  placeholder="Type here your message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}/>
              </Form.Group>
            </Col>
            <Col md={1} className="pe-2">
              <Button
                variant="primary"
                type="submit"
                className="float-md-end w-100"
                {...message ? null : { disabled: true } }>
                <i className="fa fa-arrow-right"></i>
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Footer>
    </>
  );
};

export default ChatContainer;
