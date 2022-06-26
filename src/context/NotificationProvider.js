import React, { useState, createContext } from 'react';

const NotificationContext = createContext({}); 

export const NotificationProvider = ({ children }) => {

  const [ notifications, setNotification ] = useState([]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotification }}>
      { children }
    </NotificationContext.Provider>
  );

};

export default NotificationContext;