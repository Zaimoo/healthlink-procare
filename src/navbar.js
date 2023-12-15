import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import GlobalFilter from "./components/components2/GlobalFilter";
import { useFilter } from "./FilterContext";
import { IoPersonOutline } from "react-icons/io5";
import { IconContext } from "react-icons";  
import Notifications from "react-notifications-menu";
import checkMark from './components/checkmark-circle-outline.svg';
import { NOTIFICATIONS_STORE_NAME, openDB } from "./indexedDB";

const NavBar = ({userName, user}) => {
    const { globalFilter, setGlobalFilter } = useFilter();
    const [notifications, setNotifications] = useState([]);
  
    useEffect(() => {
        const displayNotifications = async () => {
            const db = await openDB();
            if(user && user.idNumber) {
                const notificationData = await getNotificationsByID(db, user.idNumber);
                notificationData.forEach(notification => {
                    if (notification.image === 'check') {
                        notification.image = checkMark;
                    }
                });

                const notificationsWithCheckmark = notificationData.map(notification => {
                    return {
                      ...notification,
                      image: notification.imageType === 'check' ? checkMark : null,
                    };
                  });

                setNotifications(notificationsWithCheckmark);
            }
            
        }
        displayNotifications();
      }, [user]);


    return (
        <nav className="nav">

            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <div className="profile-section">
                <p>Welcome, {userName} </p> 
                <div className="notification-icon">
                <Notifications data={notifications} />
                </div>
                <IconContext.Provider value={{size: '2em',}}>
                <div className="profile-icon">
                    <IoPersonOutline />
                </div>
                </IconContext.Provider>
            </div>
           

        </nav>
    );
}

async function getNotificationsByID(db, id) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(NOTIFICATIONS_STORE_NAME, 'readonly');
      const objectStore = transaction.objectStore(NOTIFICATIONS_STORE_NAME);
      const idx = objectStore.index('requesterID');
      const cursor = idx.openCursor(id);
  
      let notifications = [];
  
      cursor.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          notifications.push(cursor.value);
          cursor.continue();
        } else {
          resolve(notifications);
        }
  
      };
  
      cursor.onerror = (event) => {
        reject(event.target.error);
      };
  
    });
  }

export default NavBar;