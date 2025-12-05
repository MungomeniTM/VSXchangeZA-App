 // src/components/VectorIconsShared.js - UNIFIED VECTOR ICONS FOR BOTH SCREENS
import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

const VectorIconsShared = {
  // Bottom Navigation Icons - MATCHING DASHBOARD EXACTLY
  home: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  
  search: (color = '#666', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2"/>
      <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),
  
  add: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M12 8V16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),
  
  chatbubble: (color = '#666', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  
  person: (color = '#666', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  
  marketplace: (color = '#666', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.1 15.9 4.5 17 5.4 17H17M17 17C16.4696 17 15.9609 17.2107 15.5858 17.5858C15.2107 17.9609 15 18.4696 15 19C15 19.5304 15.2107 20.0391 15.5858 20.4142C15.9609 20.7893 16.4696 21 17 21C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19C19 18.4696 18.7893 17.9609 18.4142 17.5858C17.9609 17.2107 17.5304 17 17 17ZM9 19C9 19.5304 8.78929 20.0391 8.41421 20.4142C8.03914 20.7893 7.53043 21 7 21C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19C5 18.4696 5.21071 17.9609 5.58579 17.5858C5.96086 17.2107 6.46957 17 7 17C7.53043 17 8.03914 17.2107 8.41421 17.5858C8.78929 17.9609 9 18.4696 9 19Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  profile: (color = '#666', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  // Dashboard-Specific Icons
  notifications: (color = '#00f0a8', size = 20) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  logOut: (color = '#ff6b6b', size = 20) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16 17L21 12L16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M21 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  sparkles: (color = '#00f0a8', size = 20) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 3V7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M3 5H7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M11 3V7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M9 5H13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M19 3V7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M17 5H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M12 14L10 18L14 20L16 16L20 14L16 12L14 8L12 12L8 14L12 14Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  trendingUp: (color = '#00f0a8', size = 16) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M17 6H23V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  analytics: (color = '#1e90ff', size = 22) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 3V21H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M7 16L10 9L13 13L17 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  people: (color = '#ff6b81', size = 22) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  leaf: (color = '#a55eea', size = 22) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11 20C16 20 20 16 20 11C20 6 16 2 11 2C6 2 2 6 2 11C2 16 6 20 11 20Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M22 2L11 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14 11L19 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  construct: (color = '#fed330', size = 22) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14.7 6.3C14.516 6.48697 14.4142 6.73858 14.4142 7C14.4142 7.26142 14.516 7.51303 14.7 7.7L16.3 9.3C16.486 9.48397 16.7376 9.58579 16.999 9.58579C17.2604 9.58579 17.512 9.48397 17.698 9.3L21.5 5.5C21.5 5.5 22 8 22 12C22 17 18 22 12 22C6 22 2 17 2 12C2 7 6 2 12 2C15 2 17.5 2.5 17.5 2.5L14.7 5.3C14.316 5.684 14.316 6.316 14.7 6.3Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  chatbubbles: (color = '#00d2d3', size = 22) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M17 8V9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M13 8V9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M9 8V9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  // Profile-specific icons
  electrician: (color = '#00f0a8', size = 40) => (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M13 22L20 13L27 22L24 24L25 28L15 28L16 24L13 22Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M20 13V7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M20 31V28" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  farmer: (color = '#4CD964', size = 40) => (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M12 28L15 25L18 28L22 24L25 27L28 24" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M8 16C8 16 10 14 12 16C14 18 16 16 16 16C16 16 18 14 20 16C22 18 24 16 24 16C24 16 26 14 28 16C30 18 32 16 32 16V28C32 28.5304 31.7893 29.0391 31.4142 29.4142C31.0391 29.7893 30.5304 30 30 30H10C9.46957 30 8.96086 29.7893 8.58579 29.4142C8.21071 29.0391 8 28.5304 8 28V16Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M8 20H32" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  client: (color = '#007AFF', size = 40) => (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M28 12H12C10.8954 12 10 12.8954 10 14V26C10 27.1046 10.8954 28 12 28H28C29.1046 28 30 27.1046 30 26V14C30 12.8954 29.1046 12 28 12Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M22 12V10C22 8.89543 21.1046 8 20 8C18.8954 8 18 8.89543 18 10V12" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15 18H25" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M15 22H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  // Common UI Icons
  close: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  refresh: (color = '#00f0a8', size = 18) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M23 4V10H17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M1 20V14H7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M3.51 9C4.01717 7.56678 4.87913 6.2854 6.01547 5.27542C7.1518 4.26543 8.52547 3.55976 10 3.22" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M20.49 15C19.9828 16.4332 19.1209 17.7146 17.9845 18.7246C16.8482 19.7346 15.4745 20.4402 14 20.78" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  bookmark: (color = '#00f0a8', size = 20) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  heart: (color = '#ff375f', size = 20) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.06211 22.0329 6.39464C21.7563 5.72717 21.351 5.12075 20.84 4.61Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  shareSocial: (color = '#666', size = 20) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M8.59 13.51L15.42 17.49" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15.41 6.51L8.59 10.49" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  calendar: (color = '#00f0a8', size = 18) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16 2V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  camera: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  checkmark: (color = '#00f0a8', size = 16) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  chevronBack: (color = '#00f0a8', size = 28) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  chevronForward: (color = '#00f0a8', size = 20) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  create: (color = '#00f0a8', size = 20) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  ellipsisVertical: (color = '#00f0a8', size = 20) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  images: (color = '#666', size = 64) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M21 15L16 10L5 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  star: (color = '#FFD700', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  navigate: (color = '#000', size = 18) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12L21 21L12 3L3 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  trash: (color = '#ff6b6b', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M10 11V17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M14 11V17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  warning: (color = '#ff6b6b', size = 12) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 9V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 17H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  shieldCheckmark: (color = '#000', size = 10) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  checkmarkCircle: (color = '#00f0a8', size = 12) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16 10L10.5 15L8 12.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  informationCircle: (color = '#00f0a8', size = 16) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 16V12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M12 8H12.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  // Create Menu Icons
  documentText: (color = '#00f0a8', size = 22) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16 13H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M10 9H9H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  videocam: (color = '#ff6b81', size = 22) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M23 7L16 12L23 17V7Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14 5H3C2.46957 5 1.96086 5.21071 1.58579 5.58579C1.21071 5.96086 1 6.46957 1 7V17C1 17.5304 1.21071 18.0391 1.58579 18.4142C1.96086 18.7893 2.46957 19 3 19H14C14.5304 19 15.0391 18.7893 15.4142 18.4142C15.7893 18.0391 16 17.5304 16 17V7C16 6.46957 15.7893 5.96086 15.4142 5.58579C15.0391 5.21071 14.5304 5 14 5Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  megaphone: (color = '#a55eea', size = 22) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 11L22 4V20L3 13V11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M11 13.5V18.5C11 19.163 10.7366 19.7989 10.2678 20.2678C9.79893 20.7366 9.16304 21 8.5 21C7.83696 21 7.20107 20.7366 6.73223 20.2678C6.26339 19.7989 6 19.163 6 18.5C6 17.837 6.26339 17.2011 6.73223 16.7322C7.20107 16.2634 7.83696 16 8.5 16C9.16304 16 9.79893 16.2634 10.2678 16.7322C10.7366 17.2011 11 17.837 11 18.5" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  helpCircle: (color = '#fed330', size = 22) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 17H12.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  // Navigation icons with outline versions
  homeOutline: (color = '#666', size = 24) => VectorIconsShared.home(color, size),
  searchOutline: (color = '#666', size = 24) => VectorIconsShared.search(color, size),
  addOutline: (color = '#666', size = 24) => VectorIconsShared.add(color, size),
  chatbubbleOutline: (color = '#666', size = 24) => VectorIconsShared.chatbubble(color, size),
  personOutline: (color = '#666', size = 24) => VectorIconsShared.person(color, size),
};

export default VectorIconsShared;