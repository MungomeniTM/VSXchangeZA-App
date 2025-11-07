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

  useEffect(() => {
    loadGlobalData();
  }, []);

  const loadGlobalData = async () => {
    try {
      const [userData, postsData] = await Promise.all([
        AsyncStorage.getItem('globalUserData'),
        AsyncStorage.getItem('globalPosts')
      ]);

      if (userData) {
        setGlobalUser(JSON.parse(userData));
      }

      if (postsData) {
        setPosts(JSON.parse(postsData));
      }
    } catch (error) {
      console.warn('Global data loading failed:', error);
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

  return (
    <AppContext.Provider value={{
      globalUser,
      updateGlobalUser,
      posts,
      addPost,
      setPosts,
      notifications,
      addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export { AppContext };