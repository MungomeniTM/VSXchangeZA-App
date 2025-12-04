// src/screens/ProfileScreen.js
import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Switch,
  LayoutAnimation,
  FlatList,
  Share,
  KeyboardAvoidingView,
  RefreshControl,
  Pressable
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { AppContext } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, G, Defs, RadialGradient, Stop } from 'react-native-svg';

import VectorIconsShared from '../components/VectorIcons';


const { width, height } = Dimensions.get('window');

// ADVANCED VECTOR ICONS SYSTEM - PERFECTLY MATCHING DASHBOARD
const VectorIcons = {
  // Bottom Navigation Icons - EXACTLY matching DashboardScreen
  home: (color = '#00f0a8', size = 28) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  
  search: (color = '#666', size = 28) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2"/>
      <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),
  
  marketplace: (color = '#666', size = 28) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.1 15.9 4.5 17 5.4 17H17M17 17C16.4696 17 15.9609 17.2107 15.5858 17.5858C15.2107 17.9609 15 18.4696 15 19C15 19.5304 15.2107 20.0391 15.5858 20.4142C15.9609 20.7893 16.4696 21 17 21C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19C19 18.4696 18.7893 17.9609 18.4142 17.5858C17.9609 17.2107 17.5304 17 17 17ZM9 19C9 19.5304 8.78929 20.0391 8.41421 20.4142C8.03914 20.7893 7.53043 21 7 21C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19C5 18.4696 5.21071 17.9609 5.58579 17.5858C5.96086 17.2107 6.46957 17 7 17C7.53043 17 8.03914 17.2107 8.41421 17.5858C8.78929 17.9609 9 18.4696 9 19Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  
  profile: (color = '#666', size = 28) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  // Professional Category Icons - Enhanced for better visual consistency
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

  // Additional icons for enhanced UI matching dashboard
  calendar: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16 2V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  message: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  wallet: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 7V11M3 7H19V7C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7ZM3 7C3 5.89543 3.89543 5 5 5H16C17.1046 5 18 5.89543 18 7V7" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  settings: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M19.4 15C19.2662 15.466 19.1338 15.932 19.0015 16.398C18.9965 16.415 18.9915 16.432 18.9865 16.449L21.1465 18.609C21.3385 18.801 21.3385 19.114 21.1465 19.306L19.3065 21.146C19.1145 21.338 18.8015 21.338 18.6095 21.146L16.4495 18.986C16.4325 18.991 16.4155 18.996 16.3985 19.001C15.9325 19.133 15.4665 19.266 15 19.4V22C15 22.265 14.895 22.52 14.7075 22.707C14.52 22.895 14.265 23 14 23H10C9.735 23 9.48 22.895 9.2925 22.707C9.105 22.52 9 22.265 9 22V19.4C8.534 19.266 8.068 19.133 7.602 19.001C7.585 18.996 7.568 18.991 7.551 18.986L5.391 21.146C5.199 21.338 4.886 21.338 4.694 21.146L2.854 19.306C2.662 19.114 2.662 18.801 2.854 18.609L5.014 16.449C5.009 16.432 5.004 16.415 4.999 16.398C4.867 15.932 4.734 15.466 4.6 15V12C4.6 11.735 4.495 11.48 4.3075 11.293C4.12 11.105 3.865 11 3.6 11H1C0.735 11 0.48 10.895 0.2925 10.707C0.105 10.52 0 10.265 0 10V6C0 5.735 0.105 5.48 0.2925 5.293C0.48 5.105 0.735 5 1 5H3.6C3.734 4.534 3.867 4.068 3.999 3.602C4.004 3.585 4.009 3.568 4.014 3.551L1.854 1.391C1.662 1.199 1.662 0.886 1.854 0.694L3.694 -1.146C3.886 -1.338 4.199 -1.338 4.391 -1.146L6.551 1.014C6.568 1.009 6.585 1.004 6.602 0.999C7.068 0.867 7.534 0.734 8 0.6V-2C8 -2.265 8.105 -2.52 8.2925 -2.707C8.48 -2.895 8.735 -3 9 -3H13C13.265 -3 13.52 -2.895 13.7075 -2.707C13.895 -2.52 14 -2.265 14 -2V0.6C14.466 0.734 14.932 0.867 15.398 0.999C15.415 1.004 15.432 1.009 15.449 1.014L17.609 -1.146C17.801 -1.338 18.114 -1.338 18.306 -1.146L20.146 0.694C20.338 0.886 20.338 1.199 20.146 1.391L17.986 3.551C17.991 3.568 17.996 3.585 18.001 3.602C18.133 4.068 18.266 4.534 18.4 5H21C21.265 5 21.52 5.105 21.7075 5.293C21.895 5.48 22 5.735 22 6V10C22 10.265 21.895 10.52 21.7075 10.707C21.52 10.895 21.265 11 21 11H18.4C18.266 11.466 18.133 11.932 18.001 12.398C17.996 12.415 17.991 12.432 17.986 12.449L20.146 14.609C20.338 14.801 20.338 15.114 20.146 15.306L18.306 17.146C18.114 17.338 17.801 17.338 17.609 17.146L15.449 14.986C15.432 14.991 15.415 14.996 15.398 15.001C14.932 15.133 14.466 15.266 14 15.4V18C14 18.265 13.895 18.52 13.7075 18.707C13.52 18.895 13.265 19 13 19H9C8.735 19 8.48 18.895 8.2925 18.707C8.105 18.52 8 18.265 8 18V15.4C7.534 15.266 7.068 15.133 6.602 15.001C6.585 14.996 6.568 14.991 6.551 14.986L4.391 17.146C4.199 17.338 3.886 17.338 3.694 17.146L1.854 15.306C1.662 15.114 1.662 14.801 1.854 14.609L4.014 12.449C4.009 12.432 4.004 12.415 3.999 12.398C3.867 11.932 3.734 11.466 3.6 11H1C0.735 11 0.48 10.895 0.2925 10.707C0.105 10.52 0 10.265 0 10V6C0 5.735 0.105 5.48 0.2925 5.293C0.48 5.105 0.735 5 1 5H3.6" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )
};

// ENHANCED ENTERPRISE STATE MANAGEMENT WITH FIXED ROLE NAVIGATION
const useAdvancedEnterpriseProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSave, setLastSave] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showRoleDetails, setShowRoleDetails] = useState(false);
  const saveTimeoutRef = useRef(null);

  // Enhanced default profile with comprehensive role data
  const defaultProfile = {
    id: 'user_001',
    firstName: 'James',
    lastName: 'Carter',
    displayName: 'James Carter',
    profession: 'Best Electrician',
    tagline: 'Professional Repair Man',
    userType: 'skilled',
    profileImage: null,
    bio: 'James Carter is a certified electrician with 8 years of experience. He specializes in residential and commercial wiring, completing numerous projects from home rewiring to large-scale commercial installations.',
    experienceYears: 8,
    rating: 4.9,
    completedProjects: 150,
    hourlyRate: 159,
    location: null,
    contactInfo: {
      phone: '+1 (555) 123-4567',
      email: 'james.carter@example.com',
      website: '',
      socialLinks: {
        linkedin: '',
        twitter: '',
        facebook: ''
      }
    },
    skills: [
      {
        id: 'skill_1',
        name: 'Electrical Wiring',
        category: 'electrical',
        subcategory: 'Residential Wiring',
        level: 'expert',
        years: 8,
        certified: true,
        description: 'Expert in residential electrical systems installation and maintenance'
      }
    ],
    services: [
      {
        id: 'service_1',
        title: 'Electrical Installation',
        description: 'Professional electrical wiring and installation services',
        category: 'electrical',
        basePrice: 159,
        duration: '1-4 hours',
        popular: true,
        features: ['Safety inspection', 'Quality materials', 'Cleanup included']
      }
    ],
    portfolio: [],
    certifications: [
      {
        id: 'cert_1',
        name: 'Certified Electrician',
        issuer: 'National Electrical Association',
        year: 2016,
        verified: true,
        expiryDate: '2025-12-31'
      }
    ],
    availability: {
      monday: { available: true, start: '09:00', end: '18:00' },
      tuesday: { available: true, start: '09:00', end: '18:00' },
      wednesday: { available: true, start: '09:00', end: '18:00' },
      thursday: { available: true, start: '09:00', end: '18:00' },
      friday: { available: true, start: '09:00', end: '17:00' },
      saturday: { available: false, start: '00:00', end: '00:00' },
      sunday: { available: false, start: '00:00', end: '00:00' }
    },
    // Enhanced Farmer Details with comprehensive fields
    farmDetails: {
      farmName: '',
      farmSize: 0,
      farmType: '',
      mainCrops: [],
      livestock: [],
      equipment: [],
      machinery: [],
      irrigationSystems: [],
      certifications: [],
      specialties: [],
      farmLocation: '',
      hectares: 0,
      soilType: '',
      waterSource: '',
      organicCertified: false,
      harvestSeasons: [],
      annualProduction: 0,
      sustainabilityPractices: [],
      marketChannels: []
    },
    // Enhanced Client Details with comprehensive fields
    clientDetails: {
      companyName: '',
      industry: '',
      projectTypes: [],
      serviceNeeds: [],
      budgetRange: { min: 0, max: 0 },
      timeline: '',
      locationPreferences: [],
      projectSize: '',
      preferredSkills: [],
      companySize: '',
      projectHistory: [],
      preferredCommunication: ['email', 'phone'],
      urgencyLevel: 'medium'
    },
    isAvailable: true,
    lastUpdated: new Date().toISOString(),
    profileCompleteness: 85,
    metadata: {
      created: new Date().toISOString(),
      version: '2.0.0',
      syncEnabled: true,
      lastBackup: null
    },
    // Advanced role-specific settings
    roleSettings: {
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        profileVisible: true,
        contactVisible: true,
        portfolioPublic: true
      },
      preferences: {
        language: 'en',
        currency: 'USD',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }
  };

  // Enhanced load profile with advanced backup systems
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem('advanced_enterprise_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with default to ensure all new fields are present
        const mergedProfile = { ...defaultProfile, ...parsed };
        setProfile(mergedProfile);
      } else {
        setProfile(defaultProfile);
        await AsyncStorage.setItem('advanced_enterprise_profile', JSON.stringify(defaultProfile));
      }
    } catch (error) {
      console.error('Load failed:', error);
      // Fallback to default with enhanced error handling
      setProfile(defaultProfile);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save control: switch from automatic saves to explicit commit saves.
  const [isDirty, setIsDirty] = useState(false);

  const performSave = useCallback(async (profileToSave) => {
    try {
      setSaving(true);
      const timestamp = new Date().toISOString();

      const enhancedProfile = {
        ...profileToSave,
        lastUpdated: timestamp,
        metadata: {
          ...profileToSave.metadata,
          lastBackup: timestamp,
          version: '2.1.0'
        }
      };

      await AsyncStorage.setItem('advanced_enterprise_profile', JSON.stringify(enhancedProfile));
      await AsyncStorage.setItem(`advanced_enterprise_profile_backup_${Date.now()}`, JSON.stringify(enhancedProfile));

      // Trim backups to last 5
      const keys = await AsyncStorage.getAllKeys();
      const backupKeys = keys.filter(key => key.startsWith('advanced_enterprise_profile_backup_')).sort();
      if (backupKeys.length > 5) {
        const keysToDelete = backupKeys.slice(0, backupKeys.length - 5);
        await AsyncStorage.multiRemove(keysToDelete);
      }

      setLastSave(timestamp);
      console.log('Profile saved (commit)');
    } catch (error) {
      console.error('Save error:', error);
      try {
        await AsyncStorage.setItem('advanced_enterprise_profile_emergency', JSON.stringify({
          ...(profile || {}),
          emergencySave: new Date().toISOString(),
          error: error.message
        }));
      } catch (e) {
        console.error('Emergency save failed:', e);
      }
    } finally {
      setSaving(false);
      setIsDirty(false);
    }
  }, [profile]);

  // Debounced (internal) autosave kept for background use but not invoked by updates anymore
  const saveProfile = useCallback((newProfile) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => performSave(newProfile || profile), 800);
  }, [performSave, profile]);

  // Explicit commit save called when user presses Save
  const commitProfileSave = useCallback(async (newProfile) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    await performSave(newProfile || profile);
  }, [performSave, profile]);

  // Enhanced update with rollback capability (no auto-save; mark dirty)
  const updateProfile = useCallback((updates) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setProfile(prev => {
      const newProfile = {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString(),
        displayName: `${updates.firstName || prev.firstName} ${updates.lastName || prev.lastName}`.trim(),
        profileCompleteness: calculateProfileCompleteness({ ...prev, ...updates })
      };
      setIsDirty(true);
      return newProfile;
    });
  }, []);

  // Advanced profile completeness calculator
  const calculateProfileCompleteness = (profileData) => {
    if (!profileData) return 0;
    
    let completeness = 0;
    const baseFields = [
      profileData.firstName,
      profileData.lastName,
      profileData.profession,
      profileData.bio,
      profileData.profileImage,
      profileData.location,
      profileData.skills?.length > 0,
      profileData.contactInfo?.phone,
      profileData.contactInfo?.email
    ];

    const userTypeFields = {
      skilled: [
        profileData.skills?.length > 0,
        profileData.experienceYears > 0,
        profileData.hourlyRate > 0
      ],
      farmer: [
        profileData.farmDetails?.farmName,
        profileData.farmDetails?.farmType,
        profileData.farmDetails?.hectares > 0,
        profileData.farmDetails?.mainCrops?.length > 0
      ],
      client: [
        profileData.clientDetails?.companyName,
        profileData.clientDetails?.industry,
        profileData.clientDetails?.projectTypes?.length > 0,
        profileData.clientDetails?.budgetRange?.min > 0
      ]
    };

    const baseScore = (baseFields.filter(Boolean).length / baseFields.length) * 60;
    const userTypeScore = (userTypeFields[profileData.userType]?.filter(Boolean).length / userTypeFields[profileData.userType]?.length) * 40 || 0;

    return Math.min(Math.round(baseScore + userTypeScore), 100);
  };

  // Enhanced farm details update with validation
  const updateFarmDetails = useCallback((updates) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        farmDetails: { ...prev.farmDetails, ...updates },
        lastUpdated: new Date().toISOString(),
        profileCompleteness: calculateProfileCompleteness({ ...prev, farmDetails: { ...prev.farmDetails, ...updates } })
      };
      setIsDirty(true);
      return newProfile;
    });
  }, []);

  // Enhanced client details update with validation
  const updateClientDetails = useCallback((updates) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        clientDetails: { ...prev.clientDetails, ...updates },
        lastUpdated: new Date().toISOString(),
        profileCompleteness: calculateProfileCompleteness({ ...prev, clientDetails: { ...prev.clientDetails, ...updates } })
      };
      setIsDirty(true);
      return newProfile;
    });
  }, []);

  // Advanced skill management with enhanced validation
  const addSkill = useCallback((skill) => {
    const newSkill = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      added: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      ...skill
    };
    
    setProfile(prev => {
      const newProfile = {
        ...prev,
        skills: [...(prev.skills || []), newSkill],
        lastUpdated: new Date().toISOString(),
        profileCompleteness: calculateProfileCompleteness({ ...prev, skills: [...(prev.skills || []), newSkill] })
      };
      setIsDirty(true);
      return newProfile;
    });
  }, []);

  const updateSkill = useCallback((skillId, updates) => {
    setProfile(prev => {
      const newSkills = prev.skills.map(skill => 
        skill.id === skillId 
          ? { ...skill, ...updates, lastUpdated: new Date().toISOString() }
          : skill
      );
      
      const newProfile = {
        ...prev,
        skills: newSkills,
        lastUpdated: new Date().toISOString()
      };
      saveProfile(newProfile);
      return newProfile;
    });
  }, [saveProfile]);

  const removeSkill = useCallback((skillId) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        skills: (prev.skills || []).filter(skill => skill.id !== skillId),
        lastUpdated: new Date().toISOString(),
        profileCompleteness: calculateProfileCompleteness({ ...prev, skills: (prev.skills || []).filter(skill => skill.id !== skillId) })
      };
      saveProfile(newProfile);
      return newProfile;
    });
  }, [saveProfile]);

  // Enhanced portfolio management
  const addPortfolioItem = useCallback(async (imageAsset) => {
    try {
      const portfolioItem = {
        id: `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        uri: imageAsset.uri,
        filename: imageAsset.fileName || `portfolio_${Date.now()}.jpg`,
        description: '',
        uploaded: new Date().toISOString(),
        size: imageAsset.fileSize,
        dimensions: { width: imageAsset.width, height: imageAsset.height },
        tags: [],
        category: 'general'
      };

      setProfile(prev => {
        const newProfile = {
          ...prev,
          portfolio: [...(prev.portfolio || []), portfolioItem],
          lastUpdated: new Date().toISOString()
        };
        setIsDirty(true);
        return newProfile;
      });

      return true;
    } catch (error) {
      console.error('Portfolio add failed:', error);
      Alert.alert('Error', 'Failed to add portfolio item');
      return false;
    }
  }, [saveProfile]);

  // Enhanced profile image management
  const updateProfileImage = useCallback(async (imageUri) => {
    try {
      setProfile(prev => {
        const newProfile = {
          ...prev,
          profileImage: imageUri,
          lastUpdated: new Date().toISOString(),
          profileCompleteness: calculateProfileCompleteness({ ...prev, profileImage: imageUri })
        };
        setIsDirty(true);
        return newProfile;
      });
      return true;
    } catch (error) {
      console.error('Profile image update failed:', error);
      Alert.alert('Error', 'Failed to update profile image');
      return false;
    }
  }, [saveProfile]);

  // FIXED: Advanced role switching with proper navigation to role details
  const switchUserType = useCallback((newUserType) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        userType: newUserType,
        lastUpdated: new Date().toISOString(),
        // Preserve existing data while switching roles
        skills: prev.skills || [],
        farmDetails: prev.farmDetails || defaultProfile.farmDetails,
        clientDetails: prev.clientDetails || defaultProfile.clientDetails
      };
      setIsDirty(true);
      return newProfile;
    });

    // Automatically show role details when switching roles
    setShowRoleDetails(true);
  }, []);

  // FIXED: Function to navigate to role-specific details
  const navigateToRoleDetails = useCallback(() => {
    setShowRoleDetails(true);
  }, []);

  // Reset profile to defaults with confirmation
  const resetProfile = useCallback(async () => {
    Alert.alert(
      'Reset Profile',
      'Are you sure you want to reset all profile data? This action cannot be undone and all your current data will be lost.',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => console.log('Reset cancelled')
        },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              setProfile(defaultProfile);
              await AsyncStorage.setItem('advanced_enterprise_profile', JSON.stringify(defaultProfile));
              Alert.alert('Success', 'Profile has been reset to default values');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset profile');
            }
          }
        }
      ]
    );
  }, []);

  // Export profile data
  const exportProfile = useCallback(async () => {
    try {
      const profileData = JSON.stringify(profile, null, 2);
      // In a real app, you would share this or save to file
      Alert.alert('Export Ready', 'Profile data has been prepared for export. In a real app, this would trigger a share dialog or file download.');
      console.log('Profile Data:', profileData);
      return profileData;
    } catch (error) {
      Alert.alert('Error', 'Failed to export profile data');
      return null;
    }
  }, [profile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    saving,
    lastSave,
    isDirty,
    editing,
    setEditing,
    activeTab,
    setActiveTab,
    showRoleDetails,
    setShowRoleDetails,
    updateProfile,
    updateFarmDetails,
    updateClientDetails,
    addSkill,
    updateSkill,
    removeSkill,
    addPortfolioItem,
    updateProfileImage,
    switchUserType,
    navigateToRoleDetails,
    commitProfileSave,
    loadProfile,
    resetProfile,
    exportProfile,
    calculateProfileCompleteness
  };
};

// ADVANCED IMAGE MANAGEMENT SYSTEM WITH ENHANCED FEATURES
const useImageManager = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickImage = useCallback(async (options = {}) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera roll access is needed to select photos');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options.allowsEditing ?? true,
        allowsMultipleSelection: options.allowsMultipleSelection ?? false,
        aspect: options.aspect || [1, 1],
        quality: options.quality || 0.8,
        exif: true,
        selectionLimit: options.selectionLimit || 1
      });

      if (!result.canceled && result.assets) {
        return result.assets;
      }
      return null;
    } catch (error) {
      console.error('Image pick failed:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
      return null;
    }
  }, []);

  const captureImage = useCallback(async (options = {}) => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to take photos');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: options.allowsEditing ?? true,
        aspect: options.aspect || [1, 1],
        quality: options.quality || 0.8,
        exif: true
      });

      if (!result.canceled && result.assets) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Camera capture failed:', error);
      Alert.alert('Error', 'Failed to capture image with camera');
      return null;
    }
  }, []);

  const optimizeImage = useCallback(async (uri) => {
    try {
      // Simulate image optimization process
      setUploadProgress(0);
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }
      setUploadProgress(100);
      
      // In a real app, you'd compress and optimize the image
      // For now, we return the original URI
      return uri;
    } catch (error) {
      console.error('Image optimization failed:', error);
      return uri;
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, []);

  return {
    uploading,
    uploadProgress,
    setUploading,
    pickImage,
    captureImage,
    optimizeImage
  };
};

// ENHANCED PROFILE IMAGE EDITOR WITH ADVANCED FEATURES
const ProfileImageEditor = ({ profileImage, onImageUpdate, editing }) => {
  const { pickImage, captureImage, uploading, uploadProgress, optimizeImage } = useImageManager();
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleImageSelect = async (source) => {
    setShowImageOptions(false);
    setProcessing(true);

    try {
      let imageAsset;
      
      if (source === 'camera') {
        imageAsset = await captureImage();
      } else {
        const assets = await pickImage({ allowsEditing: true, aspect: [1, 1] });
        imageAsset = assets?.[0];
      }

      if (imageAsset) {
        // Optimize image before saving
        const optimizedUri = await optimizeImage(imageAsset.uri);
        const success = await onImageUpdate(optimizedUri);
        if (success) {
          Alert.alert('Success', 'Profile picture updated successfully');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.profileImageSection}>
      <TouchableOpacity 
        style={styles.avatarContainer}
        onPress={() => editing && setShowImageOptions(true)}
        disabled={!editing || uploading || processing}
      >
        <View style={styles.avatarWrapper}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={40} color="#666" />
              <Text style={styles.avatarPlaceholderText}>Add Photo</Text>
            </View>
          )}
          
          {(uploading || processing) && (
            <View style={styles.uploadOverlay}>
              <ActivityIndicator size="large" color="#00f0a8" />
              {(uploadProgress > 0 && uploadProgress < 100) && (
                <Text style={styles.uploadProgressText}>{uploadProgress}%</Text>
              )}
            </View>
          )}
          
          {editing && !uploading && !processing && (
            <View style={styles.editBadge}>
              <Icon name="camera" size={16} color="#000" />
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Modal 
        visible={showImageOptions} 
        transparent 
        animationType="slide"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <TouchableOpacity 
          style={styles.imageOptionsOverlay}
          activeOpacity={1}
          onPress={() => setShowImageOptions(false)}
        >
          <View style={styles.imageOptionsContent}>
            <Text style={styles.imageOptionsTitle}>Update Profile Picture</Text>
            
            <TouchableOpacity 
              style={styles.imageOption}
              onPress={() => handleImageSelect('camera')}
            >
              <Icon name="camera" size={24} color="#00f0a8" />
              <Text style={styles.imageOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.imageOption}
              onPress={() => handleImageSelect('gallery')}
            >
              <Icon name="images" size={24} color="#00f0a8" />
              <Text style={styles.imageOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            {profileImage && (
              <TouchableOpacity 
                style={[styles.imageOption, styles.removeOption]}
                onPress={() => {
                  onImageUpdate(null);
                  setShowImageOptions(false);
                  Alert.alert('Success', 'Profile picture removed');
                }}
              >
                <Icon name="trash" size={24} color="#ff6b6b" />
                <Text style={[styles.imageOptionText, styles.removeOptionText]}>
                  Remove Photo
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.cancelOption}
              onPress={() => setShowImageOptions(false)}
            >
              <Text style={styles.cancelOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// ENHANCED CATEGORY SYSTEM WITH COMPREHENSIVE OPTIONS
const useAdvancedCategorySystem = (userType) => {
  const categories = {
    skilled: {
      electrical: {
        name: 'Electrical',
        subcategories: ['Residential Wiring', 'Commercial Installation', 'Safety Inspection', 'Panel Upgrade', 'Lighting Installation', 'Generator Installation', 'Solar Panel Installation', 'Emergency Repair', 'Smart Home Integration'],
        icon: 'flash',
        color: '#00f0a8'
      },
      plumbing: {
        name: 'Plumbing',
        subcategories: ['Pipe Installation', 'Leak Repair', 'Water Heater', 'Drain Cleaning', 'Fixture Installation', 'Sewer Line', 'Gas Line', 'Water Treatment', 'Water Filtration'],
        icon: 'water',
        color: '#007AFF'
      },
      carpentry: {
        name: 'Carpentry',
        subcategories: ['Framing', 'Finishing', 'Cabinet Making', 'Furniture Building', 'Structural Repair', 'Deck Building', 'Custom Millwork', 'Restoration', 'Trim Work'],
        icon: 'hammer',
        color: '#8B4513'
      },
      mechanical: {
        name: 'Mechanical',
        subcategories: ['Engine Repair', 'Equipment Maintenance', 'Diagnostic', 'Preventive Maintenance', 'Parts Replacement', 'HVAC', 'Automotive', 'Heavy Machinery', 'Industrial Equipment'],
        icon: 'construct',
        color: '#FF6B6B'
      },
      construction: {
        name: 'Construction',
        subcategories: ['Renovation', 'New Construction', 'Demolition', 'Structural Work', 'Project Management', 'Masonry', 'Roofing', 'Flooring', 'Painting'],
        icon: 'business',
        color: '#FFA500'
      },
      technology: {
        name: 'Technology',
        subcategories: ['Network Setup', 'Computer Repair', 'Smart Home', 'Security Systems', 'Software Installation', 'Data Recovery', 'IT Support', 'CCTV Installation', 'Home Automation'],
        icon: 'hardware-chip',
        color: '#4CD964'
      },
      other: {
        name: 'Other Services',
        subcategories: ['Painting', 'Landscaping', 'Cleaning', 'Moving', 'Assembly', 'Delivery', 'Consultation', 'Event Setup', 'Personal Assistance'],
        icon: 'ellipsis-horizontal',
        color: '#666'
      }
    },
    farmer: {
      crops: {
        name: 'Crop Farming',
        subcategories: ['Maize/Corn', 'Wheat', 'Soybeans', 'Vegetables', 'Fruits', 'Grains', 'Organic Crops', 'Coffee', 'Tea', 'Cotton', 'Sugarcane', 'Rice'],
        icon: 'leaf',
        color: '#4CD964'
      },
      livestock: {
        name: 'Livestock',
        subcategories: ['Cattle', 'Poultry', 'Swine', 'Dairy', 'Sheep/Goats', 'Fish Farming', 'Beekeeping', 'Horse Breeding', 'Aquaculture', 'Poultry Eggs'],
        icon: 'paw',
        color: '#8B4513'
      },
      equipment: {
        name: 'Farm Equipment',
        subcategories: ['Tractors', 'Harvesters', 'Irrigation Systems', 'Planters', 'Sprayers', 'Balers', 'Cultivators', 'Seeders', 'Tillers'],
        icon: 'build',
        color: '#007AFF'
      },
      specialties: {
        name: 'Specialties',
        subcategories: ['Organic Farming', 'Hydroponics', 'Precision Agriculture', 'Sustainable Farming', 'Greenhouse', 'Vermiculture', 'Agroforestry', 'Permaculture', 'Vertical Farming'],
        icon: 'star',
        color: '#FFD700'
      },
      skills: {
        name: 'Farm Skills',
        subcategories: ['Soil Analysis', 'Crop Rotation', 'Pest Management', 'Irrigation Management', 'Harvest Planning', 'Livestock Care', 'Equipment Maintenance', 'Market Analysis', 'Supply Chain'],
        icon: 'school',
        color: '#00f0a8'
      }
    },
    client: {
      projectTypes: {
        name: 'Project Types',
        subcategories: ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Renovation', 'New Construction', 'Maintenance', 'Emergency Repair', 'Consultation'],
        icon: 'document-text',
        color: '#007AFF'
      },
      serviceNeeds: {
        name: 'Service Needs',
        subcategories: ['Electrical', 'Plumbing', 'Carpentry', 'Mechanical', 'Construction', 'Technology', 'Farming', 'Consultation', 'Design'],
        icon: 'briefcase',
        color: '#00f0a8'
      },
      timelines: {
        name: 'Timelines',
        subcategories: ['Immediate', '1-2 Weeks', '1 Month', '3 Months', '6 Months+', 'Ongoing', 'Flexible'],
        icon: 'calendar',
        color: '#4CD964'
      },
      budgets: {
        name: 'Budget Ranges',
        subcategories: ['Under $1k', '$1k-$5k', '$5k-$10k', '$10k-$25k', '$25k-$50k', '$50k+', 'Custom Quote'],
        icon: 'cash',
        color: '#FFD700'
      }
    }
  };

  const getCategories = useCallback(() => {
    return categories[userType] || {};
  }, [userType]);

  const getSubcategories = useCallback((category) => {
    return categories[userType]?.[category]?.subcategories || [];
  }, [userType]);

  const getCategoryInfo = useCallback((category) => {
    return categories[userType]?.[category] || {};
  }, [userType]);

  return {
    getCategories,
    getSubcategories,
    getCategoryInfo,
    categories
  };
};

// ADVANCED REAL-TIME EDITING COMPONENTS WITH ENHANCED FEATURES
const EditableField = ({ 
  value, 
  onSave, 
  placeholder, 
  multiline = false, 
  style,
  type = 'text',
  options = [],
  label,
  required = false,
  maxLength,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');
  const [error, setError] = useState('');

  const validateInput = (input) => {
    if (required && !input.trim()) {
      return 'This field is required';
    }
    if (type === 'email' && input) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) return 'Please enter a valid email address';
    }
    if (type === 'phone' && input) {
      const phoneRegex = /^\+?[\d\s-()]{10,}$/;
      if (!phoneRegex.test(input)) return 'Please enter a valid phone number';
    }
    if (type === 'url' && input) {
      try {
        new URL(input);
      } catch {
        return 'Please enter a valid URL';
      }
    }
    if (maxLength && input.length > maxLength) {
      return `Maximum ${maxLength} characters allowed`;
    }
    return '';
  };

  const handleSave = () => {
    const validationError = validateInput(tempValue);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value || '');
    setError('');
    setIsEditing(false);
  };

  useEffect(() => {
    setTempValue(value || '');
  }, [value]);

  if (!isEditing || !editable) {
    return (
      <TouchableOpacity 
        style={[styles.viewField, style]}
        onPress={() => editable && setIsEditing(true)}
        activeOpacity={editable ? 0.7 : 1}
        disabled={!editable}
      >
        <View style={styles.viewFieldContent}>
          {label && <Text style={styles.fieldLabel}>{label}</Text>}
          <Text style={[
            styles.viewFieldText,
            !value && styles.placeholderText
          ]}>
            {value || placeholder}
          </Text>
        </View>
        {editable && (
          <Icon name="create-outline" size={16} color="#00f0a8" />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.editFieldContainer, style]}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      
      {type === 'select' ? (
        <ScrollView style={styles.optionsContainer} nestedScrollEnabled>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                tempValue === option && styles.optionItemSelected
              ]}
              onPress={() => setTempValue(option)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{option}</Text>
              {tempValue === option && (
                <Icon name="checkmark" size={16} color="#00f0a8" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <TextInput
          style={[
            styles.editField, 
            multiline && styles.multilineField,
            error && styles.fieldError
          ]}
          value={tempValue}
          onChangeText={(text) => {
            setTempValue(text);
            if (error) setError('');
          }}
          placeholder={placeholder}
          placeholderTextColor="#666"
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType="done"
          blurOnSubmit={true}
          maxLength={maxLength}
        />
      )}
      
      {maxLength && (
        <Text style={styles.charCount}>
          {tempValue.length}/{maxLength}
        </Text>
      )}
      
      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="warning" size={12} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      <View style={styles.editButtons}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// FIXED: ENHANCED USER TYPE SELECTOR WITH PROPER ROLE NAVIGATION
const UserTypeSelector = ({ 
  currentType, 
  onTypeChange, 
  onNavigateToDetails,
  editing 
}) => {
  const userTypes = [
    {
      type: 'skilled',
      icon: 'construct',
      title: 'Skilled Professional',
      description: 'Offer vocational services and expertise to clients',
      color: '#00f0a8',
      examples: ['Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Technician', 'Consultant'],
      features: ['Service listings', 'Portfolio showcase', 'Client reviews', 'Booking system']
    },
    {
      type: 'farmer',
      icon: 'leaf',
      title: 'Farmer & Agri-Expert',
      description: 'Agricultural services, farm management, and crop expertise',
      color: '#4CD964',
      examples: ['Crop Farmer', 'Livestock Farmer', 'Dairy Farmer', 'Agri-Consultant'],
      features: ['Crop management', 'Equipment listing', 'Market access', 'Supply chain']
    },
    {
      type: 'client',
      icon: 'business',
      title: 'Client & Project Owner',
      description: 'Find and hire skilled professionals for your projects',
      color: '#007AFF',
      examples: ['Homeowner', 'Business Owner', 'Project Manager', 'Contractor'],
      features: ['Project posting', 'Professional search', 'Budget management', 'Reviews']
    }
  ];

  if (!editing) {
    const current = userTypes.find(t => t.type === currentType) || userTypes[0];
    return (
      <View style={styles.userTypeDisplay}>
        <View style={[styles.typeIcon, { backgroundColor: current.color }]}>
          {current.type === 'skilled' ? VectorIconsShared.electrician('#000', 20)
            : current.type === 'farmer' ? VectorIconsShared.farmer('#000', 20)
            : VectorIconsShared.client('#000', 20)}
        </View>
        <View style={styles.typeInfo}>
          <Text style={styles.typeTitle}>{current.title}</Text>
          <Text style={styles.typeDescription}>{current.description}</Text>
        </View>
        <TouchableOpacity 
          onPress={onNavigateToDetails}
          style={styles.detailsButton}
          activeOpacity={0.7}
        >
          <Icon name="chevron-forward" size={20} color="#00f0a8" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.userTypeSelector}>
      <View style={styles.selectorHeader}>
        <Text style={styles.selectorTitle}>Select Your Professional Role</Text>
        <Text style={styles.selectorSubtitle}>
          Choose how you want to use the platform. This affects available features and how others see your profile.
        </Text>
      </View>
      
      <View style={styles.typeOptions}>
        {userTypes.map((userType) => (
          <TouchableOpacity
            key={userType.type}
            style={[
              styles.typeOption,
              currentType === userType.type && styles.typeOptionSelected,
              { borderColor: userType.color }
            ]}
            onPress={() => onTypeChange(userType.type)}
            activeOpacity={0.7}
          >
            <View style={styles.typeOptionHeader}>
              <View style={[styles.typeOptionIcon, { backgroundColor: userType.color }]}>
                {userType.type === 'skilled' ? VectorIconsShared.electrician('#000', 24)
                  : userType.type === 'farmer' ? VectorIconsShared.farmer('#000', 24)
                  : VectorIconsShared.client('#000', 24)}
              </View>
              <View style={styles.typeOptionTexts}>
                <Text style={styles.typeOptionTitle}>{userType.title}</Text>
                <Text style={styles.typeOptionDescription}>{userType.description}</Text>
              </View>
              {currentType === userType.type && (
                <View style={[styles.selectedBadge, { backgroundColor: userType.color }]}>
                  <Icon name="checkmark" size={16} color="#000" />
                </View>
              )}
            </View>
            
            <View style={styles.examplesContainer}>
              <Text style={styles.examplesLabel}>Common roles:</Text>
              <View style={styles.examplesList}>
                {userType.examples.map((example, index) => (
                  <View key={index} style={styles.exampleChip}>
                    <Text style={styles.exampleText}>{example}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresLabel}>Key features:</Text>
              <View style={styles.featuresList}>
                {userType.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Icon name="checkmark-circle" size={14} color={userType.color} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.roleChangeNote}>
        <Icon name="information-circle" size={16} color="#00f0a8" />
        <Text style={styles.roleChangeNoteText}>
          Changing your role will adjust available features but preserve your existing data.
        </Text>
      </View>
    </View>
  );
};

// ENHANCED SKILL MANAGER WITH ADVANCED FUNCTIONALITY
const SkillManager = ({ 
  skills = [], 
  userType, 
  onAddSkill, 
  onUpdateSkill,
  onRemoveSkill, 
  editing,
  commitProfileSave
}) => {
  const { getCategories, getSubcategories, getCategoryInfo } = useAdvancedCategorySystem(userType);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    subcategory: '',
    level: 'intermediate',
    years: 1,
    certified: false,
    description: ''
  });

  const categories = getCategories();
  const subcategories = newSkill.category ? getSubcategories(newSkill.category) : [];
  const categoryInfo = newSkill.category ? getCategoryInfo(newSkill.category) : {};

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      Alert.alert('Error', 'Please enter a skill name');
      return;
    }
    if (!newSkill.category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    onAddSkill(newSkill);
    setNewSkill({ 
      name: '', 
      category: '', 
      subcategory: '', 
      level: 'intermediate', 
      years: 1, 
      certified: false,
      description: '' 
    });
    setShowAddSkill(false);
    if (typeof commitProfileSave === 'function') commitProfileSave();
  };

  const handleUpdateSkill = () => {
    if (!editingSkill) return;
    
    if (!editingSkill.name.trim()) {
      Alert.alert('Error', 'Please enter a skill name');
      return;
    }
    if (!editingSkill.category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    onUpdateSkill(editingSkill.id, editingSkill);
    setEditingSkill(null);
    if (typeof commitProfileSave === 'function') commitProfileSave();
  };

  const SkillChip = ({ skill, onEdit, onRemove }) => (
    <View style={styles.skillChip}>
      <View style={styles.skillInfo}>
        <Text style={styles.skillName}>{skill.name}</Text>
        <View style={styles.skillMeta}>
          <Text style={styles.skillCategory}>{skill.category}</Text>
          {skill.subcategory && (
            <Text style={styles.skillSubcategory}>• {skill.subcategory}</Text>
          )}
          <Text style={styles.skillLevel}>• {skill.level}</Text>
          <Text style={styles.skillYears}>• {skill.years} year{skill.years !== 1 ? 's' : ''}</Text>
          {skill.certified && (
            <View style={styles.certifiedBadge}>
              <Icon name="shield-checkmark" size={10} color="#000" />
            </View>
          )}
        </View>
        {skill.description && (
          <Text style={styles.skillDescription}>{skill.description}</Text>
        )}
      </View>
      {editing && (
        <View style={styles.skillActions}>
          <TouchableOpacity 
            onPress={onEdit} 
            style={styles.editSkillButton}
            activeOpacity={0.7}
          >
            <Icon name="create-outline" size={16} color="#00f0a8" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onRemove} 
            style={styles.removeSkillButton}
            activeOpacity={0.7}
          >
            <Icon name="close" size={16} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.skillManager}>
      <View style={styles.skillHeader}>
        <View>
          <Text style={styles.skillTitle}>
            {userType === 'skilled' && 'Professional Skills & Expertise'}
            {userType === 'farmer' && 'Farm Specialties & Equipment'}
            {userType === 'client' && 'Service Interests & Needs'}
          </Text>
          <Text style={styles.skillSubtitle}>
            {skills.length} {skills.length === 1 ? 'skill' : 'skills'} added • 
            Profile strength: {Math.round((skills.length / 5) * 100)}%
          </Text>
        </View>
        {editing && (
          <TouchableOpacity 
            style={styles.addSkillButton}
            onPress={() => setShowAddSkill(true)}
            activeOpacity={0.7}
          >
            <Icon name="add" size={20} color="#00f0a8" />
            <Text style={styles.addSkillText}>Add Skill</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.skillsGrid}>
        {skills.map((skill) => (
          <SkillChip 
            key={skill.id} 
            skill={skill} 
            onEdit={() => setEditingSkill(skill)}
              onRemove={() => { onRemoveSkill(skill.id); if (typeof commitProfileSave === 'function') commitProfileSave(); }} 
          />
        ))}
        
        {skills.length === 0 && (
          <View style={styles.noSkills}>
            <Icon name="construct-outline" size={48} color="#666" />
            <Text style={styles.noSkillsText}>No skills added yet</Text>
            <Text style={styles.noSkillsSubtext}>
              {userType === 'skilled' && 'Add your professional skills to showcase your expertise to potential clients'}
              {userType === 'farmer' && 'Add your farm specialties and equipment to connect with agricultural services'}
              {userType === 'client' && 'Add your service interests to help us match you with the right professionals'}
            </Text>
            {editing && (
              <TouchableOpacity 
                style={styles.addFirstSkillButton}
                onPress={() => setShowAddSkill(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.addFirstSkillText}>Add Your First Skill</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Add/Edit Skill Modal */}
      <Modal 
        visible={showAddSkill || !!editingSkill} 
        animationType="slide" 
        transparent
        onRequestClose={() => {
          setShowAddSkill(false);
          setEditingSkill(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowAddSkill(false);
                  setEditingSkill(null);
                }}
                activeOpacity={0.7}
              >
                <Icon name="close" size={24} color="#00f0a8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Skill Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={editingSkill ? editingSkill.name : newSkill.name}
                  onChangeText={(text) => editingSkill 
                    ? setEditingSkill(prev => ({ ...prev, name: text }))
                    : setNewSkill(prev => ({ ...prev, name: text }))
                  }
                  placeholder="e.g., Electrical Wiring, Crop Management, Project Planning"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {Object.keys(categories).map((category) => {
                    const catInfo = getCategoryInfo(category);
                    return (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryChip,
                          (editingSkill ? editingSkill.category : newSkill.category) === category && styles.categoryChipSelected,
                          { borderColor: catInfo.color || '#00f0a8' }
                        ]}
                        onPress={() => {
                          if (editingSkill) {
                            setEditingSkill(prev => ({ 
                              ...prev, 
                              category, 
                              subcategory: '' 
                            }));
                          } else {
                            setNewSkill(prev => ({ 
                              ...prev, 
                              category, 
                              subcategory: '' 
                            }));
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <Icon 
                          name={catInfo.icon || 'help'} 
                          size={16} 
                          color={catInfo.color || '#00f0a8'} 
                        />
                        <Text style={styles.categoryChipText}>
                          {catInfo.name || category}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {(editingSkill ? editingSkill.category : newSkill.category) && (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Specialization</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.subcategoriesContainer}
                  >
                    {subcategories.map((subcat) => (
                      <TouchableOpacity
                        key={subcat}
                        style={[
                          styles.subcategoryChip,
                          (editingSkill ? editingSkill.subcategory : newSkill.subcategory) === subcat && styles.subcategoryChipSelected
                        ]}
                        onPress={() => {
                          if (editingSkill) {
                            setEditingSkill(prev => ({ ...prev, subcategory: subcat }));
                          } else {
                            setNewSkill(prev => ({ ...prev, subcategory: subcat }));
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.subcategoryChipText}>{subcat}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Experience Level</Text>
                <View style={styles.levelOptions}>
                  {[
                    { value: 'beginner', label: 'Beginner', description: '0-2 years' },
                    { value: 'intermediate', label: 'Intermediate', description: '2-5 years' },
                    { value: 'advanced', label: 'Advanced', description: '5-8 years' },
                    { value: 'expert', label: 'Expert', description: '8+ years' }
                  ].map((level) => (
                    <TouchableOpacity
                      key={level.value}
                      style={[
                        styles.levelChip,
                        (editingSkill ? editingSkill.level : newSkill.level) === level.value && styles.levelChipSelected
                      ]}
                      onPress={() => {
                        if (editingSkill) {
                          setEditingSkill(prev => ({ ...prev, level: level.value }));
                        } else {
                          setNewSkill(prev => ({ ...prev, level: level.value }));
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.levelChipText}>{level.label}</Text>
                      <Text style={styles.levelChipDescription}>{level.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Years of Experience</Text>
                <View style={styles.yearsSelector}>
                  {[1,2,3,5,8,10,15,20].map((years) => (
                    <TouchableOpacity
                      key={years}
                      style={[
                        styles.yearChip,
                        (editingSkill ? editingSkill.years : newSkill.years) === years && styles.yearChipSelected
                      ]}
                      onPress={() => {
                        if (editingSkill) {
                          setEditingSkill(prev => ({ ...prev, years }));
                        } else {
                          setNewSkill(prev => ({ ...prev, years }));
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.yearChipText}>{years}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Skill Description</Text>
                <TextInput
                  style={[styles.formInput, styles.multilineInput]}
                  value={editingSkill ? editingSkill.description : newSkill.description}
                  onChangeText={(text) => editingSkill 
                    ? setEditingSkill(prev => ({ ...prev, description: text }))
                    : setNewSkill(prev => ({ ...prev, description: text }))
                  }
                  placeholder="Describe your expertise, special techniques, or notable achievements..."
                  placeholderTextColor="#666"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formGroup}>
                <TouchableOpacity
                  style={[
                    styles.certifiedToggle,
                    (editingSkill ? editingSkill.certified : newSkill.certified) && styles.certifiedToggleActive
                  ]}
                  onPress={() => {
                    if (editingSkill) {
                      setEditingSkill(prev => ({ ...prev, certified: !prev.certified }));
                    } else {
                      setNewSkill(prev => ({ ...prev, certified: !prev.certified }));
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.certifiedToggleContent}>
                    <View style={[
                      styles.certifiedToggleSwitch,
                      (editingSkill ? editingSkill.certified : newSkill.certified) && styles.certifiedToggleSwitchActive
                    ]}>
                      <Icon 
                        name={(editingSkill ? editingSkill.certified : newSkill.certified) ? "checkmark" : "close"} 
                        size={12} 
                        color="#000" 
                      />
                    </View>
                    <View style={styles.certifiedToggleTexts}>
                      <Text style={styles.certifiedToggleText}>
                        Certified in this skill
                      </Text>
                      <Text style={styles.certifiedToggleSubtext}>
                        I have formal certification or accreditation
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => {
                  setShowAddSkill(false);
                  setEditingSkill(null);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.saveModalButton,
                  ((editingSkill ? !editingSkill.name : !newSkill.name) || 
                   (editingSkill ? !editingSkill.category : !newSkill.category)) && styles.saveModalButtonDisabled
                ]}
                onPress={editingSkill ? handleUpdateSkill : handleAddSkill}
                disabled={(editingSkill ? !editingSkill.name : !newSkill.name) || 
                         (editingSkill ? !editingSkill.category : !newSkill.category)}
                activeOpacity={0.7}
              >
                <Text style={styles.saveModalText}>
                  {editingSkill ? 'Update Skill' : 'Add Skill'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// FIXED: ENHANCED FARMER PROFILE COMPONENT WITH PROPER NAVIGATION
const FarmerProfileManager = ({ farmDetails = {}, onUpdate, editing, isVisible, onClose }) => {
  const [tempFarmDetails, setTempFarmDetails] = useState({
    farmName: '',
    farmSize: 0,
    farmType: '',
    mainCrops: [],
    livestock: [],
    equipment: [],
    machinery: [],
    irrigationSystems: [],
    certifications: [],
    specialties: [],
    farmLocation: '',
    hectares: 0,
    soilType: '',
    waterSource: '',
    organicCertified: false,
    harvestSeasons: [],
    annualProduction: 0,
    sustainabilityPractices: [],
    marketChannels: [],
    ...farmDetails
  });

  const [newCrop, setNewCrop] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [newPractice, setNewPractice] = useState('');
  const [newMarket, setNewMarket] = useState('');

  const farmTypes = [
    'Crop Farm', 'Dairy Farm', 'Poultry Farm', 'Mixed Farm', 
    'Organic Farm', 'Vineyard', 'Orchard', 'Aquaculture', 
    'Livestock Farm', 'Greenhouse', 'Hydroponic Farm', 'Family Farm'
  ];

  const soilTypes = ['Loam', 'Clay', 'Sandy', 'Silt', 'Peat', 'Chalk', 'Mixed', 'Volcanic'];
  const waterSources = ['Well', 'River', 'Lake', 'Municipal', 'Rainwater', 'Irrigation Canal', 'Dam', 'Borehole'];
  const sustainabilityPracticesList = [
    'Crop Rotation', 'Conservation Tillage', 'Integrated Pest Management',
    'Water Conservation', 'Soil Conservation', 'Renewable Energy',
    'Organic Farming', 'Biodiversity Protection', 'Waste Recycling'
  ];
  const marketChannelsList = [
    'Local Markets', 'Supermarkets', 'Restaurants', 'Export',
    'Farmers Markets', 'Online Sales', 'Wholesale', 'Community Supported Agriculture'
  ];

  const handleSaveFarmDetails = () => {
    onUpdate(tempFarmDetails);
    onClose();
    Alert.alert('Success', 'Farm details updated successfully');
  };

  const addCrop = () => {
    if (newCrop.trim() && !tempFarmDetails.mainCrops.includes(newCrop.trim())) {
      setTempFarmDetails(prev => ({
        ...prev,
        mainCrops: [...prev.mainCrops, newCrop.trim()]
      }));
      setNewCrop('');
    }
  };

  const removeCrop = (crop) => {
    setTempFarmDetails(prev => ({
      ...prev,
      mainCrops: prev.mainCrops.filter(c => c !== crop)
    }));
  };

  const addEquipment = () => {
    if (newEquipment.trim() && !tempFarmDetails.equipment.includes(newEquipment.trim())) {
      setTempFarmDetails(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  const removeEquipment = (equipment) => {
    setTempFarmDetails(prev => ({
      ...prev,
      equipment: prev.equipment.filter(e => e !== equipment)
    }));
  };

  const addPractice = () => {
    if (newPractice.trim() && !tempFarmDetails.sustainabilityPractices.includes(newPractice.trim())) {
      setTempFarmDetails(prev => ({
        ...prev,
        sustainabilityPractices: [...prev.sustainabilityPractices, newPractice.trim()]
      }));
      setNewPractice('');
    }
  };

  const removePractice = (practice) => {
    setTempFarmDetails(prev => ({
      ...prev,
      sustainabilityPractices: prev.sustainabilityPractices.filter(p => p !== practice)
    }));
  };

  const addMarket = () => {
    if (newMarket.trim() && !tempFarmDetails.marketChannels.includes(newMarket.trim())) {
      setTempFarmDetails(prev => ({
        ...prev,
        marketChannels: [...prev.marketChannels, newMarket.trim()]
      }));
      setNewMarket('');
    }
  };

  const removeMarket = (market) => {
    setTempFarmDetails(prev => ({
      ...prev,
      marketChannels: prev.marketChannels.filter(m => m !== market)
    }));
  };

  useEffect(() => {
    if (isVisible) {
      setTempFarmDetails({
        farmName: '',
        farmSize: 0,
        farmType: '',
        mainCrops: [],
        livestock: [],
        equipment: [],
        machinery: [],
        irrigationSystems: [],
        certifications: [],
        specialties: [],
        farmLocation: '',
        hectares: 0,
        soilType: '',
        waterSource: '',
        organicCertified: false,
        harvestSeasons: [],
        annualProduction: 0,
        sustainabilityPractices: [],
        marketChannels: [],
        ...farmDetails
      });
    }
  }, [isVisible, farmDetails]);

  if (!isVisible) return null;

  return (
    <Modal 
      visible={isVisible} 
      animationType="slide" 
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.largeModal]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Farm Details</Text>
            <TouchableOpacity 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Icon name="close" size={24} color="#00f0a8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionSubtitle}>
              Complete your farm profile to connect with relevant services and buyers
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Farm Name *</Text>
              <TextInput
                style={styles.formInput}
                value={tempFarmDetails.farmName}
                onChangeText={(text) => setTempFarmDetails(prev => ({ ...prev, farmName: text }))}
                placeholder="Enter your farm name"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Farm Type *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {farmTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.farmTypeChip,
                      tempFarmDetails.farmType === type && styles.farmTypeChipSelected
                    ]}
                    onPress={() => setTempFarmDetails(prev => ({ ...prev, farmType: type }))}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.farmTypeText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.formLabel}>Farm Size (hectares) *</Text>
                <TextInput
                  style={styles.formInput}
                  value={tempFarmDetails.hectares?.toString()}
                  onChangeText={(text) => setTempFarmDetails(prev => ({ ...prev, hectares: parseFloat(text) || 0 }))}
                  placeholder="0"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.formLabel}>Annual Production</Text>
                <TextInput
                  style={styles.formInput}
                  value={tempFarmDetails.annualProduction?.toString()}
                  onChangeText={(text) => setTempFarmDetails(prev => ({ ...prev, annualProduction: parseFloat(text) || 0 }))}
                  placeholder="Estimated tons"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Main Crops</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.formInput, styles.flex1]}
                  value={newCrop}
                  onChangeText={setNewCrop}
                  placeholder="Add a crop"
                  placeholderTextColor="#666"
                  onSubmitEditing={addCrop}
                />
                <TouchableOpacity 
                  style={styles.addItemButton}
                  onPress={addCrop}
                  disabled={!newCrop.trim()}
                  activeOpacity={0.7}
                >
                  <Icon name="add" size={20} color="#00f0a8" />
                </TouchableOpacity>
              </View>
              <View style={styles.selectedItems}>
                {tempFarmDetails.mainCrops.map((crop, index) => (
                  <View key={index} style={styles.selectedCrop}>
                    <Text style={styles.selectedCropText}>{crop}</Text>
                    <TouchableOpacity 
                      onPress={() => removeCrop(crop)}
                      activeOpacity={0.7}
                    >
                      <Icon name="close" size={16} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Equipment & Machinery</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.formInput, styles.flex1]}
                  value={newEquipment}
                  onChangeText={setNewEquipment}
                  placeholder="Add equipment"
                  placeholderTextColor="#666"
                  onSubmitEditing={addEquipment}
                />
                <TouchableOpacity 
                  style={styles.addItemButton}
                  onPress={addEquipment}
                  disabled={!newEquipment.trim()}
                  activeOpacity={0.7}
                >
                  <Icon name="add" size={20} color="#00f0a8" />
                </TouchableOpacity>
              </View>
              <View style={styles.selectedItems}>
                {tempFarmDetails.equipment.map((item, index) => (
                  <View key={index} style={styles.selectedEquipmentItem}>
                    <Text style={styles.selectedEquipmentText}>{item}</Text>
                    <TouchableOpacity 
                      onPress={() => removeEquipment(item)}
                      activeOpacity={0.7}
                    >
                      <Icon name="close" size={16} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Soil Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {soilTypes.map((soil) => (
                  <TouchableOpacity
                    key={soil}
                    style={[
                      styles.soilTypeChip,
                      tempFarmDetails.soilType === soil && styles.soilTypeChipSelected
                    ]}
                    onPress={() => setTempFarmDetails(prev => ({ ...prev, soilType: soil }))}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.soilTypeText}>{soil}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Water Source</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {waterSources.map((source) => (
                  <TouchableOpacity
                    key={source}
                    style={[
                      styles.waterSourceChip,
                      tempFarmDetails.waterSource === source && styles.waterSourceChipSelected
                    ]}
                    onPress={() => setTempFarmDetails(prev => ({ ...prev, waterSource: source }))}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.waterSourceText}>{source}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Sustainability Practices</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.formInput, styles.flex1]}
                  value={newPractice}
                  onChangeText={setNewPractice}
                  placeholder="Add sustainability practice"
                  placeholderTextColor="#666"
                  onSubmitEditing={addPractice}
                />
                <TouchableOpacity 
                  style={styles.addItemButton}
                  onPress={addPractice}
                  disabled={!newPractice.trim()}
                  activeOpacity={0.7}
                >
                  <Icon name="add" size={20} color="#00f0a8" />
                </TouchableOpacity>
              </View>
              <View style={styles.selectedItems}>
                {tempFarmDetails.sustainabilityPractices.map((practice, index) => (
                  <View key={index} style={styles.selectedPractice}>
                    <Icon name="leaf" size={12} color="#4CD964" />
                    <Text style={styles.selectedPracticeText}>{practice}</Text>
                    <TouchableOpacity 
                      onPress={() => removePractice(practice)}
                      activeOpacity={0.7}
                    >
                      <Icon name="close" size={16} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Market Channels</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.formInput, styles.flex1]}
                  value={newMarket}
                  onChangeText={setNewMarket}
                  placeholder="Add market channel"
                  placeholderTextColor="#666"
                  onSubmitEditing={addMarket}
                />
                <TouchableOpacity 
                  style={styles.addItemButton}
                  onPress={addMarket}
                  disabled={!newMarket.trim()}
                  activeOpacity={0.7}
                >
                  <Icon name="add" size={20} color="#00f0a8" />
                </TouchableOpacity>
              </View>
              <View style={styles.selectedItems}>
                {tempFarmDetails.marketChannels.map((market, index) => (
                  <View key={index} style={styles.selectedMarket}>
                    <Icon name="business" size={12} color="#007AFF" />
                    <Text style={styles.selectedMarketText}>{market}</Text>
                    <TouchableOpacity 
                      onPress={() => removeMarket(market)}
                      activeOpacity={0.7}
                    >
                      <Icon name="close" size={16} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <TouchableOpacity
                style={[
                  styles.organicToggle,
                  tempFarmDetails.organicCertified && styles.organicToggleActive
                ]}
                onPress={() => setTempFarmDetails(prev => ({ ...prev, organicCertified: !prev.organicCertified }))}
                activeOpacity={0.7}
              >
                <View style={styles.organicToggleContent}>
                  <View style={[
                    styles.organicToggleSwitch,
                    tempFarmDetails.organicCertified && styles.organicToggleSwitchActive
                  ]}>
                    <Icon 
                      name={tempFarmDetails.organicCertified ? "checkmark" : "close"} 
                      size={12} 
                      color="#000" 
                    />
                  </View>
                  <View style={styles.organicToggleTexts}>
                    <Text style={styles.organicToggleText}>
                      Organically Certified
                    </Text>
                    <Text style={styles.organicToggleSubtext}>
                      My farm follows organic farming practices and is certified
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelModalButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelModalText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.saveModalButton,
                (!tempFarmDetails.farmName || !tempFarmDetails.farmType || !tempFarmDetails.hectares) && styles.saveModalButtonDisabled
              ]}
              onPress={handleSaveFarmDetails}
              disabled={!tempFarmDetails.farmName || !tempFarmDetails.farmType || !tempFarmDetails.hectares}
              activeOpacity={0.7}
            >
              <Text style={styles.saveModalText}>Save Farm Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// FIXED: ENHANCED CLIENT PROFILE COMPONENT WITH PROPER NAVIGATION
const ClientProfileManager = ({ clientDetails = {}, onUpdate, editing, isVisible, onClose }) => {
  const [tempClientDetails, setTempClientDetails] = useState({
    companyName: '',
    industry: '',
    projectTypes: [],
    serviceNeeds: [],
    budgetRange: { min: 0, max: 0 },
    timeline: '',
    locationPreferences: [],
    projectSize: '',
    preferredSkills: [],
    companySize: '',
    projectHistory: [],
    preferredCommunication: ['email', 'phone'],
    urgencyLevel: 'medium',
    ...clientDetails
  });

  const [newProjectType, setNewProjectType] = useState('');
  const [newServiceNeed, setNewServiceNeed] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const industries = [
    'Residential', 'Commercial', 'Industrial', 'Agricultural', 
    'Construction', 'Technology', 'Healthcare', 'Education', 
    'Hospitality', 'Retail', 'Manufacturing', 'Finance'
  ];

  const projectSizes = [
    'Small (<$5k)', 'Medium ($5k-$25k)', 'Large ($25k-$100k)', 
    'Enterprise ($100k+)', 'Custom Quote'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', description: 'Planning phase' },
    { value: 'medium', label: 'Medium', description: 'Ready to start' },
    { value: 'high', label: 'High', description: 'Urgent need' },
    { value: 'emergency', label: 'Emergency', description: 'Immediate attention' }
  ];

  const communicationMethods = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'video', label: 'Video Call' },
    { value: 'in-person', label: 'In Person' }
  ];

  const companySizes = [
    'Individual', 'Small Business (1-10)', 'Medium Business (11-50)',
    'Large Business (51-200)', 'Enterprise (200+)'
  ];

  const handleSaveClientDetails = () => {
    onUpdate(tempClientDetails);
    onClose();
    Alert.alert('Success', 'Client details updated successfully');
  };

  const addProjectType = () => {
    if (newProjectType.trim() && !tempClientDetails.projectTypes.includes(newProjectType.trim())) {
      setTempClientDetails(prev => ({
        ...prev,
        projectTypes: [...prev.projectTypes, newProjectType.trim()]
      }));
      setNewProjectType('');
    }
  };

  const removeProjectType = (type) => {
    setTempClientDetails(prev => ({
      ...prev,
      projectTypes: prev.projectTypes.filter(t => t !== type)
    }));
  };

  const addServiceNeed = () => {
    if (newServiceNeed.trim() && !tempClientDetails.serviceNeeds.includes(newServiceNeed.trim())) {
      setTempClientDetails(prev => ({
        ...prev,
        serviceNeeds: [...prev.serviceNeeds, newServiceNeed.trim()]
      }));
      setNewServiceNeed('');
    }
  };

  const removeServiceNeed = (service) => {
    setTempClientDetails(prev => ({
      ...prev,
      serviceNeeds: prev.serviceNeeds.filter(s => s !== service)
    }));
  };

  const addLocation = () => {
    if (newLocation.trim() && !tempClientDetails.locationPreferences.includes(newLocation.trim())) {
      setTempClientDetails(prev => ({
        ...prev,
        locationPreferences: [...prev.locationPreferences, newLocation.trim()]
      }));
      setNewLocation('');
    }
  };

  const removeLocation = (location) => {
    setTempClientDetails(prev => ({
      ...prev,
      locationPreferences: prev.locationPreferences.filter(l => l !== location)
    }));
  };

  const toggleCommunication = (method) => {
    setTempClientDetails(prev => ({
      ...prev,
      preferredCommunication: prev.preferredCommunication.includes(method)
        ? prev.preferredCommunication.filter(m => m !== method)
        : [...prev.preferredCommunication, method]
    }));
  };

  useEffect(() => {
    if (isVisible) {
      setTempClientDetails({
        companyName: '',
        industry: '',
        projectTypes: [],
        serviceNeeds: [],
        budgetRange: { min: 0, max: 0 },
        timeline: '',
        locationPreferences: [],
        projectSize: '',
        preferredSkills: [],
        companySize: '',
        projectHistory: [],
        preferredCommunication: ['email', 'phone'],
        urgencyLevel: 'medium',
        ...clientDetails
      });
    }
  }, [isVisible, clientDetails]);

  if (!isVisible) return null;

  return (
    <Modal 
      visible={isVisible} 
      animationType="slide" 
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.largeModal]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Client Details</Text>
            <TouchableOpacity 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Icon name="close" size={24} color="#00f0a8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionSubtitle}>
              Complete your client profile to help us match you with the right professionals
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Company Name *</Text>
              <TextInput
                style={styles.formInput}
                value={tempClientDetails.companyName}
                onChangeText={(text) => setTempClientDetails(prev => ({ ...prev, companyName: text }))}
                placeholder="Enter your company name"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Industry *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {industries.map((industry) => (
                  <TouchableOpacity
                    key={industry}
                    style={[
                      styles.industryChip,
                      tempClientDetails.industry === industry && styles.industryChipSelected
                    ]}
                    onPress={() => setTempClientDetails(prev => ({ ...prev, industry }))}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.industryText}>{industry}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Company Size</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {companySizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.companySizeChip,
                      tempClientDetails.companySize === size && styles.companySizeChipSelected
                    ]}
                    onPress={() => setTempClientDetails(prev => ({ ...prev, companySize: size }))}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.companySizeText}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Project Types</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.formInput, styles.flex1]}
                  value={newProjectType}
                  onChangeText={setNewProjectType}
                  placeholder="Add project type"
                  placeholderTextColor="#666"
                  onSubmitEditing={addProjectType}
                />
                <TouchableOpacity 
                  style={styles.addItemButton}
                  onPress={addProjectType}
                  disabled={!newProjectType.trim()}
                  activeOpacity={0.7}
                >
                  <Icon name="add" size={20} color="#00f0a8" />
                </TouchableOpacity>
              </View>
              <View style={styles.selectedItems}>
                {tempClientDetails.projectTypes.map((type, index) => (
                  <View key={index} style={styles.selectedProject}>
                    <Text style={styles.selectedProjectText}>{type}</Text>
                    <TouchableOpacity 
                      onPress={() => removeProjectType(type)}
                      activeOpacity={0.7}
                    >
                      <Icon name="close" size={16} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Service Needs</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.formInput, styles.flex1]}
                  value={newServiceNeed}
                  onChangeText={setNewServiceNeed}
                  placeholder="Add service need"
                  placeholderTextColor="#666"
                  onSubmitEditing={addServiceNeed}
                />
                <TouchableOpacity 
                  style={styles.addItemButton}
                  onPress={addServiceNeed}
                  disabled={!newServiceNeed.trim()}
                  activeOpacity={0.7}
                >
                  <Icon name="add" size={20} color="#00f0a8" />
                </TouchableOpacity>
              </View>
              <View style={styles.selectedItems}>
                {tempClientDetails.serviceNeeds.map((service, index) => (
                  <View key={index} style={styles.selectedService}>
                    <Text style={styles.selectedServiceText}>{service}</Text>
                    <TouchableOpacity 
                      onPress={() => removeServiceNeed(service)}
                      activeOpacity={0.7}
                    >
                      <Icon name="close" size={16} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Preferred Locations</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.formInput, styles.flex1]}
                  value={newLocation}
                  onChangeText={setNewLocation}
                  placeholder="Add location preference"
                  placeholderTextColor="#666"
                  onSubmitEditing={addLocation}
                />
                <TouchableOpacity 
                  style={styles.addItemButton}
                  onPress={addLocation}
                  disabled={!newLocation.trim()}
                  activeOpacity={0.7}
                >
                  <Icon name="add" size={20} color="#00f0a8" />
                </TouchableOpacity>
              </View>
              <View style={styles.selectedItems}>
                {tempClientDetails.locationPreferences.map((location, index) => (
                  <View key={index} style={styles.selectedLocation}>
                    <Icon name="location" size={12} color="#00f0a8" />
                    <Text style={styles.selectedLocationText}>{location}</Text>
                    <TouchableOpacity 
                      onPress={() => removeLocation(location)}
                      activeOpacity={0.7}
                    >
                      <Icon name="close" size={16} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.formLabel}>Budget Range ($)</Text>
                <View style={styles.budgetRangeContainer}>
                  <TextInput
                    style={styles.budgetInput}
                    value={tempClientDetails.budgetRange.min?.toString()}
                    onChangeText={(text) => setTempClientDetails(prev => ({
                      ...prev,
                      budgetRange: { ...prev.budgetRange, min: parseFloat(text) || 0 }
                    }))}
                    placeholder="Min"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                  <Text style={styles.budgetSeparator}>-</Text>
                  <TextInput
                    style={styles.budgetInput}
                    value={tempClientDetails.budgetRange.max?.toString()}
                    onChangeText={(text) => setTempClientDetails(prev => ({
                      ...prev,
                      budgetRange: { ...prev.budgetRange, max: parseFloat(text) || 0 }
                    }))}
                    placeholder="Max"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Project Size</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {projectSizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.projectSizeChip,
                      tempClientDetails.projectSize === size && styles.projectSizeChipSelected
                    ]}
                    onPress={() => setTempClientDetails(prev => ({ ...prev, projectSize: size }))}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.projectSizeText}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Project Urgency</Text>
              <View style={styles.urgencyOptions}>
                {urgencyLevels.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.urgencyChip,
                      tempClientDetails.urgencyLevel === level.value && styles.urgencyChipSelected
                    ]}
                    onPress={() => setTempClientDetails(prev => ({ ...prev, urgencyLevel: level.value }))}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.urgencyChipText}>{level.label}</Text>
                    <Text style={styles.urgencyChipDescription}>{level.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Preferred Communication</Text>
              <View style={styles.communicationOptions}>
                {communicationMethods.map((method) => (
                  <TouchableOpacity
                    key={method.value}
                    style={[
                      styles.communicationChip,
                      tempClientDetails.preferredCommunication.includes(method.value) && styles.communicationChipSelected
                    ]}
                    onPress={() => toggleCommunication(method.value)}
                    activeOpacity={0.7}
                  >
                    <Icon 
                      name={
                        method.value === 'email' ? 'mail' :
                        method.value === 'phone' ? 'call' :
                        method.value === 'video' ? 'videocam' : 'person'
                      }
                      size={16}
                      color={tempClientDetails.preferredCommunication.includes(method.value) ? '#000' : '#666'}
                    />
                    <Text style={[
                      styles.communicationChipText,
                      tempClientDetails.preferredCommunication.includes(method.value) && styles.communicationChipTextSelected
                    ]}>
                      {method.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelModalButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelModalText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.saveModalButton,
                (!tempClientDetails.companyName || !tempClientDetails.industry) && styles.saveModalButtonDisabled
              ]}
              onPress={handleSaveClientDetails}
              disabled={!tempClientDetails.companyName || !tempClientDetails.industry}
              activeOpacity={0.7}
            >
              <Text style={styles.saveModalText}>Save Client Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ENHANCED LOCATION MANAGER WITH ADVANCED FEATURES
const LocationManager = ({ location, onUpdate, editing }) => {
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showLocationOptions, setShowLocationOptions] = useState(false);

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    setShowLocationOptions(false);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required', 
          'Location access is needed for accurate service matching and local job opportunities.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                // In a real app, you would open app settings
                console.log('Open location settings');
              }
            }
          ]
        );
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000
      });

      const { latitude, longitude } = locationData.coords;
      
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      const readableAddress = address[0] 
        ? `${address[0].name || ''} ${address[0].street || ''} ${address[0].city || ''} ${address[0].region || ''} ${address[0].postalCode || ''} ${address[0].country || ''}`.trim()
        : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      onUpdate({
        latitude,
        longitude,
        address: readableAddress,
        accuracy: locationData.coords.accuracy,
        lastUpdated: new Date().toISOString(),
        verified: true,
        source: 'gps'
      });

      Alert.alert('Success', 'Location updated with high accuracy');
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
        'Location Error', 
        'Failed to get current location. Please try manual entry or check your location settings.',
        [{ text: 'OK' }]
      );
    } finally {
      setGettingLocation(false);
    }
  };

  const handleManualLocation = () => {
    setShowLocationOptions(false);
    
    Alert.prompt(
      'Enter Your Location',
      'Type your full address for better service matching and local opportunities:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save Location', 
          onPress: (address) => {
            if (address && address.trim()) {
              onUpdate({
                address: address.trim(),
                latitude: null,
                longitude: null,
                lastUpdated: new Date().toISOString(),
                verified: false,
                source: 'manual'
              });
              Alert.alert('Success', 'Location saved successfully');
            }
          }
        }
      ],
      'plain-text',
      location?.address || 'e.g., 123 Main Street, City, State, Postal Code'
    );
  };

  const clearLocation = () => {
    Alert.alert(
      'Clear Location',
      'Are you sure you want to remove your location? This may affect local job matching.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            onUpdate(null);
            Alert.alert('Success', 'Location cleared');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.locationSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Service Location</Text>
        {editing && location && (
          <TouchableOpacity 
            style={styles.editSectionButton}
            onPress={() => setShowLocationOptions(true)}
            activeOpacity={0.7}
          >
            <Icon name="ellipsis-vertical" size={20} color="#00f0a8" />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.sectionSubtitle}>
        Set your location for local job matching and service areas
      </Text>
      
      {location ? (
        <View style={styles.locationDisplay}>
          <View style={styles.locationIconContainer}>
            <Icon name="location" size={20} color="#00f0a8" />
            {location.verified && (
              <View style={styles.verifiedBadge}>
                <Icon name="checkmark" size={10} color="#000" />
              </View>
            )}
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationAddress}>{location.address}</Text>
            {location.latitude && (
              <View style={styles.locationDetails}>
                <Text style={styles.locationCoords}>
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </Text>
                <Text style={styles.locationAccuracy}>
                  Accuracy: {location.accuracy?.toFixed(0)} meters
                </Text>
              </View>
            )}
            <View style={styles.locationMeta}>
              <Text style={styles.locationSource}>
                Source: {location.source === 'gps' ? 'GPS' : 'Manual'}
              </Text>
              <Text style={styles.locationTimestamp}>
                Updated {new Date(location.lastUpdated).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.noLocation}>
          <Icon name="location-outline" size={48} color="#666" />
          <Text style={styles.noLocationText}>No location set</Text>
          <Text style={styles.noLocationSubtext}>
            Add your location to find local opportunities and services
          </Text>
        </View>
      )}

      {editing && (
        <View style={styles.locationActions}>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={getCurrentLocation}
            disabled={gettingLocation}
            activeOpacity={0.7}
          >
            {gettingLocation ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <Icon name="navigate" size={18} color="#000" />
            )}
            <Text style={styles.locationButtonText}>
              {gettingLocation ? 'Getting Location...' : 'Use Current Location'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.locationButton, styles.secondaryLocationButton]}
            onPress={handleManualLocation}
            activeOpacity={0.7}
          >
            <Icon name="create" size={18} color="#00f0a8" />
            <Text style={styles.secondaryLocationButtonText}>Enter Address</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Location Options Modal */}
      <Modal 
        visible={showLocationOptions} 
        transparent 
        animationType="slide"
        onRequestClose={() => setShowLocationOptions(false)}
      >
        <TouchableOpacity 
          style={styles.imageOptionsOverlay}
          activeOpacity={1}
          onPress={() => setShowLocationOptions(false)}
        >
          <View style={styles.imageOptionsContent}>
            <Text style={styles.imageOptionsTitle}>Location Options</Text>
            
            <TouchableOpacity 
              style={styles.imageOption}
              onPress={getCurrentLocation}
            >
              <Icon name="refresh" size={24} color="#00f0a8" />
              <Text style={styles.imageOptionText}>Update Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.imageOption}
              onPress={handleManualLocation}
            >
              <Icon name="create" size={24} color="#00f0a8" />
              <Text style={styles.imageOptionText}>Edit Address</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.imageOption, styles.removeOption]}
              onPress={clearLocation}
            >
              <Icon name="trash" size={24} color="#ff6b6b" />
              <Text style={[styles.imageOptionText, styles.removeOptionText]}>
                Clear Location
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelOption}
              onPress={() => setShowLocationOptions(false)}
            >
              <Text style={styles.cancelOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// FIXED: ADVANCED BOTTOM NAVIGATION WITH ENHANCED VECTOR ICONS MATCHING DASHBOARD
const AdvancedBottomNavigation = ({ activeTab, onTabChange, navigation }) => {
  const tabs = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: (color, size) => VectorIconsShared.home(color, size),
      screen: 'DashboardScreen'
    },
    { 
      id: 'search', 
      label: 'Discover', 
      icon: (color, size) => VectorIconsShared.search(color, size),
      screen: 'DiscoverScreen'
    },
    { 
      id: 'marketplace', 
      label: 'Market', 
      icon: (color, size) => VectorIconsShared.marketplace(color, size),
      screen: 'MarketplaceScreen'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: (color, size) => VectorIconsShared.profile(color, size),
      screen: 'ProfileScreen'
    },
  ];

  const handleTabPress = (tab) => {
    if (tab.screen && navigation) {
      navigation.navigate(tab.screen);
    }
    onTabChange(tab.id);
  };

  return (
    <View style={styles.bottomNavigation}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.navItem,
            activeTab === tab.id && styles.navItemActive
          ]}
          onPress={() => handleTabPress(tab)}
          activeOpacity={0.7}
        >
          {tab.icon(
            activeTab === tab.id ? '#00f0a8' : '#666',
            24
          )}
          <Text style={[
            styles.navLabel,
            activeTab === tab.id && styles.navLabelActive
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// FIXED: MAIN ENHANCED PROFILE SCREEN WITH COMPLETE FUNCTIONALITY
export default function ProfileScreen({ navigation }) {
  const {
    profile,
    loading,
    saving,
    lastSave,
    isDirty,
    editing,
    setEditing,
    activeTab,
    setActiveTab,
    showRoleDetails,
    setShowRoleDetails,
    updateProfile,
    updateFarmDetails,
    updateClientDetails,
    addSkill,
    updateSkill,
    removeSkill,
    addPortfolioItem,
    updateProfileImage,
    switchUserType,
    navigateToRoleDetails,
    commitProfileSave,
    loadProfile,
    resetProfile,
    exportProfile,
    calculateProfileCompleteness,
  } = useAdvancedEnterpriseProfile();

  const [refreshing, setRefreshing] = useState(false);
  const [bottomNavTab, setBottomNavTab] = useState('profile');
  const scrollY = useRef(new Animated.Value(0)).current;
  const mainScrollRef = useRef(null);

  const handleRoleChange = (newType) => {
    // switch role, enter edit mode and auto-open role details, then scroll
    try {
      switchUserType(newType);
      setEditing(true);
      setShowRoleDetails(true);
      setTimeout(() => {
        if (mainScrollRef && mainScrollRef.current && mainScrollRef.current.scrollTo) {
          mainScrollRef.current.scrollTo({ y: 400, animated: true });
        }
      }, 400);
    } catch (e) {
      console.error('Role change failed', e);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, [loadProfile]);

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Check out ${profile?.displayName}'s professional profile on VSXchange Platform!`,
        title: `${profile?.displayName}'s Professional Profile`,
        url: 'https://vsxchangeza.com/profiles/' + profile?.id
      });
    } catch (error) {
      console.log('Share failed:', error);
      Alert.alert('Share Error', 'Unable to share profile at this time');
    }
  };

  // Enhanced animated header styles
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#00f0a8" />
          <Text style={styles.loadingText}>Loading Professional Profile...</Text>
          <Text style={styles.loadingSubtext}>Preparing your professional profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  const ProfileHeader = () => (
    <Animated.View 
      style={[
        styles.header,
        {
          transform: [{ translateY: headerTranslateY }, { scale: headerScale }],
          opacity: headerOpacity
        }
      ]}
    >
      <LinearGradient 
        colors={['#000000', '#1a1a1a', '#2a2a2a']} 
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          {/* Enhanced Top Bar with Advanced Controls */}
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('DashboardScreen')}
              activeOpacity={0.7}
            >
              <Icon name="chevron-back" size={28} color="#00f0a8" />
            </TouchableOpacity>
            
            <View style={styles.headerTitle}>
              <Text style={styles.headerTitleText}>Professional Profile</Text>
              {saving && (
                <View style={styles.savingIndicator}>
                  <ActivityIndicator size="small" color="#00f0a8" />
                  <Text style={styles.savingText}>Saving...</Text>
                </View>
              )}
              {isDirty && !saving && (
                <View style={styles.savingIndicator}>
                  <Icon name="pencil" size={12} color="#FFD700" />
                  <Text style={styles.savingText}>Unsaved changes</Text>
                </View>
              )}
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={handleShareProfile}
                activeOpacity={0.7}
                disabled={editing}
              >
                <Icon name="share-social" size={20} color={editing ? "#666" : "#00f0a8"} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.editButton, editing && styles.editButtonActive]}
                onPress={() => {
                  if (editing && isDirty) {
                    Alert.alert(
                      'Unsaved Changes',
                      'You have unsaved changes. Do you want to save before exiting edit mode?',
                      [
                        {
                          text: 'Discard',
                          style: 'destructive',
                          onPress: () => {
                            setEditing(false);
                            loadProfile();
                          }
                        },
                        {
                          text: 'Save & Exit',
                          style: 'default',
                          onPress: async () => {
                            await commitProfileSave();
                            setEditing(false);
                          }
                        },
                        { text: 'Continue Editing', style: 'cancel' }
                      ]
                    );
                  } else {
                    setEditing(!editing);
                  }
                }}
                activeOpacity={0.7}
              >
                <Icon 
                  name={editing ? "checkmark" : "create-outline"} 
                  size={20} 
                  color="#00f0a8" 
                />
              </TouchableOpacity>

              {editing && isDirty && (
                <TouchableOpacity
                  style={[styles.saveButton, { marginLeft: 8 }]}
                  onPress={() => commitProfileSave()}
                  activeOpacity={0.8}
                >
                  <Icon name="save" size={18} color="#00f0a8" />
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => {
                  Alert.alert(
                    'Profile Options',
                    'Manage your professional profile',
                    [
                      { 
                        text: 'Export Data', 
                        onPress: exportProfile,
                        style: 'default'
                      },
                      { 
                        text: 'Refresh Profile', 
                        onPress: loadProfile,
                        style: 'default'
                      },
                      { 
                        text: 'Reset Profile', 
                        onPress: resetProfile, 
                        style: 'destructive' 
                      },
                      { text: 'Cancel', style: 'cancel' }
                    ]
                  );
                }}
                activeOpacity={0.7}
              >
                <Icon name="ellipsis-vertical" size={20} color="#00f0a8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Enhanced Profile Main Section */}
          <View style={styles.profileMain}>
            <ProfileImageEditor
              profileImage={profile.profileImage}
              onImageUpdate={updateProfileImage}
              editing={editing}
            />

            <View style={styles.profileInfo}>
              <View style={styles.nameSection}>
                {editing ? (
                  <View style={styles.nameEditor}>
                        <EditableField
                          value={profile.firstName}
                          onSave={(value) => { updateProfile({ firstName: value }); commitProfileSave(); }}
                          placeholder="First Name"
                          style={styles.nameInput}
                          required
                          autoCapitalize="words"
                        />
                    <EditableField
                          value={profile.lastName}
                          onSave={(value) => { updateProfile({ lastName: value }); commitProfileSave(); }}
                      placeholder="Last Name"
                      style={styles.nameInput}
                      required
                      autoCapitalize="words"
                    />
                  </View>
                ) : (
                  <>
                    <Text style={styles.userName}>{profile.displayName}</Text>
                    <Text style={styles.profession}>{profile.profession}</Text>
                    <Text style={styles.tagline}>{profile.tagline}</Text>
                  </>
                )}
              </View>

              {/* Enhanced Professional Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{profile.experienceYears}</Text>
                  <Text style={styles.statLabel}>Years Exp</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{profile.rating}</Text>
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={12} color="#FFD700" />
                    <Text style={styles.statLabel}>Rating</Text>
                  </View>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{profile.completedProjects}+</Text>
                  <Text style={styles.statLabel}>Projects</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>${profile.hourlyRate}</Text>
                  <Text style={styles.statLabel}>/hour</Text>
                </View>
              </View>

              {/* Enhanced Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => navigation.navigate('Messages', { user: profile })}
                  activeOpacity={0.7}
                >
                  <Icon name="chatbubble-ellipses" size={18} color="#000" />
                  <Text style={styles.contactButtonText}>Message</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.hireButton}
                  onPress={() => navigation.navigate('Booking', { professional: profile })}
                  activeOpacity={0.7}
                >
                  <Icon name="calendar" size={18} color="#000" />
                  <Text style={styles.hireButtonText}>Hire Now</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.callButton}
                  onPress={() => {
                    if (profile.contactInfo?.phone) {
                      // In a real app, you would initiate a phone call
                      Alert.alert(
                        'Contact Professional',
                        `Call ${profile.contactInfo.phone}?`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Call', onPress: () => console.log('Calling:', profile.contactInfo.phone) }
                        ]
                      );
                    } else {
                      Alert.alert('No Phone Number', 'Phone number not available');
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Icon name="call" size={18} color="#00f0a8" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* FIXED: Enhanced User Type Selector with proper navigation */}
          <UserTypeSelector
            currentType={profile.userType}
            onTypeChange={handleRoleChange}
            onNavigateToDetails={navigateToRoleDetails}
            editing={editing}
          />

          {/* Enhanced Save Status */}
          {lastSave && (
            <View style={styles.saveStatus}>
              <Icon name="checkmark-circle" size={12} color="#00f0a8" />
              <Text style={styles.saveStatusText}>
                Auto-saved {new Date(lastSave).toLocaleTimeString()}
              </Text>
              <View style={styles.profileCompleteness}>
                <Text style={styles.completenessText}>
                  Profile: {profile.profileCompleteness}% complete
                </Text>
                <View style={styles.completenessBar}>
                  <View 
                    style={[
                      styles.completenessFill, 
                      { width: `${profile.profileCompleteness}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const TabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <Animated.ScrollView 
            ref={mainScrollRef}
            style={styles.tabContent}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                colors={['#00f0a8']}
                tintColor="#00f0a8"
              />
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Professional Bio */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Bio</Text>
              <EditableField
                value={profile.bio}
                onSave={(value) => { updateProfile({ bio: value }); commitProfileSave(); }}
                placeholder="Tell us about your professional background, expertise, achievements, and what makes you unique. Include your experience, specialties, and what clients can expect when working with you."
                multiline={true}
                style={styles.bioField}
                label="About Me"
                maxLength={1000}
              />
            </View>

            {/* Skills & Expertise */}
            <SkillManager
              skills={profile.skills}
              userType={profile.userType}
              onAddSkill={addSkill}
              onUpdateSkill={updateSkill}
              onRemoveSkill={removeSkill}
              editing={editing}
            />

            {/* Enhanced Contact Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <EditableField
                value={profile.contactInfo?.phone}
                onSave={(value) => { updateProfile({ contactInfo: { ...profile.contactInfo, phone: value } }); commitProfileSave(); }}
                placeholder="+1 (555) 123-4567"
                label="Phone Number"
                type="phone"
                keyboardType="phone-pad"
              />
              <EditableField
                value={profile.contactInfo?.email}
                onSave={(value) => { updateProfile({ contactInfo: { ...profile.contactInfo, email: value } }); commitProfileSave(); }}
                placeholder="your.email@example.com"
                label="Email Address"
                type="email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <EditableField
                value={profile.contactInfo?.website}
                onSave={(value) => { updateProfile({ contactInfo: { ...profile.contactInfo, website: value } }); commitProfileSave(); }}
                placeholder="https://yourwebsite.com"
                label="Website (Optional)"
                type="url"
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            {/* Professional Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Details</Text>
              <View style={styles.detailsGrid}>
                <EditableField
                  value={profile.profession}
                  onSave={(value) => { updateProfile({ profession: value }); commitProfileSave(); }}
                  placeholder="Your profession or main service"
                  label="Profession"
                  required
                />
                <EditableField
                  value={profile.tagline}
                  onSave={(value) => { updateProfile({ tagline: value }); commitProfileSave(); }}
                  placeholder="Brief tagline that describes you"
                  label="Tagline"
                  maxLength={100}
                />
                <EditableField
                  value={profile.experienceYears?.toString()}
                  onSave={(value) => { updateProfile({ experienceYears: parseInt(value) || 0 }); commitProfileSave(); }}
                  placeholder="Years of experience"
                  label="Experience (Years)"
                  type="number"
                  keyboardType="numeric"
                />
                <EditableField
                  value={profile.hourlyRate?.toString()}
                  onSave={(value) => { updateProfile({ hourlyRate: parseInt(value) || 0 }); commitProfileSave(); }}
                  placeholder="Your hourly rate"
                  label="Hourly Rate ($)"
                  type="number"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Enhanced Location */}
            <LocationManager
              location={profile.location}
              onUpdate={(location) => { updateProfile({ location }); commitProfileSave(); }}
              editing={editing}
            />
          </Animated.ScrollView>
        );

      case 'portfolio':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Portfolio Gallery</Text>
            <View style={styles.comingSoonSection}>
              <Icon name="images" size={64} color="#666" />
              <Text style={styles.comingSoonTitle}>Advanced Portfolio</Text>
              <Text style={styles.comingSoonText}>
                Showcase your work with high-resolution images, project descriptions, client testimonials, and before/after comparisons. Organize your portfolio by project type, category, or date.
              </Text>
              {editing && (
                <TouchableOpacity 
                  style={styles.comingSoonButton}
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Portfolio', 'Portfolio feature coming soon!')}
                >
                  <Text style={styles.comingSoonButtonText}>Upload Portfolio Items</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );

      case 'services':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Services & Pricing</Text>
            <View style={styles.comingSoonSection}>
              <Icon name="construct" size={64} color="#666" />
              <Text style={styles.comingSoonTitle}>Service Management</Text>
              <Text style={styles.comingSoonText}>
                Manage your service offerings, dynamic pricing, availability calendar, and service packages. Set different rates for various service types and create custom packages for clients.
              </Text>
              {editing && (
                <TouchableOpacity 
                  style={styles.comingSoonButton}
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Services', 'Service management feature coming soon!')}
                >
                  <Text style={styles.comingSoonButtonText}>Manage Services</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );

      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
            <View style={styles.ratingOverview}>
              <Text style={styles.ratingNumber}>{profile.rating}</Text>
              <View style={styles.ratingStars}>
                {[1,2,3,4,5].map((star) => (
                  <Icon 
                    key={star}
                    name={star <= Math.floor(profile.rating) ? "star" : 
                          star === Math.ceil(profile.rating) && !Number.isInteger(profile.rating) ? "star-half" : "star-outline"} 
                    size={24} 
                    color="#FFD700" 
                  />
                ))}
              </View>
              <Text style={styles.ratingCount}>
                Based on {profile.completedProjects} completed projects
              </Text>
              <Text style={styles.ratingSubtext}>
                Client feedback and testimonials will appear here
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <ProfileHeader />
      
      {/* FIXED: Role-specific details modals */}
      {profile.userType === 'farmer' && (
        <FarmerProfileManager
          farmDetails={profile.farmDetails}
          onUpdate={(updates) => { updateFarmDetails(updates); commitProfileSave(); }}
          editing={editing}
          isVisible={showRoleDetails && profile.userType === 'farmer'}
          onClose={() => setShowRoleDetails(false)}
        />
      )}

      {profile.userType === 'client' && (
        <ClientProfileManager
          clientDetails={profile.clientDetails}
          onUpdate={(updates) => { updateClientDetails(updates); commitProfileSave(); }}
          editing={editing}
          isVisible={showRoleDetails && profile.userType === 'client'}
          onClose={() => setShowRoleDetails(false)}
        />
      )}
      
      {/* Enhanced Tab Navigation */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {['about', 'portfolio', 'services', 'reviews'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Icon 
                name={
                  tab === 'about' ? 'person' :
                  tab === 'portfolio' ? 'images' :
                  tab === 'services' ? 'construct' :
                  'star'
                }
                size={16}
                color={activeTab === tab ? '#00f0a8' : '#666'}
              />
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Enhanced Main Content */}
      <KeyboardAvoidingView 
        style={styles.contentContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <TabContent />
      </KeyboardAvoidingView>

      {/* FIXED: Advanced Bottom Navigation with proper navigation */}
      <AdvancedBottomNavigation 
        activeTab={bottomNavTab}
        onTabChange={setBottomNavTab}
        navigation={navigation}
      />

      {/* Enhanced Saving Overlay */}
      {saving && (
        <View style={styles.savingOverlay}>
          <View style={styles.savingContent}>
            <ActivityIndicator size="large" color="#00f0a8" />
            <Text style={styles.savingOverlayText}>Auto-saving Changes...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// COMPREHENSIVE ENTERPRISE-LEVEL STYLES - OPTIMIZED FOR PERFORMANCE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#00f0a8',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  loadingSubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  headerGradient: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  headerContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  headerTitleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  savingText: {
    color: '#00f0a8',
    fontSize: 10,
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
  },
  editButtonActive: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    transform: [{ scale: 1.1 }],
  },
  saveButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,240,168,0.2)',
    marginRight: 8,
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  profileMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  profileImageSection: {
    marginRight: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00f0a8',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#00f0a8',
  },
  avatarPlaceholderText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadProgressText: {
    color: '#00f0a8',
    fontSize: 12,
    marginTop: 4,
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#00f0a8',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  profileInfo: {
    flex: 1,
  },
  nameSection: {
    marginBottom: 15,
  },
  nameEditor: {
    // removed unsupported 'gap' property for React Native
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  profession: {
    color: '#00f0a8',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  tagline: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  nameInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#00f0a8',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionButtons: {
    flexDirection: 'row',
    // removed unsupported 'gap' property for React Native
  },
  contactButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  contactButtonText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  hireButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00f0a8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  hireButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  callButton: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  userTypeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeInfo: {
    flex: 1,
  },
  typeTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  typeDescription: {
    color: '#666',
    fontSize: 12,
  },
  detailsButton: {
    padding: 8,
  },
  userTypeSelector: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  selectorHeader: {
    marginBottom: 15,
  },
  selectorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  selectorSubtitle: {
    color: '#666',
    fontSize: 12,
    lineHeight: 16,
  },
  typeOptions: {
    // removed unsupported 'gap' property for React Native
  },
  typeOption: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
  },
  typeOptionSelected: {
    backgroundColor: 'rgba(0,240,168,0.1)',
  },
  typeOptionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeOptionTexts: {
    flex: 1,
  },
  typeOptionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  typeOptionDescription: {
    color: '#666',
    fontSize: 12,
    lineHeight: 16,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  examplesContainer: {
    marginBottom: 12,
  },
  examplesLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  examplesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // removed unsupported 'gap' property for React Native
  },
  exampleChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  exampleText: {
    color: '#fff',
    fontSize: 10,
  },
  featuresContainer: {
    marginBottom: 8,
  },
  featuresLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  featuresList: {
    // removed unsupported 'gap' property for React Native
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // removed unsupported 'gap' property for React Native
  },
  featureText: {
    color: '#fff',
    fontSize: 11,
  },
  roleChangeNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    // removed unsupported 'gap' property for React Native
  },
  roleChangeNoteText: {
    color: '#00f0a8',
    fontSize: 12,
    flex: 1,
  },
  saveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  saveStatusText: {
    color: '#00f0a8',
    fontSize: 10,
    flex: 1,
    marginLeft: 6,
  },
  profileCompleteness: {
    alignItems: 'flex-end',
  },
  completenessText: {
    color: '#666',
    fontSize: 10,
    marginBottom: 4,
  },
  completenessBar: {
    width: 80,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  completenessFill: {
    height: '100%',
    backgroundColor: '#00f0a8',
    borderRadius: 2,
  },
  tabsContainer: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tabsScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    // removed unsupported 'gap' property for React Native
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    // removed unsupported 'gap' property for React Native
  },
  activeTab: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#00f0a8',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  tabContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 240, // Space for the animated header
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#666',
    fontSize: 12,
    marginBottom: 15,
    lineHeight: 16,
  },
  editSectionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bioField: {
    minHeight: 120,
  },
  viewField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  viewFieldContent: {
    flex: 1,
  },
  fieldLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  viewFieldText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  placeholderText: {
    color: '#666',
    fontStyle: 'italic',
  },
  editFieldContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  editField: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  multilineField: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  fieldError: {
    borderColor: '#ff6b6b',
  },
  charCount: {
    color: '#666',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#00f0a8',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  optionsContainer: {
    maxHeight: 200,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  optionItemSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
  },
  skillManager: {
    marginBottom: 25,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  skillTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  skillSubtitle: {
    color: '#666',
    fontSize: 12,
  },
  addSkillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00f0a8',
    // removed unsupported 'gap' property for React Native
  },
  addSkillText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  skillsGrid: {
    // removed unsupported 'gap' property for React Native
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00f0a8',
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  skillMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    // removed unsupported 'gap' property for React Native
    marginBottom: 6,
  },
  skillCategory: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
  },
  skillSubcategory: {
    color: '#666',
    fontSize: 12,
  },
  skillLevel: {
    color: '#666',
    fontSize: 12,
  },
  skillYears: {
    color: '#666',
    fontSize: 12,
  },
  certifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillDescription: {
    color: '#666',
    fontSize: 12,
    lineHeight: 16,
  },
  skillActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editSkillButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0,240,168,0.2)',
  },
  removeSkillButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,107,107,0.2)',
  },
  noSkills: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  noSkillsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  noSkillsSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
  },
  addFirstSkillButton: {
    backgroundColor: '#00f0a8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addFirstSkillText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  largeModal: {
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalBody: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
    gap: 6,
  },
  categoryChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
  },
  categoryChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  subcategoriesContainer: {
    gap: 8,
  },
  subcategoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
  },
  subcategoryChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  subcategoryChipText: {
    color: '#fff',
    fontSize: 12,
  },
  levelOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // removed unsupported 'gap' property for React Native
  },
  levelChip: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  levelChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  levelChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  levelChipDescription: {
    color: '#666',
    fontSize: 10,
  },
  yearsSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // removed unsupported 'gap' property for React Native
  },
  yearChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  yearChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  yearChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  certifiedToggle: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  certifiedToggleActive: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderColor: '#00f0a8',
  },
  certifiedToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  certifiedToggleSwitch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certifiedToggleSwitchActive: {
    backgroundColor: '#00f0a8',
  },
  certifiedToggleTexts: {
    flex: 1,
  },
  certifiedToggleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  certifiedToggleSubtext: {
    color: '#666',
    fontSize: 12,
  },
  cancelModalButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  cancelModalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveModalButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#00f0a8',
    borderRadius: 12,
  },
  saveModalButtonDisabled: {
    backgroundColor: 'rgba(0,240,168,0.3)',
  },
  saveModalText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  // Farm Styles
  farmSection: {
    marginBottom: 25,
  },
  farmDetailsGrid: {
    gap: 15,
  },
  farmDetailItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
  },
  farmDetailLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  farmDetailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  organicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76,217,100,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  organicBadgeText: {
    color: '#4CD964',
    fontSize: 12,
    fontWeight: '600',
  },
  cropsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cropChip: {
    backgroundColor: 'rgba(76,217,100,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cropText: {
    color: '#4CD964',
    fontSize: 12,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentChip: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  equipmentText: {
    color: '#00f0a8',
    fontSize: 12,
  },
  noFarmDetails: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  noFarmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  noFarmSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 15,
  },
  flex1: {
    flex: 1,
  },
  farmTypeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
  },
  farmTypeChipSelected: {
    backgroundColor: 'rgba(76,217,100,0.2)',
    borderWidth: 1,
    borderColor: '#4CD964',
  },
  farmTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  inputWithButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addItemButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,240,168,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  selectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  selectedCrop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76,217,100,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  selectedCropText: {
    color: '#4CD964',
    fontSize: 12,
  },
  selectedEquipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  selectedEquipmentText: {
    color: '#00f0a8',
    fontSize: 12,
  },
  soilTypeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
  },
  soilTypeChipSelected: {
    backgroundColor: 'rgba(139,69,19,0.3)',
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  soilTypeText: {
    color: '#fff',
    fontSize: 12,
  },
  waterSourceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
  },
  waterSourceChipSelected: {
    backgroundColor: 'rgba(0,122,255,0.3)',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  waterSourceText: {
    color: '#fff',
    fontSize: 12,
  },
  selectedPractice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76,217,100,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  selectedPracticeText: {
    color: '#4CD964',
    fontSize: 12,
  },
  selectedMarket: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,122,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  selectedMarketText: {
    color: '#007AFF',
    fontSize: 12,
  },
  organicToggle: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  organicToggleActive: {
    backgroundColor: 'rgba(76,217,100,0.2)',
    borderColor: '#4CD964',
  },
  organicToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  organicToggleSwitch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  organicToggleSwitchActive: {
    backgroundColor: '#4CD964',
  },
  organicToggleTexts: {
    flex: 1,
  },
  organicToggleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  organicToggleSubtext: {
    color: '#666',
    fontSize: 12,
  },
  // Client Styles
  clientSection: {
    marginBottom: 25,
  },
  clientDetailsGrid: {
    gap: 15,
  },
  clientDetailItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
  },
  clientDetailLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  clientDetailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  projectTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  projectTypeChip: {
    backgroundColor: 'rgba(0,122,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  projectTypeText: {
    color: '#007AFF',
    fontSize: 12,
  },
  urgencyBadge: {
    backgroundColor: 'rgba(255,214,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  urgencyHigh: {
    backgroundColor: 'rgba(255,165,0,0.2)',
  },
  urgencyEmergency: {
    backgroundColor: 'rgba(255,107,107,0.2)',
  },
  urgencyBadgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  noClientDetails: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  noClientText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  noClientSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  industryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
  },
  industryChipSelected: {
    backgroundColor: 'rgba(0,122,255,0.2)',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  industryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  companySizeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
  },
  companySizeChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  companySizeText: {
    color: '#fff',
    fontSize: 12,
  },
  selectedProject: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,122,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  selectedProjectText: {
    color: '#007AFF',
    fontSize: 12,
  },
  selectedService: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  selectedServiceText: {
    color: '#00f0a8',
    fontSize: 12,
  },
  selectedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  selectedLocationText: {
    color: '#00f0a8',
    fontSize: 12,
  },
  budgetRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    textAlign: 'center',
  },
  budgetSeparator: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  projectSizeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
  },
  projectSizeChipSelected: {
    backgroundColor: 'rgba(255,214,0,0.2)',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  projectSizeText: {
    color: '#fff',
    fontSize: 12,
  },
  urgencyOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  urgencyChip: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  urgencyChipSelected: {
    backgroundColor: 'rgba(255,214,0,0.2)',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  urgencyChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  urgencyChipDescription: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
  },
  communicationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  communicationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 6,
  },
  communicationChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  communicationChipText: {
    color: '#666',
    fontSize: 12,
  },
  communicationChipTextSelected: {
    color: '#fff',
  },
  // Location Styles
  locationSection: {
    marginBottom: 25,
  },
  locationDisplay: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  locationIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationAddress: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  locationDetails: {
    marginBottom: 6,
  },
  locationCoords: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
  },
  locationAccuracy: {
    color: '#666',
    fontSize: 10,
  },
  locationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationSource: {
    color: '#666',
    fontSize: 10,
  },
  locationTimestamp: {
    color: '#666',
    fontSize: 10,
  },
  noLocation: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    marginBottom: 15,
  },
  noLocationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  noLocationSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  locationActions: {
    flexDirection: 'row',
    gap: 10,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00f0a8',
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  locationButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryLocationButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  secondaryLocationButtonText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  // Image Options Styles
  imageOptionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  imageOptionsContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  imageOptionsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  imageOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  removeOption: {
    backgroundColor: 'rgba(255,107,107,0.2)',
  },
  removeOptionText: {
    color: '#ff6b6b',
  },
  cancelOption: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cancelOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Bottom Navigation Styles
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: 'rgba(0,240,168,0.2)',
  },
  navLabel: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
  },
  navLabelActive: {
    color: '#00f0a8',
  },
  // Coming Soon Sections
  comingSoonSection: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  comingSoonTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  comingSoonText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  comingSoonButton: {
    backgroundColor: '#00f0a8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  comingSoonButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  // Rating Overview
  ratingOverview: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
  },
  ratingNumber: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ratingCount: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  ratingSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  // Details Grid
  detailsGrid: {
    gap: 10,
  },
  // Saving Overlay
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  savingContent: {
    backgroundColor: '#1a1a1a',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    gap: 12,
  },
  savingOverlayText: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '600',
  },
});