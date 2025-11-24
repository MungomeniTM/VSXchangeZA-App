// src/screens/AdvancedEnterprisePlatform.js
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

const { width, height } = Dimensions.get('window');

// ENHANCED VECTOR ICONS SYSTEM - COMPLETE DASHBOARD INTEGRATION
const VectorIcons = {
  // Bottom Navigation Icons - Perfect Dashboard Match
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

  // Professional Category Icons - Enhanced for Dashboard Consistency
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

  // Additional Dashboard Icons for Complete Integration
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

  settings: (color = '#666', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M19.4 15C19.2662 15.3052 19.1945 15.6356 19.1895 15.9708C19.1845 16.3061 19.2463 16.6386 19.3707 16.948C19.4951 17.2574 19.6793 17.537 19.9118 17.7695C20.1443 18.002 20.4239 18.1862 20.7333 18.3106C21.0427 18.435 21.3752 18.4968 21.7105 18.4918C22.0457 18.4868 22.3761 18.4151 22.6813 18.2813C22.7659 18.2413 22.8406 18.1832 22.9 18.1113L22.9 18.1113C22.9666 18.0308 23 17.9293 23 17.8245V15.1755C23 15.0707 22.9666 14.9692 22.9 14.8887C22.8406 14.8168 22.7659 14.7587 22.6813 14.7187C22.3761 14.5849 22.0457 14.5132 21.7105 14.5082C21.3752 14.5032 21.0427 14.565 20.7333 14.6894C20.4239 14.8138 20.1443 14.998 19.9118 15.2305C19.6793 15.463 19.4951 15.7426 19.3707 16.052C19.2463 16.3614 19.1845 16.6939 19.1895 17.0292C19.1945 17.3644 19.2662 17.6948 19.4 18" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M4.6 15C4.73375 15.3052 4.80552 15.6356 4.81052 15.9708C4.81552 16.3061 4.75367 16.6386 4.62927 16.948C4.50487 17.2574 4.3207 17.537 4.0882 17.7695C3.8557 18.002 3.57606 18.1862 3.26667 18.3106C2.95728 18.435 2.62482 18.4968 2.28955 18.4918C1.95428 18.4868 1.62388 18.4151 1.31867 18.2813C1.23406 18.2413 1.15941 18.1832 1.1 18.1113L1.1 18.1113C1.03342 18.0308 1 17.9293 1 17.8245V15.1755C1 15.0707 1.03342 14.9692 1.1 14.8887C1.15941 14.8168 1.23406 14.7587 1.31867 14.7187C1.62388 14.5849 1.95428 14.5132 2.28955 14.5082C2.62482 14.5032 2.95728 14.565 3.26667 14.6894C3.57606 14.8138 3.8557 14.998 4.0882 15.2305C4.3207 15.463 4.50487 15.7426 4.62927 16.052C4.75367 16.3614 4.81552 16.6939 4.81052 17.0292C4.80552 17.3644 4.73375 17.6948 4.6 18" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )
};

// FIXED ENTERPRISE STATE MANAGEMENT WITH ROLE NAVIGATION
const useAdvancedEnterpriseProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSave, setLastSave] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showRoleExamples, setShowRoleExamples] = useState(false);
  const [selectedRoleForExamples, setSelectedRoleForExamples] = useState(null);
  const saveTimeoutRef = useRef(null);

  // Enhanced default profile with role navigation capability
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
      email: 'james.carter@example.com'
    },
    skills: [
      {
        id: 'skill_1',
        name: 'Electrical Wiring',
        category: 'electrical',
        subcategory: 'Residential Wiring',
        level: 'expert',
        years: 8,
        certified: true
      }
    ],
    services: [],
    portfolio: [],
    certifications: [],
    availability: {
      monday: { available: true, start: '09:00', end: '18:00' },
      tuesday: { available: true, start: '09:00', end: '18:00' },
      wednesday: { available: true, start: '09:00', end: '18:00' },
      thursday: { available: true, start: '09:00', end: '18:00' },
      friday: { available: true, start: '09:00', end: '17:00' },
      saturday: { available: false, start: '00:00', end: '00:00' },
      sunday: { available: false, start: '00:00', end: '00:00' }
    },
    // Enhanced role-specific details with navigation capability
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
      harvestSeasons: []
    },
    clientDetails: {
      companyName: '',
      industry: '',
      projectTypes: [],
      serviceNeeds: [],
      budgetRange: { min: 0, max: 0 },
      timeline: '',
      locationPreferences: [],
      projectSize: '',
      preferredSkills: []
    },
    isAvailable: true,
    lastUpdated: new Date().toISOString(),
    profileCompleteness: 85,
    metadata: {
      created: new Date().toISOString(),
      version: '2.0.0',
      syncEnabled: true
    }
  };

  // Load profile function
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem('advanced_enterprise_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
      } else {
        setProfile(defaultProfile);
        await AsyncStorage.setItem('advanced_enterprise_profile', JSON.stringify(defaultProfile));
      }
    } catch (error) {
      console.error('Load failed:', error);
      setProfile(defaultProfile);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save profile function
  const saveProfile = useCallback(async (newProfile) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        const profileToSave = newProfile || profile;
        const timestamp = new Date().toISOString();
        
        await AsyncStorage.setItem('advanced_enterprise_profile', JSON.stringify({
          ...profileToSave,
          lastUpdated: timestamp,
          metadata: {
            ...profileToSave.metadata,
            lastBackup: timestamp
          }
        }));

        setLastSave(timestamp);
      } catch (error) {
        console.error('Save error:', error);
      } finally {
        setSaving(false);
      }
    }, 800);
  }, [profile]);

  // Enhanced role switching with navigation triggers
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
      
      saveProfile(newProfile);
      return newProfile;
    });

    // Trigger role examples navigation when user type changes
    if (updates.userType && updates.userType !== profile?.userType) {
      setSelectedRoleForExamples(updates.userType);
      setShowRoleExamples(true);
    }
  }, [saveProfile, profile]);

  // Calculate profile completeness
  const calculateProfileCompleteness = (profileData) => {
    if (!profileData) return 0;
    
    let completeness = 0;
    const fields = [
      profileData.firstName,
      profileData.lastName,
      profileData.profession,
      profileData.bio,
      profileData.profileImage,
      profileData.location,
      profileData.skills?.length > 0
    ];

    const userTypeFields = {
      skilled: [profileData.skills?.length > 0],
      farmer: [profileData.farmDetails?.farmName, profileData.farmDetails?.farmType],
      client: [profileData.clientDetails?.companyName, profileData.clientDetails?.industry]
    };

    const baseScore = (fields.filter(Boolean).length / fields.length) * 70;
    const userTypeScore = (userTypeFields[profileData.userType]?.filter(Boolean).length / userTypeFields[profileData.userType]?.length) * 30 || 0;

    return Math.min(baseScore + userTypeScore, 100);
  };

  // Enhanced farm details update with navigation
  const updateFarmDetails = useCallback((updates) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        farmDetails: { ...prev.farmDetails, ...updates },
        lastUpdated: new Date().toISOString(),
        profileCompleteness: calculateProfileCompleteness({ ...prev, farmDetails: { ...prev.farmDetails, ...updates } })
      };
      saveProfile(newProfile);
      return newProfile;
    });
  }, [saveProfile]);

  // Enhanced client details update with navigation
  const updateClientDetails = useCallback((updates) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        clientDetails: { ...prev.clientDetails, ...updates },
        lastUpdated: new Date().toISOString(),
        profileCompleteness: calculateProfileCompleteness({ ...prev, clientDetails: { ...prev.clientDetails, ...updates } })
      };
      saveProfile(newProfile);
      return newProfile;
    });
  }, [saveProfile]);

  // Skill management
  const addSkill = useCallback((skill) => {
    const newSkill = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      added: new Date().toISOString(),
      ...skill
    };
    
    setProfile(prev => {
      const newProfile = {
        ...prev,
        skills: [...(prev.skills || []), newSkill],
        lastUpdated: new Date().toISOString(),
        profileCompleteness: calculateProfileCompleteness({ ...prev, skills: [...(prev.skills || []), newSkill] })
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

  // Profile image management
  const updateProfileImage = useCallback(async (imageUri) => {
    try {
      setProfile(prev => {
        const newProfile = {
          ...prev,
          profileImage: imageUri,
          lastUpdated: new Date().toISOString(),
          profileCompleteness: calculateProfileCompleteness({ ...prev, profileImage: imageUri })
        };
        saveProfile(newProfile);
        return newProfile;
      });
      return true;
    } catch (error) {
      console.error('Profile image update failed:', error);
      return false;
    }
  }, [saveProfile]);

  // Reset profile
  const resetProfile = useCallback(async () => {
    Alert.alert(
      'Reset Profile',
      'Are you sure you want to reset all profile data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setProfile(defaultProfile);
            await AsyncStorage.setItem('advanced_enterprise_profile', JSON.stringify(defaultProfile));
          }
        }
      ]
    );
  }, []);

  // Role examples navigation handler
  const handleRoleExamplesNavigation = (roleType) => {
    setSelectedRoleForExamples(roleType);
    setShowRoleExamples(true);
  };

  // Close role examples and navigate to appropriate editor
  const handleCloseRoleExamples = (selectedExample = null) => {
    if (selectedExample && selectedRoleForExamples) {
      // Navigate to appropriate editor based on selected example
      switch (selectedRoleForExamples) {
        case 'farmer':
          // Trigger farm details editor
          setTimeout(() => {
            Alert.alert('Farm Details', `You selected: ${selectedExample}. Now you can edit your farm details.`);
          }, 500);
          break;
        case 'client':
          // Trigger client details editor
          setTimeout(() => {
            Alert.alert('Client Details', `You selected: ${selectedExample}. Now you can edit your client information.`);
          }, 500);
          break;
        case 'skilled':
          // Trigger skills editor
          setTimeout(() => {
            Alert.alert('Professional Skills', `You selected: ${selectedExample}. Now you can add your professional skills.`);
          }, 500);
          break;
      }
    }
    setShowRoleExamples(false);
    setSelectedRoleForExamples(null);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    loading,
    saving,
    lastSave,
    editing,
    setEditing,
    activeTab,
    setActiveTab,
    showRoleExamples,
    setShowRoleExamples,
    selectedRoleForExamples,
    updateProfile,
    updateFarmDetails,
    updateClientDetails,
    addSkill,
    removeSkill,
    updateProfileImage,
    saveProfile,
    loadProfile,
    resetProfile,
    handleRoleExamplesNavigation,
    handleCloseRoleExamples,
    calculateProfileCompleteness
  };
};

// FIXED USER TYPE SELECTOR WITH ROLE NAVIGATION
const UserTypeSelector = ({ currentType, onTypeChange, editing, onRoleExamplesNavigation }) => {
  const userTypes = [
    {
      type: 'skilled',
      icon: 'construct',
      title: 'Skilled Professional',
      description: 'Offer vocational services and expertise',
      color: '#00f0a8',
      examples: ['Electrician', 'Plumber', 'Carpenter', 'Mechanic']
    },
    {
      type: 'farmer',
      icon: 'leaf',
      title: 'Farmer',
      description: 'Agricultural services and farm management',
      color: '#4CD964',
      examples: ['Crop Farmer', 'Livestock Farmer', 'Dairy Farmer']
    },
    {
      type: 'client',
      icon: 'business',
      title: 'Client',
      description: 'Find and hire skilled professionals',
      color: '#007AFF',
      examples: ['Homeowner', 'Business Owner', 'Project Manager']
    }
  ];

  if (!editing) {
    const current = userTypes.find(t => t.type === currentType);
    return (
      <View style={styles.userTypeDisplay}>
        <View style={[styles.typeIcon, { backgroundColor: current?.color || '#00f0a8' }]}>
          <Icon name={current?.icon || 'person'} size={20} color="#000" />
        </View>
        <View style={styles.typeInfo}>
          <Text style={styles.typeTitle}>{current?.title || 'User'}</Text>
          <Text style={styles.typeDescription}>{current?.description || 'Platform user'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.userTypeSelector}>
      <Text style={styles.selectorTitle}>Select Your Role</Text>
      <Text style={styles.selectorSubtitle}>
        Choose how you want to use the platform
      </Text>
      
      <View style={styles.typeOptions}>
        {userTypes.map((userType) => (
          <TouchableOpacity
            key={userType.type}
            style={[
              styles.typeOption,
              currentType === userType.type && styles.typeOptionSelected,
              { borderColor: userType.color }
            ]}
            onPress={() => {
              onTypeChange(userType.type);
              onRoleExamplesNavigation(userType.type);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.typeOptionHeader}>
              <View style={[styles.typeOptionIcon, { backgroundColor: userType.color }]}>
                <Icon name={userType.icon} size={24} color="#000" />
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
              <Text style={styles.examplesLabel}>Examples:</Text>
              <View style={styles.examplesList}>
                {userType.examples.map((example, index) => (
                  <Text key={index} style={styles.exampleText}>{example}</Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ROLE EXAMPLES MODAL COMPONENT
const RoleExamplesModal = ({ 
  visible, 
  onClose, 
  roleType, 
  onExampleSelect 
}) => {
  const roleExamples = {
    skilled: [
      { id: 'electrician', name: 'Electrician', icon: 'flash', description: 'Electrical installation and repair' },
      { id: 'plumber', name: 'Plumber', icon: 'water', description: 'Plumbing and pipe work' },
      { id: 'carpenter', name: 'Carpenter', icon: 'hammer', description: 'Woodworking and construction' },
      { id: 'mechanic', name: 'Mechanic', icon: 'build', description: 'Vehicle and equipment repair' },
      { id: 'technician', name: 'Technician', icon: 'hardware-chip', description: 'Technical equipment service' }
    ],
    farmer: [
      { id: 'crop', name: 'Crop Farmer', icon: 'leaf', description: 'Growing crops and produce' },
      { id: 'livestock', name: 'Livestock Farmer', icon: 'paw', description: 'Animal husbandry and care' },
      { id: 'dairy', name: 'Dairy Farmer', icon: 'nutrition', description: 'Milk and dairy production' },
      { id: 'poultry', name: 'Poultry Farmer', icon: 'egg', description: 'Poultry and egg production' },
      { id: 'organic', name: 'Organic Farmer', icon: 'flower', description: 'Organic farming practices' }
    ],
    client: [
      { id: 'homeowner', name: 'Homeowner', icon: 'home', description: 'Residential projects and repairs' },
      { id: 'business', name: 'Business Owner', icon: 'business', description: 'Commercial projects and services' },
      { id: 'contractor', name: 'Contractor', icon: 'construct', description: 'Project management and coordination' },
      { id: 'property', name: 'Property Manager', icon: 'business', description: 'Property maintenance and management' },
      { id: 'developer', name: 'Developer', icon: 'code-slash', description: 'Development projects and construction' }
    ]
  };

  const getRoleTitle = (type) => {
    switch (type) {
      case 'skilled': return 'Skilled Professional Examples';
      case 'farmer': return 'Farmer Specializations';
      case 'client': return 'Client Types';
      default: return 'Role Examples';
    }
  };

  const getRoleDescription = (type) => {
    switch (type) {
      case 'skilled': return 'Select your professional specialization to customize your profile';
      case 'farmer': return 'Choose your farming specialty to set up your agricultural profile';
      case 'client': return 'Select your client type to personalize your service needs';
      default: return 'Choose an example to continue';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.roleExamplesOverlay}>
        <View style={styles.roleExamplesContent}>
          <View style={styles.roleExamplesHeader}>
            <Text style={styles.roleExamplesTitle}>
              {getRoleTitle(roleType)}
            </Text>
            <Text style={styles.roleExamplesSubtitle}>
              {getRoleDescription(roleType)}
            </Text>
            <TouchableOpacity 
              style={styles.closeExamplesButton}
              onPress={onClose}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.roleExamplesList}>
            {roleExamples[roleType]?.map((example) => (
              <TouchableOpacity
                key={example.id}
                style={styles.roleExampleItem}
                onPress={() => onExampleSelect(example.name)}
                activeOpacity={0.7}
              >
                <View style={styles.roleExampleIcon}>
                  <Icon name={example.icon} size={24} color="#00f0a8" />
                </View>
                <View style={styles.roleExampleInfo}>
                  <Text style={styles.roleExampleName}>{example.name}</Text>
                  <Text style={styles.roleExampleDescription}>{example.description}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.roleExamplesFooter}>
            <TouchableOpacity 
              style={styles.skipExamplesButton}
              onPress={onClose}
            >
              <Text style={styles.skipExamplesText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ENHANCED FARMER PROFILE COMPONENT WITH NAVIGATION
const FarmerProfileManager = ({ farmDetails = {}, onUpdate, editing }) => {
  const [showFarmEditor, setShowFarmEditor] = useState(false);
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
    ...farmDetails
  });

  const farmTypes = ['Crop Farm', 'Dairy Farm', 'Poultry Farm', 'Mixed Farm', 'Organic Farm', 'Vineyard', 'Orchard', 'Aquaculture', 'Livestock Farm'];
  const soilTypes = ['Loam', 'Clay', 'Sandy', 'Silt', 'Peat', 'Chalk', 'Mixed'];
  const waterSources = ['Well', 'River', 'Lake', 'Municipal', 'Rainwater', 'Irrigation Canal'];

  const handleSaveFarmDetails = () => {
    onUpdate(tempFarmDetails);
    setShowFarmEditor(false);
    Alert.alert('Success', 'Farm details updated successfully');
  };

  const addCrop = (crop) => {
    if (crop && !tempFarmDetails.mainCrops.includes(crop)) {
      setTempFarmDetails(prev => ({
        ...prev,
        mainCrops: [...prev.mainCrops, crop]
      }));
    }
  };

  const removeCrop = (crop) => {
    setTempFarmDetails(prev => ({
      ...prev,
      mainCrops: prev.mainCrops.filter(c => c !== crop)
    }));
  };

  const addEquipment = (equipment) => {
    if (equipment && !tempFarmDetails.equipment.includes(equipment)) {
      setTempFarmDetails(prev => ({
        ...prev,
        equipment: [...prev.equipment, equipment]
      }));
    }
  };

  const removeEquipment = (equipment) => {
    setTempFarmDetails(prev => ({
      ...prev,
      equipment: prev.equipment.filter(e => e !== equipment)
    }));
  };

  return (
    <View style={styles.farmSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          {VectorIcons.farmer('#4CD964', 24)}
          <Text style={styles.sectionTitle}>Farm Details</Text>
        </View>
        {editing && (
          <TouchableOpacity 
            style={styles.editSectionButton}
            onPress={() => {
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
                ...farmDetails
              });
              setShowFarmEditor(true);
            }}
            activeOpacity={0.7}
          >
            <Icon name="create-outline" size={20} color="#00f0a8" />
          </TouchableOpacity>
        )}
      </View>

      {farmDetails.farmName ? (
        <View style={styles.farmDetailsGrid}>
          <View style={styles.farmDetailItem}>
            <Text style={styles.farmDetailLabel}>Farm Name</Text>
            <Text style={styles.farmDetailValue}>{farmDetails.farmName}</Text>
          </View>
          <View style={styles.farmDetailItem}>
            <Text style={styles.farmDetailLabel}>Farm Type</Text>
            <Text style={styles.farmDetailValue}>{farmDetails.farmType}</Text>
          </View>
          <View style={styles.farmDetailItem}>
            <Text style={styles.farmDetailLabel}>Farm Size</Text>
            <Text style={styles.farmDetailValue}>{farmDetails.hectares} hectares</Text>
          </View>
          {farmDetails.mainCrops && farmDetails.mainCrops.length > 0 && (
            <View style={styles.farmDetailItem}>
              <Text style={styles.farmDetailLabel}>Main Crops</Text>
              <View style={styles.cropsList}>
                {farmDetails.mainCrops.map((crop, index) => (
                  <View key={index} style={styles.cropChip}>
                    <Text style={styles.cropText}>{crop}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {farmDetails.equipment && farmDetails.equipment.length > 0 && (
            <View style={styles.farmDetailItem}>
              <Text style={styles.farmDetailLabel}>Equipment</Text>
              <View style={styles.equipmentList}>
                {farmDetails.equipment.map((item, index) => (
                  <View key={index} style={styles.equipmentChip}>
                    <Text style={styles.equipmentText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.noFarmDetails}>
          <Text style={styles.noFarmText}>No farm details added</Text>
          <Text style={styles.noFarmSubtext}>
            Add your farm information to connect with agricultural services
          </Text>
          {editing && (
            <TouchableOpacity 
              style={styles.addDetailsButton}
              onPress={() => setShowFarmEditor(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.addDetailsButtonText}>Add Farm Details</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Farm Editor Modal */}
      <Modal 
        visible={showFarmEditor} 
        animationType="slide" 
        transparent
        onRequestClose={() => setShowFarmEditor(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Farm Details</Text>
              <TouchableOpacity 
                onPress={() => setShowFarmEditor(false)}
                activeOpacity={0.7}
              >
                <Icon name="close" size={24} color="#00f0a8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Farm Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={tempFarmDetails.farmName}
                  onChangeText={(text) => setTempFarmDetails(prev => ({ ...prev, farmName: text }))}
                  placeholder="Enter farm name"
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

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Farm Size (hectares) *</Text>
                <TextInput
                  style={styles.formInput}
                  value={tempFarmDetails.hectares?.toString()}
                  onChangeText={(text) => setTempFarmDetails(prev => ({ ...prev, hectares: parseFloat(text) || 0 }))}
                  placeholder="Enter farm size"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Main Crops</Text>
                <View style={styles.cropInputContainer}>
                  <TextInput
                    style={styles.cropInput}
                    placeholder="Add a crop"
                    placeholderTextColor="#666"
                    onSubmitEditing={(e) => {
                      addCrop(e.nativeEvent.text);
                      e.nativeEvent.text = '';
                    }}
                  />
                </View>
                <View style={styles.selectedCrops}>
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
                <View style={styles.equipmentInputContainer}>
                  <TextInput
                    style={styles.equipmentInput}
                    placeholder="Add equipment"
                    placeholderTextColor="#666"
                    onSubmitEditing={(e) => {
                      addEquipment(e.nativeEvent.text);
                      e.nativeEvent.text = '';
                    }}
                  />
                </View>
                <View style={styles.selectedEquipment}>
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
                    <Text style={styles.organicToggleText}>
                      Organically Certified
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => setShowFarmEditor(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.saveModalButton,
                  (!tempFarmDetails.farmName || !tempFarmDetails.farmType) && styles.saveModalButtonDisabled
                ]}
                onPress={handleSaveFarmDetails}
                disabled={!tempFarmDetails.farmName || !tempFarmDetails.farmType}
                activeOpacity={0.7}
              >
                <Text style={styles.saveModalText}>Save Farm Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ENHANCED CLIENT PROFILE COMPONENT WITH NAVIGATION
const ClientProfileManager = ({ clientDetails = {}, onUpdate, editing }) => {
  const [showClientEditor, setShowClientEditor] = useState(false);
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
    ...clientDetails
  });

  const industries = ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Construction', 'Technology', 'Healthcare', 'Education', 'Hospitality'];
  const projectSizes = ['Small (<$5k)', 'Medium ($5k-$25k)', 'Large ($25k-$100k)', 'Enterprise ($100k+)'];

  const handleSaveClientDetails = () => {
    onUpdate(tempClientDetails);
    setShowClientEditor(false);
    Alert.alert('Success', 'Client information updated successfully');
  };

  const addProjectType = (type) => {
    if (type && !tempClientDetails.projectTypes.includes(type)) {
      setTempClientDetails(prev => ({
        ...prev,
        projectTypes: [...prev.projectTypes, type]
      }));
    }
  };

  const removeProjectType = (type) => {
    setTempClientDetails(prev => ({
      ...prev,
      projectTypes: prev.projectTypes.filter(t => t !== type)
    }));
  };

  return (
    <View style={styles.clientSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          {VectorIcons.client('#007AFF', 24)}
          <Text style={styles.sectionTitle}>Client Information</Text>
        </View>
        {editing && (
          <TouchableOpacity 
            style={styles.editSectionButton}
            onPress={() => {
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
                ...clientDetails
              });
              setShowClientEditor(true);
            }}
            activeOpacity={0.7}
          >
            <Icon name="create-outline" size={20} color="#00f0a8" />
          </TouchableOpacity>
        )}
      </View>

      {clientDetails.companyName ? (
        <View style={styles.clientDetailsGrid}>
          <View style={styles.clientDetailItem}>
            <Text style={styles.clientDetailLabel}>Company</Text>
            <Text style={styles.clientDetailValue}>{clientDetails.companyName}</Text>
          </View>
          <View style={styles.clientDetailItem}>
            <Text style={styles.clientDetailLabel}>Industry</Text>
            <Text style={styles.clientDetailValue}>{clientDetails.industry}</Text>
          </View>
          {clientDetails.projectTypes && clientDetails.projectTypes.length > 0 && (
            <View style={styles.clientDetailItem}>
              <Text style={styles.clientDetailLabel}>Project Types</Text>
              <View style={styles.projectTypesList}>
                {clientDetails.projectTypes.map((type, index) => (
                  <View key={index} style={styles.projectTypeChip}>
                    <Text style={styles.projectTypeText}>{type}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {clientDetails.budgetRange && clientDetails.budgetRange.min > 0 && (
            <View style={styles.clientDetailItem}>
              <Text style={styles.clientDetailLabel}>Budget Range</Text>
              <Text style={styles.clientDetailValue}>
                ${clientDetails.budgetRange.min} - ${clientDetails.budgetRange.max}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.noClientDetails}>
          <Text style={styles.noClientText}>No client information added</Text>
          <Text style={styles.noClientSubtext}>
            Add your company details to find skilled professionals
          </Text>
          {editing && (
            <TouchableOpacity 
              style={styles.addDetailsButton}
              onPress={() => setShowClientEditor(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.addDetailsButtonText}>Add Client Details</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Client Editor Modal */}
      <Modal 
        visible={showClientEditor} 
        animationType="slide" 
        transparent
        onRequestClose={() => setShowClientEditor(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Client Details</Text>
              <TouchableOpacity 
                onPress={() => setShowClientEditor(false)}
                activeOpacity={0.7}
              >
                <Icon name="close" size={24} color="#00f0a8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Company Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={tempClientDetails.companyName}
                  onChangeText={(text) => setTempClientDetails(prev => ({ ...prev, companyName: text }))}
                  placeholder="Enter company name"
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
                <Text style={styles.formLabel}>Project Types</Text>
                <View style={styles.projectInputContainer}>
                  <TextInput
                    style={styles.projectInput}
                    placeholder="Add project type"
                    placeholderTextColor="#666"
                    onSubmitEditing={(e) => {
                      addProjectType(e.nativeEvent.text);
                      e.nativeEvent.text = '';
                    }}
                  />
                </View>
                <View style={styles.selectedProjects}>
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
                <Text style={styles.formLabel}>Budget Range</Text>
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
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => setShowClientEditor(false)}
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
    </View>
  );
};

// ADVANCED BOTTOM NAVIGATION WITH VECTOR ICONS
const AdvancedBottomNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: VectorIcons.home },
    { id: 'search', label: 'Discover', icon: VectorIcons.search },
    { id: 'marketplace', label: 'Market', icon: VectorIcons.marketplace },
    { id: 'profile', label: 'Profile', icon: VectorIcons.profile },
  ];

  return (
    <View style={styles.bottomNavigation}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.navItem,
            activeTab === tab.id && styles.navItemActive
          ]}
          onPress={() => onTabChange(tab.id)}
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

// MAIN ENHANCED ENTERPRISE PLATFORM WITH FIXED NAVIGATION
export default function AdvancedEnterprisePlatform({ navigation }) {
  const {
    profile,
    loading,
    saving,
    lastSave,
    editing,
    setEditing,
    activeTab,
    setActiveTab,
    showRoleExamples,
    setShowRoleExamples,
    selectedRoleForExamples,
    updateProfile,
    updateFarmDetails,
    updateClientDetails,
    addSkill,
    removeSkill,
    updateProfileImage,
    saveProfile,
    loadProfile,
    resetProfile,
    handleRoleExamplesNavigation,
    handleCloseRoleExamples,
    calculateProfileCompleteness
  } = useAdvancedEnterpriseProfile();

  const [refreshing, setRefreshing] = useState(false);
  const [bottomNavTab, setBottomNavTab] = useState('profile');
  const scrollY = useRef(new Animated.Value(0)).current;
  const mainScrollRef = useRef(null);

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
    }
  };

  // Animated header styles
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

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00f0a8" />
        <Text style={styles.loadingText}>Loading Advanced Platform...</Text>
      </SafeAreaView>
    );
  }

  const ProfileHeader = () => (
    <Animated.View 
      style={[
        styles.header,
        {
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity
        }
      ]}
    >
      <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Icon name="chevron-back" size={28} color="#00f0a8" />
            </TouchableOpacity>
            
            <View style={styles.headerTitle}>
              <Text style={styles.headerTitleText}>VSXchange Pro</Text>
              {saving && (
                <View style={styles.savingIndicator}>
                  <ActivityIndicator size="small" color="#00f0a8" />
                  <Text style={styles.savingText}>Auto-saving...</Text>
                </View>
              )}
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={handleShareProfile}
                activeOpacity={0.7}
              >
                <Icon name="share-social" size={20} color="#00f0a8" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.editButton, editing && styles.editButtonActive]}
                onPress={() => setEditing(!editing)}
                activeOpacity={0.7}
              >
                <Icon 
                  name={editing ? "checkmark" : "create-outline"} 
                  size={20} 
                  color="#00f0a8" 
                />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => {
                  Alert.alert(
                    'Profile Options',
                    'Choose an action:',
                    [
                      { text: 'Reset Profile', onPress: resetProfile, style: 'destructive' },
                      { text: 'Export Data', onPress: () => console.log('Export') },
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

          <View style={styles.profileMain}>
            <View style={styles.profileImageSection}>
              <TouchableOpacity 
                style={styles.avatarContainer}
                disabled={!editing}
              >
                <View style={styles.avatarWrapper}>
                  {profile.profileImage ? (
                    <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Icon name="person" size={40} color="#666" />
                    </View>
                  )}
                  
                  {editing && (
                    <View style={styles.editBadge}>
                      <Icon name="camera" size={16} color="#000" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameSection}>
                {editing ? (
                  <View style={styles.nameEditor}>
                    <TextInput
                      style={styles.nameInput}
                      value={profile.firstName}
                      onChangeText={(text) => updateProfile({ firstName: text })}
                      placeholder="First Name"
                      placeholderTextColor="#666"
                    />
                    <TextInput
                      style={styles.nameInput}
                      value={profile.lastName}
                      onChangeText={(text) => updateProfile({ lastName: text })}
                      placeholder="Last Name"
                      placeholderTextColor="#666"
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

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{profile.experienceYears}</Text>
                  <Text style={styles.statLabel}>Years</Text>
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
                  <Text style={styles.statLabel}>/hr</Text>
                </View>
              </View>

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
                  onPress={() => console.log('Call:', profile.contactInfo?.phone)}
                  activeOpacity={0.7}
                >
                  <Icon name="call" size={18} color="#00f0a8" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <UserTypeSelector
            currentType={profile.userType}
            onTypeChange={(type) => updateProfile({ userType: type })}
            onRoleExamplesNavigation={handleRoleExamplesNavigation}
            editing={editing}
          />

          {lastSave && (
            <View style={styles.saveStatus}>
              <Icon name="checkmark-circle" size={12} color="#00f0a8" />
              <Text style={styles.saveStatusText}>
                Auto-saved {new Date(lastSave).toLocaleTimeString()}
              </Text>
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
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Bio</Text>
              <TextInput
                style={styles.bioInput}
                value={profile.bio}
                onChangeText={(text) => updateProfile({ bio: text })}
                placeholder="Tell us about your professional background, expertise, and what makes you unique..."
                placeholderTextColor="#666"
                multiline={true}
                numberOfLines={4}
                editable={editing}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills & Expertise</Text>
              {profile.skills.map((skill) => (
                <View key={skill.id} style={styles.skillChip}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  {editing && (
                    <TouchableOpacity 
                      onPress={() => removeSkill(skill.id)}
                      style={styles.removeSkillButton}
                    >
                      <Icon name="close" size={16} color="#ff6b6b" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {editing && (
                <TouchableOpacity style={styles.addSkillButton}>
                  <Icon name="add" size={20} color="#00f0a8" />
                  <Text style={styles.addSkillText}>Add Skill</Text>
                </TouchableOpacity>
              )}
            </View>

            {profile.userType === 'farmer' && (
              <FarmerProfileManager
                farmDetails={profile.farmDetails}
                onUpdate={updateFarmDetails}
                editing={editing}
              />
            )}

            {profile.userType === 'client' && (
              <ClientProfileManager
                clientDetails={profile.clientDetails}
                onUpdate={updateClientDetails}
                editing={editing}
              />
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <TextInput
                style={styles.contactInput}
                value={profile.contactInfo?.phone}
                onChangeText={(text) => updateProfile({ 
                  contactInfo: { ...profile.contactInfo, phone: text } 
                })}
                placeholder="Phone number"
                placeholderTextColor="#666"
                editable={editing}
              />
              <TextInput
                style={styles.contactInput}
                value={profile.contactInfo?.email}
                onChangeText={(text) => updateProfile({ 
                  contactInfo: { ...profile.contactInfo, email: text } 
                })}
                placeholder="Email address"
                placeholderTextColor="#666"
                editable={editing}
              />
            </View>
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
                Showcase your work with high-resolution images, project descriptions, and client testimonials
              </Text>
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
                Manage your service offerings, dynamic pricing, and availability calendar
              </Text>
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

      <KeyboardAvoidingView 
        style={styles.contentContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <TabContent />
      </KeyboardAvoidingView>

      <AdvancedBottomNavigation 
        activeTab={bottomNavTab}
        onTabChange={setBottomNavTab}
      />

      <RoleExamplesModal
        visible={showRoleExamples}
        onClose={() => handleCloseRoleExamples()}
        roleType={selectedRoleForExamples}
        onExampleSelect={(example) => handleCloseRoleExamples(example)}
      />

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

// COMPLETE STYLES WITH NAVIGATION FIXES
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
  loadingText: {
    color: '#00f0a8',
    fontSize: 16,
    marginTop: 16,
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
  },
  headerContent: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
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
    gap: 8,
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
    gap: 10,
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
  userTypeSelector: {
    marginBottom: 15,
  },
  selectorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  selectorSubtitle: {
    color: '#666',
    fontSize: 12,
    marginBottom: 15,
  },
  typeOptions: {
    gap: 10,
  },
  typeOption: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  typeOptionSelected: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  typeOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginBottom: 2,
  },
  typeOptionDescription: {
    color: '#666',
    fontSize: 12,
  },
  selectedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  examplesContainer: {
    paddingLeft: 52,
  },
  examplesLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  examplesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  exampleText: {
    color: '#888',
    fontSize: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  saveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  saveStatusText: {
    color: '#00f0a8',
    fontSize: 10,
    marginLeft: 4,
  },
  tabsContainer: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginTop: Platform.OS === 'ios' ? 100 : 80,
  },
  tabsScrollContent: {
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00f0a8',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#00f0a8',
  },
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  bioInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  skillName: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  removeSkillButton: {
    padding: 4,
  },
  addSkillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
    alignSelf: 'flex-start',
  },
  addSkillText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  contactInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  farmSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
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
  },
  editSectionButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  farmDetailsGrid: {
    gap: 12,
  },
  farmDetailItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
  },
  farmDetailLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  farmDetailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cropsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  cropChip: {
    backgroundColor: 'rgba(76,217,100,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cropText: {
    color: '#4CD964',
    fontSize: 12,
    fontWeight: '600',
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  equipmentChip: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  equipmentText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
  },
  noFarmDetails: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noFarmText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  noFarmSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  addDetailsButton: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  addDetailsButtonText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  clientSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  clientDetailsGrid: {
    gap: 12,
  },
  clientDetailItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
  },
  clientDetailLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  clientDetailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  projectTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  projectTypeChip: {
    backgroundColor: 'rgba(0,122,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  projectTypeText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
  noClientDetails: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noClientText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  noClientSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
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
    maxHeight: 400,
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  farmTypeChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  farmTypeChipSelected: {
    backgroundColor: 'rgba(76,217,100,0.2)',
    borderColor: '#4CD964',
  },
  farmTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cropInputContainer: {
    marginBottom: 8,
  },
  cropInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectedCrops: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectedCrop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76,217,100,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  selectedCropText: {
    color: '#4CD964',
    fontSize: 12,
    fontWeight: '600',
  },
  equipmentInputContainer: {
    marginBottom: 8,
  },
  equipmentInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectedEquipment: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectedEquipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  selectedEquipmentText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
  },
  soilTypeChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  soilTypeChipSelected: {
    backgroundColor: 'rgba(139,69,19,0.3)',
    borderColor: '#8B4513',
  },
  soilTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  waterSourceChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  waterSourceChipSelected: {
    backgroundColor: 'rgba(0,122,255,0.2)',
    borderColor: '#007AFF',
  },
  waterSourceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  organicToggle: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  organicToggleActive: {
    backgroundColor: 'rgba(76,217,100,0.1)',
    borderColor: '#4CD964',
  },
  organicToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organicToggleSwitch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  organicToggleSwitchActive: {
    backgroundColor: '#4CD964',
  },
  organicToggleText: {
    color: '#fff',
    fontSize: 14,
  },
  industryChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  industryChipSelected: {
    backgroundColor: 'rgba(0,122,255,0.2)',
    borderColor: '#007AFF',
  },
  industryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  projectInputContainer: {
    marginBottom: 8,
  },
  projectInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectedProjects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectedProject: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,122,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  selectedProjectText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
  budgetRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  budgetInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  projectSizeChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderColor: '#00f0a8',
  },
  projectSizeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelModalButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  cancelModalText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '600',
  },
  saveModalButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.2)',
  },
  saveModalButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    opacity: 0.5,
  },
  saveModalText: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    transform: [{ translateY: -2 }],
  },
  navLabel: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#00f0a8',
  },
  comingSoonSection: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  comingSoonTitle: {
    color: '#fff',
    fontSize: 20,
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
  ratingOverview: {
    alignItems: 'center',
    padding: 40,
  },
  ratingNumber: {
    color: '#00f0a8',
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 10,
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ratingCount: {
    color: '#666',
    fontSize: 14,
  },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  savingContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 30,
    borderRadius: 20,
  },
  savingOverlayText: {
    color: '#00f0a8',
    fontSize: 16,
    marginTop: 10,
  },
  // Role Examples Modal Styles
  roleExamplesOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
  },
  roleExamplesContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  roleExamplesHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  roleExamplesTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  roleExamplesSubtitle: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  closeExamplesButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 4,
  },
  roleExamplesList: {
    maxHeight: 400,
  },
  roleExampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  roleExampleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,240,168,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  roleExampleInfo: {
    flex: 1,
  },
  roleExampleName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  roleExampleDescription: {
    color: '#666',
    fontSize: 12,
  },
  roleExamplesFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  skipExamplesButton: {
    alignItems: 'center',
    padding: 12,
  },
  skipExamplesText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});