import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useNotificationManager } from '../hooks';

const Notification = ({ index, title, description, type, duration }) => {

  const [ show, setShow ] = useState(true);
  const { notifications } = useNotificationManager();

  const updateNotification = () => {
    setShow(false);
    notifications[index].shown = true;
  };

  useEffect(() => {
    setTimeout(() => {
      updateNotification();
    }, duration);
  }, []);

  return (
    <Alert
      variant={type}
      show={show}
      onClose={updateNotification}
      dismissible>
      <Alert.Heading>
        { title }
      </Alert.Heading>
      <span>{ description }</span>
    </Alert>
  );
};

const NotificationContainer = () => {

  const { notifications } = useNotificationManager();
  const [ totalNotifications, setTotalNotifications ] = useState(notifications.length);

  useEffect(() => {
    if ( notifications.length > 0 && notifications.length > totalNotifications) {
      setTotalNotifications(notifications.length);
    }    
  }, [ notifications.length ]);

  return  (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
      { notifications.map(( notification, i ) => !notification.shown ? (
        <Notification
          key={i}
          index={i}
          title={notification.title}
          description={notification.description}
          type={notification.type}
          duration={notification.duration}/>
      ) : null )}
    </div>
  );
};

export default NotificationContainer;
