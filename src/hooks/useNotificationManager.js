import { useContext } from 'react';
import { NotificationContext } from '../context';

function useNotificationManager() {
  
  const { notifications, setNotification } = useContext(NotificationContext);

  const add = ( title, description, type, duration, options = {} ) => {
    setNotification( notifications => {
      return [
        ...notifications,
        { title, description, type, duration, shown: false, options }
      ];
    })
  };

  return {
    notifications,
    add
  };
}

export default useNotificationManager;
