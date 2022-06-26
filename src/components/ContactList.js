import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import AvatarImage from '../assets/img/avatar.png';

const ContactList = ({ contacts, changeChat }) => {
  return (
    <div className="mx-auto">
      {contacts.length <= 0 ? (
        <div>
          There are no contacts yet!!!
        </div>
      ) : contacts.map((contact, i) => (
        <React.Fragment key={i}>
          { i !== 0 && <hr className="py-0 my-0 border-0 border-bottom"/> || null }
          <Row className="userchat">
            <Col className="px-0 py-0" md={12}>
              <Card
                style={{ borderRadius: 0 }}
                className={`user ${ contact.selected ? 'selected' : '' } d-flex flex-row`}
                onClick={() => changeChat(contact, i)}>
                <div className="avatar">
                  <img width={64} height={64} src={AvatarImage} alt="Avatar Image"/>
                </div> 
                <div>
                  <h5>{ contact.username }</h5>
                </div> 
              </Card>
            </Col>
          </Row>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ContactList;
