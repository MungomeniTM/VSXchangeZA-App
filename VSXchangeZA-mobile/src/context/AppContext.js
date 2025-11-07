// src/context/AppContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [globalUser, setGlobalUser] = useState({
    firstName: '',
    lastName: '',
    profileImage: null,
    userType: 'skilled',
    skills: [],
    skillCategories: []
  });

  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadGlobalData();
  }, []);

  const loadGlobalData = async () => {
    try {
      const [userData, postsData, notificationsData] = await Promise.all([
        AsyncStorage.getItem('globalUserData'),
        AsyncStorage.getItem('globalPosts'),
        AsyncStorage.getItem('globalNotifications')
      ]);

      if (userData) {
        setGlobalUser(JSON.parse(userData));
      }

      if (postsData) {
        setPosts(JSON.parse(postsData));
      }

      if (notificationsData) {
        setNotifications(JSON.parse(notificationsData));
      }
    } catch (error) {
      console.warn('Global data loading failed:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const updateGlobalUser = (userData) => {
    setGlobalUser(prev => {
      const newUser = { ...prev, ...userData };
      AsyncStorage.setItem('globalUserData', JSON.stringify(newUser));
      return newUser;
    });
  };

  const addPost = (post) => {
    const newPost = {
      ...post,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      author: {
        firstName: globalUser.firstName,
        lastName: globalUser.lastName,
        profileImage: globalUser.profileImage,
        userType: globalUser.userType
      },
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    setPosts(prev => {
      const newPosts = [newPost, ...prev];
      AsyncStorage.setItem('globalPosts', JSON.stringify(newPosts));
      return newPosts;
    });
  };

  const addNotification = (notification) => {
    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      AsyncStorage.setItem('globalNotifications', JSON.stringify(newNotifications));
      return newNotifications;
    });
  };

  const value = {
    globalUser,
    updateGlobalUser,
    posts,
    addPost,
    setPosts,
    notifications,
    addNotification,
    isLoaded
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export { AppContext };