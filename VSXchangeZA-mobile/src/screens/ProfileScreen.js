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

// ENHANCED VECTOR ICONS SYSTEM - PERFECTLY MATCHING DASHBOARD
const VectorIcons = {
  // Bottom Navigation Icons - Exactly matching DashboardScreen
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

  settings: (color = '#666', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M19.4 15C19.2662 15.4668 19.1334 15.9336 19 16.4C18.9228 16.6576 18.8456 16.9152 18.7684 17.1728C18.6912 17.4304 18.614 17.688 18.5368 17.9456L21 21L19 23L16.2 20.2C15.7332 20.3338 15.2664 20.4676 14.7996 20.6012C14.542 20.6784 14.2844 20.7556 14.0268 20.8328C13.7692 20.91 13.5116 20.9872 13.254 21.0644C12.9964 21.1416 12.7388 21.2188 12.4812 21.296C12.2236 21.3732 11.966 21.4504 11.7084 21.5276C11.2416 21.6612 10.7748 21.7948 10.308 21.9284L7 23L5 21L5.6 18.2C5.4662 17.7332 5.3324 17.2664 5.1988 16.7996C5.1216 16.542 5.0444 16.2844 4.9672 16.0268C4.89 15.7692 4.8128 15.5116 4.7356 15.254C4.6584 14.9964 4.5812 14.7388 4.504 14.4812C4.4268 14.2236 4.3496 13.966 4.2724 13.7084C4.1388 13.2416 4.0052 12.7748 3.8716 12.308L1 11L3 9L5.8 10.6C6.2668 10.4662 6.7336 10.3324 7.2004 10.1988C7.458 10.1216 7.7156 10.0444 7.9732 9.9672C8.2308 9.89 8.4884 9.8128 8.746 9.7356C9.0036 9.6584 9.2612 9.5812 9.5188 9.504C9.7764 9.4268 10.034 9.3496 10.2916 9.2724C10.7584 9.1388 11.2252 9.0052 11.692 8.8716L15 7L17 9L16.4 11.8C16.5338 12.2668 16.6676 12.7336 16.8012 13.2004C16.8784 13.458 16.9556 13.7156 17.0328 13.9732C17.11 14.2308 17.1872 14.4884 17.2644 14.746C17.3416 15.0036 17.4188 15.2612 17.496 15.5188C17.5732 15.7764 17.6504 16.034 17.7276 16.2916C17.8612 16.7584 17.9948 17.2252 18.1284 17.692L21 19L19 21L16.2 18.2Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )
};

// FIXED ENTERPRISE STATE MANAGEMENT WITH ENHANCED ROLE NAVIGATION
const useAdvancedEnterpriseProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSave, setLastSave] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showRoleExamples, setShowRoleExamples] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
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
    // Enhanced Farmer Details
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
    // Enhanced Client Details
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
    profileCompleteness: 65,
    metadata: {
      created: new Date().toISOString(),
      version: '2.0.0',
      syncEnabled: true,
      lastBackup: null
    }
  };

  // Enhanced load profile
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

  // Enhanced save profile
  const saveProfile = useCallback(async (newProfile) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        const profileToSave = newProfile || profile;
        const timestamp = new Date().toISOString();
        
        const enhancedProfile = {
          ...profileToSave,
          lastUpdated: timestamp,
          metadata: {
            ...profileToSave.metadata,
            lastBackup: timestamp
          }
        };

        await AsyncStorage.setItem('advanced_enterprise_profile', JSON.stringify(enhancedProfile));
        setLastSave(timestamp);
        
      } catch (error) {
        console.error('Save error:', error);
      } finally {
        setSaving(false);
      }
    }, 600);
  }, [profile]);

  // FIXED: Enhanced role switching with immediate navigation to role-specific details
  const switchUserType = useCallback((newUserType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setProfile(prev => {
      const newProfile = {
        ...prev,
        userType: newUserType,
        lastUpdated: new Date().toISOString(),
        profileCompleteness: calculateProfileCompleteness({ ...prev, userType: newUserType })
      };
      
      saveProfile(newProfile);
      return newProfile;
    });

    // Auto-navigate to role-specific sections
    if (newUserType === 'farmer') {
      setTimeout(() => {
        setShowRoleExamples(false);
        // Farmer details will be automatically shown in the FarmerProfileManager component
      }, 300);
    } else if (newUserType === 'client') {
      setTimeout(() => {
        setShowRoleExamples(false);
        // Client details will be automatically shown in the ClientProfileManager component
      }, 300);
    }
    
    setShowRoleExamples(false);
  }, [saveProfile]);

  // Enhanced update function
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
  }, [saveProfile]);

  // Calculate profile completeness
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
        profileData.farmDetails?.hectares > 0
      ],
      client: [
        profileData.clientDetails?.companyName,
        profileData.clientDetails?.industry,
        profileData.clientDetails?.projectTypes?.length > 0
      ]
    };

    const baseScore = (baseFields.filter(Boolean).length / baseFields.length) * 60;
    const userTypeScore = (userTypeFields[profileData.userType]?.filter(Boolean).length / userTypeFields[profileData.userType]?.length) * 40 || 0;

    return Math.min(Math.round(baseScore + userTypeScore), 100);
  };

  // Enhanced farm details update
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

  // Enhanced client details update
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

  // Enhanced skill management
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
        saveProfile(newProfile);
        return newProfile;
      });
      return true;
    } catch (error) {
      console.error('Profile image update failed:', error);
      return false;
    }
  }, [saveProfile]);

  // FIXED: Show role examples when editing role
  const handleRoleEditPress = useCallback(() => {
    setShowRoleExamples(true);
  }, []);

  // Reset profile
  const resetProfile = useCallback(async () => {
    Alert.alert(
      'Reset Profile',
      'Are you sure you want to reset all profile data?',
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

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    saving,
    lastSave,
    editing,
    setEditing,
    activeTab,
    setActiveTab,
    updateProfile,
    updateFarmDetails,
    updateClientDetails,
    addSkill,
    removeSkill,
    updateProfileImage,
    switchUserType,
    saveProfile,
    loadProfile,
    resetProfile,
    calculateProfileCompleteness,
    showRoleExamples,
    setShowRoleExamples,
    handleRoleEditPress,
    selectedRole,
    setSelectedRole
  };
};

// FIXED USER TYPE SELECTOR WITH ROLE EXAMPLES NAVIGATION
const UserTypeSelector = ({ currentType, onTypeChange, editing, onRoleEditPress }) => {
  const userTypes = [
    {
      type: 'skilled',
      icon: 'construct',
      title: 'Skilled Professional',
      description: 'Offer vocational services and expertise',
      color: '#00f0a8',
      examples: ['Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Technician']
    },
    {
      type: 'farmer',
      icon: 'leaf',
      title: 'Farmer & Agri-Expert',
      description: 'Agricultural services and farm management',
      color: '#4CD964',
      examples: ['Crop Farmer', 'Livestock Farmer', 'Dairy Farmer', 'Agri-Consultant']
    },
    {
      type: 'client',
      icon: 'business',
      title: 'Client & Project Owner',
      description: 'Find and hire skilled professionals',
      color: '#007AFF',
      examples: ['Homeowner', 'Business Owner', 'Project Manager', 'Contractor']
    }
  ];

  // Display mode - non-editing
  if (!editing) {
    const current = userTypes.find(t => t.type === currentType) || userTypes[0];
    return (
      <TouchableOpacity 
        style={styles.userTypeDisplay}
        onPress={onRoleEditPress}
        activeOpacity={0.7}
      >
        <View style={[styles.typeIcon, { backgroundColor: current.color }]}>
          <Icon name={current.icon} size={20} color="#000" />
        </View>
        <View style={styles.typeInfo}>
          <Text style={styles.typeTitle}>{current.title}</Text>
          <Text style={styles.typeDescription}>{current.description}</Text>
          <View style={styles.examplesPreview}>
            {current.examples.slice(0, 2).map((example, index) => (
              <Text key={index} style={styles.examplePreviewText}>{example}</Text>
            ))}
            {current.examples.length > 2 && (
              <Text style={styles.moreExamplesText}>+{current.examples.length - 2} more</Text>
            )}
          </View>
        </View>
        <Icon name="chevron-forward" size={16} color="#666" />
      </TouchableOpacity>
    );
  }

  // Editing mode - show full selector
  return (
    <View style={styles.userTypeSelector}>
      <View style={styles.selectorHeader}>
        <Text style={styles.selectorTitle}>Select Your Professional Role</Text>
        <Text style={styles.selectorSubtitle}>
          Choose how you want to use the platform. Your selection will determine available features.
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
              <Text style={styles.examplesLabel}>Examples include:</Text>
              <View style={styles.examplesList}>
                {userType.examples.map((example, index) => (
                  <View key={index} style={styles.exampleChip}>
                    <Text style={styles.exampleText}>{example}</Text>
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

// FIXED ROLE EXAMPLES MODAL FOR BETTER NAVIGATION
const RoleExamplesModal = ({ visible, onClose, userTypes, currentType, onRoleSelect }) => {
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
            <Text style={styles.roleExamplesTitle}>Choose Your Role</Text>
            <Text style={styles.roleExamplesSubtitle}>
              Select your primary role to customize your experience
            </Text>
          </View>

          <ScrollView style={styles.roleExamplesList}>
            {userTypes.map((userType) => (
              <TouchableOpacity
                key={userType.type}
                style={[
                  styles.roleExampleItem,
                  currentType === userType.type && styles.roleExampleItemSelected
                ]}
                onPress={() => {
                  onRoleSelect(userType.type);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.roleExampleIcon, { backgroundColor: userType.color }]}>
                  <Icon name={userType.icon} size={24} color="#000" />
                </View>
                <View style={styles.roleExampleInfo}>
                  <Text style={styles.roleExampleTitle}>{userType.title}</Text>
                  <Text style={styles.roleExampleDescription}>{userType.description}</Text>
                  <View style={styles.roleExampleExamples}>
                    {userType.examples.map((example, index) => (
                      <Text key={index} style={styles.roleExampleExample}>{example}</Text>
                    ))}
                  </View>
                </View>
                {currentType === userType.type && (
                  <View style={[styles.roleExampleSelected, { backgroundColor: userType.color }]}>
                    <Icon name="checkmark" size={16} color="#000" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity 
            style={styles.roleExamplesClose}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.roleExamplesCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ENHANCED PROFILE IMAGE EDITOR
const ProfileImageEditor = ({ profileImage, onImageUpdate, editing }) => {
  const [showImageOptions, setShowImageOptions] = useState(false);

  const handleImageSelect = async (source) => {
    setShowImageOptions(false);
    try {
      let result;
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission Required', 'Camera access is needed');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission Required', 'Photo library access is needed');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8
        });
      }

      if (!result.canceled && result.assets) {
        const success = await onImageUpdate(result.assets[0].uri);
        if (success) {
          Alert.alert('Success', 'Profile picture updated successfully');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };

  return (
    <View style={styles.profileImageSection}>
      <TouchableOpacity 
        style={styles.avatarContainer}
        onPress={() => editing && setShowImageOptions(true)}
        disabled={!editing}
      >
        <View style={styles.avatarWrapper}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
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

// ENHANCED EDITABLE FIELD COMPONENT
const EditableField = ({ 
  value, 
  onSave, 
  placeholder, 
  multiline = false, 
  style,
  type = 'text',
  options = [],
  label,
  required = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');
  const [error, setError] = useState('');

  const validateInput = (input) => {
    if (required && !input.trim()) {
      return 'This field is required';
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

  if (!isEditing) {
    return (
      <TouchableOpacity 
        style={[styles.viewField, style]}
        onPress={() => setIsEditing(true)}
        activeOpacity={0.7}
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
        <Icon name="create-outline" size={16} color="#00f0a8" />
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
          autoCapitalize="sentences"
          returnKeyType="done"
          blurOnSubmit={true}
        />
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

// ENHANCED SKILL MANAGER
const SkillManager = ({ 
  skills = [], 
  userType, 
  onAddSkill, 
  onRemoveSkill, 
  editing 
}) => {
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    level: 'intermediate',
    years: 1,
    certified: false
  });

  const categories = {
    skilled: ['Electrical', 'Plumbing', 'Carpentry', 'Mechanical', 'Construction', 'Technology'],
    farmer: ['Crop Farming', 'Livestock', 'Farm Equipment', 'Specialties', 'Farm Skills'],
    client: ['Project Types', 'Service Needs', 'Industries', 'Budget Ranges']
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      Alert.alert('Error', 'Please enter a skill name');
      return;
    }

    onAddSkill(newSkill);
    setNewSkill({ name: '', category: '', level: 'intermediate', years: 1, certified: false });
    setShowAddSkill(false);
  };

  const SkillChip = ({ skill, onRemove }) => (
    <View style={styles.skillChip}>
      <View style={styles.skillInfo}>
        <Text style={styles.skillName}>{skill.name}</Text>
        <View style={styles.skillMeta}>
          {skill.category && (
            <Text style={styles.skillCategory}>{skill.category}</Text>
          )}
          <Text style={styles.skillLevel}>• {skill.level}</Text>
          <Text style={styles.skillYears}>• {skill.years} year{skill.years !== 1 ? 's' : ''}</Text>
          {skill.certified && (
            <View style={styles.certifiedBadge}>
              <Icon name="shield-checkmark" size={10} color="#000" />
            </View>
          )}
        </View>
      </View>
      {editing && (
        <TouchableOpacity 
          onPress={onRemove} 
          style={styles.removeSkillButton}
          activeOpacity={0.7}
        >
          <Icon name="close" size={16} color="#ff6b6b" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.skillManager}>
      <View style={styles.skillHeader}>
        <View>
          <Text style={styles.skillTitle}>
            {userType === 'skilled' && 'Professional Skills'}
            {userType === 'farmer' && 'Farm Specialties'}
            {userType === 'client' && 'Service Interests'}
          </Text>
          <Text style={styles.skillSubtitle}>
            {skills.length} {skills.length === 1 ? 'item' : 'items'} added
          </Text>
        </View>
        {editing && (
          <TouchableOpacity 
            style={styles.addSkillButton}
            onPress={() => setShowAddSkill(true)}
            activeOpacity={0.7}
          >
            <Icon name="add" size={20} color="#00f0a8" />
            <Text style={styles.addSkillText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.skillsGrid}>
        {skills.map((skill) => (
          <SkillChip 
            key={skill.id} 
            skill={skill} 
            onRemove={() => onRemoveSkill(skill.id)} 
          />
        ))}
        
        {skills.length === 0 && (
          <View style={styles.noSkills}>
            <Icon name="construct-outline" size={48} color="#666" />
            <Text style={styles.noSkillsText}>No items added yet</Text>
            <Text style={styles.noSkillsSubtext}>
              Add your {userType === 'skilled' ? 'skills' : userType === 'farmer' ? 'specialties' : 'interests'} to get started
            </Text>
          </View>
        )}
      </View>

      {/* Add Skill Modal */}
      <Modal 
        visible={showAddSkill} 
        animationType="slide" 
        transparent
        onRequestClose={() => setShowAddSkill(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {userType === 'skilled' ? 'Add Skill' : userType === 'farmer' ? 'Add Specialty' : 'Add Interest'}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowAddSkill(false)}
                activeOpacity={0.7}
              >
                <Icon name="close" size={24} color="#00f0a8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={newSkill.name}
                  onChangeText={(text) => setNewSkill(prev => ({ ...prev, name: text }))}
                  placeholder={
                    userType === 'skilled' ? 'e.g., Electrical Wiring' :
                    userType === 'farmer' ? 'e.g., Crop Management' :
                    'e.g., Project Planning'
                  }
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories[userType]?.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        newSkill.category === category && styles.categoryChipSelected
                      ]}
                      onPress={() => setNewSkill(prev => ({ ...prev, category }))}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.categoryChipText}>{category}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Experience Level</Text>
                <View style={styles.levelOptions}>
                  {['beginner', 'intermediate', 'advanced', 'expert'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.levelChip,
                        newSkill.level === level && styles.levelChipSelected
                      ]}
                      onPress={() => setNewSkill(prev => ({ ...prev, level }))}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.levelChipText}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Years of Experience</Text>
                <View style={styles.yearsSelector}>
                  {[1,2,3,5,8,10].map((years) => (
                    <TouchableOpacity
                      key={years}
                      style={[
                        styles.yearChip,
                        newSkill.years === years && styles.yearChipSelected
                      ]}
                      onPress={() => setNewSkill(prev => ({ ...prev, years }))}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.yearChipText}>{years}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => setShowAddSkill(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.saveModalButton,
                  !newSkill.name && styles.saveModalButtonDisabled
                ]}
                onPress={handleAddSkill}
                disabled={!newSkill.name}
                activeOpacity={0.7}
              >
                <Text style={styles.saveModalText}>
                  {userType === 'skilled' ? 'Add Skill' : userType === 'farmer' ? 'Add Specialty' : 'Add Interest'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// FIXED FARMER PROFILE MANAGER WITH PROPER NAVIGATION
const FarmerProfileManager = ({ farmDetails = {}, onUpdate, editing }) => {
  const [showFarmEditor, setShowFarmEditor] = useState(false);
  const [tempFarmDetails, setTempFarmDetails] = useState({
    farmName: '',
    farmType: '',
    hectares: 0,
    mainCrops: [],
    equipment: [],
    soilType: '',
    waterSource: '',
    organicCertified: false,
    ...farmDetails
  });

  const farmTypes = ['Crop Farm', 'Dairy Farm', 'Poultry Farm', 'Mixed Farm', 'Organic Farm', 'Vineyard'];
  const soilTypes = ['Loam', 'Clay', 'Sandy', 'Silt', 'Mixed'];
  const waterSources = ['Well', 'River', 'Lake', 'Municipal', 'Rainwater'];

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
                farmType: '',
                hectares: 0,
                mainCrops: [],
                equipment: [],
                soilType: '',
                waterSource: '',
                organicCertified: false,
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
          {farmDetails.organicCertified && (
            <View style={styles.farmDetailItem}>
              <Text style={styles.farmDetailLabel}>Certification</Text>
              <View style={styles.organicBadge}>
                <Icon name="leaf" size={12} color="#4CD964" />
                <Text style={styles.organicBadgeText}>Organically Certified</Text>
              </View>
            </View>
          )}
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
        </View>
      ) : (
        <View style={styles.noFarmDetails}>
          <Icon name="leaf-outline" size={48} color="#666" />
          <Text style={styles.noFarmText}>No farm details added</Text>
          <Text style={styles.noFarmSubtext}>
            {editing ? 'Add your farm information to get started' : 'Farm details not yet provided'}
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

// FIXED CLIENT PROFILE MANAGER WITH PROPER NAVIGATION
const ClientProfileManager = ({ clientDetails = {}, onUpdate, editing }) => {
  const [showClientEditor, setShowClientEditor] = useState(false);
  const [tempClientDetails, setTempClientDetails] = useState({
    companyName: '',
    industry: '',
    projectTypes: [],
    budgetRange: { min: 0, max: 0 },
    projectSize: '',
    ...clientDetails
  });

  const industries = ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Construction', 'Technology'];
  const projectSizes = ['Small (<$5k)', 'Medium ($5k-$25k)', 'Large ($25k-$100k)', 'Enterprise ($100k+)'];

  const handleSaveClientDetails = () => {
    onUpdate(tempClientDetails);
    setShowClientEditor(false);
    Alert.alert('Success', 'Client details updated successfully');
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
                budgetRange: { min: 0, max: 0 },
                projectSize: '',
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
                ${clientDetails.budgetRange.min.toLocaleString()} - ${clientDetails.budgetRange.max.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.noClientDetails}>
          <Icon name="business-outline" size={48} color="#666" />
          <Text style={styles.noClientText}>No client information added</Text>
          <Text style={styles.noClientSubtext}>
            {editing ? 'Add your company details to get started' : 'Client information not yet provided'}
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

// ENHANCED LOCATION MANAGER
const LocationManager = ({ location, onUpdate, editing }) => {
  const [gettingLocation, setGettingLocation] = useState(false);

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is required');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000
      });

      const { latitude, longitude } = locationData.coords;
      
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      const readableAddress = address[0] 
        ? `${address[0].name || ''} ${address[0].city || ''} ${address[0].region || ''} ${address[0].country || ''}`.trim()
        : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      onUpdate({
        latitude,
        longitude,
        address: readableAddress,
        accuracy: locationData.coords.accuracy,
        lastUpdated: new Date().toISOString(),
        verified: true
      });

      Alert.alert('Success', 'Location updated successfully');
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleManualLocation = () => {
    Alert.prompt(
      'Enter Your Location',
      'Type your full address:',
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
                verified: false
              });
            }
          }
        }
      ],
      'plain-text',
      location?.address || 'e.g., 123 Main Street, City, State'
    );
  };

  return (
    <View style={styles.locationSection}>
      <Text style={styles.sectionTitle}>Service Location</Text>
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
            <Text style={styles.locationTimestamp}>
              Updated {new Date(location.lastUpdated).toLocaleDateString()}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.noLocation}>
          <Icon name="location-outline" size={48} color="#666" />
          <Text style={styles.noLocationText}>No location set</Text>
          <Text style={styles.noLocationSubtext}>
            Add your location to find local opportunities
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
    </View>
  );
};

// FIXED BOTTOM NAVIGATION WITH DASHBOARD-MATCHING ICONS
const AdvancedBottomNavigation = ({ activeTab, onTabChange, navigation }) => {
  const tabs = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: (color, size) => VectorIcons.home(color, size),
      screen: 'DashboardScreen'
    },
    { 
      id: 'search', 
      label: 'Discover', 
      icon: (color, size) => VectorIcons.search(color, size),
      screen: 'DiscoverScreen'
    },
    { 
      id: 'marketplace', 
      label: 'Market', 
      icon: (color, size) => VectorIcons.marketplace(color, size),
      screen: 'MarketplaceScreen'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: (color, size) => VectorIcons.profile(color, size),
      screen: 'AdvancedEnterprisePlatform'
    },
  ];

  const handleTabPress = (tab) => {
    if (tab.screen && tab.screen !== 'AdvancedEnterprisePlatform') {
      navigation.navigate(tab.screen);
    } else {
      onTabChange(tab.id);
    }
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
    updateProfile,
    updateFarmDetails,
    updateClientDetails,
    addSkill,
    removeSkill,
    updateProfileImage,
    switchUserType,
    saveProfile,
    loadProfile,
    resetProfile,
    showRoleExamples,
    setShowRoleExamples,
    handleRoleEditPress
  } = useAdvancedEnterpriseProfile();

  const [refreshing, setRefreshing] = useState(false);
  const [bottomNavTab, setBottomNavTab] = useState('profile');
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, [loadProfile]);

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Check out ${profile?.displayName}'s professional profile on VSXchange Platform!`,
        title: `${profile?.displayName}'s Professional Profile`
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  // User types for role examples modal
  const userTypes = [
    {
      type: 'skilled',
      icon: 'construct',
      title: 'Skilled Professional',
      description: 'Offer vocational services and expertise',
      color: '#00f0a8',
      examples: ['Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Technician']
    },
    {
      type: 'farmer',
      icon: 'leaf',
      title: 'Farmer & Agri-Expert',
      description: 'Agricultural services and farm management',
      color: '#4CD964',
      examples: ['Crop Farmer', 'Livestock Farmer', 'Dairy Farmer', 'Agri-Consultant']
    },
    {
      type: 'client',
      icon: 'business',
      title: 'Client & Project Owner',
      description: 'Find and hire skilled professionals',
      color: '#007AFF',
      examples: ['Homeowner', 'Business Owner', 'Project Manager', 'Contractor']
    }
  ];

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00f0a8" />
        <Text style={styles.loadingText}>Loading Professional Profile...</Text>
      </SafeAreaView>
    );
  }

  const ProfileHeader = () => (
    <Animated.View style={styles.header}>
      <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.headerGradient}>
        <View style={styles.headerContent}>
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
            </View>
          </View>

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
                      onSave={(value) => updateProfile({ firstName: value })}
                      placeholder="First Name"
                      style={styles.nameInput}
                      required
                    />
                    <EditableField
                      value={profile.lastName}
                      onSave={(value) => updateProfile({ lastName: value })}
                      placeholder="Last Name"
                      style={styles.nameInput}
                      required
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
              </View>
            </View>
          </View>

          {/* FIXED: User Type Selector with proper navigation */}
          <UserTypeSelector
            currentType={profile.userType}
            onTypeChange={switchUserType}
            editing={editing}
            onRoleEditPress={handleRoleEditPress}
          />

          {lastSave && (
            <View style={styles.saveStatus}>
              <Icon name="checkmark-circle" size={12} color="#00f0a8" />
              <Text style={styles.saveStatusText}>
                Saved {new Date(lastSave).toLocaleTimeString()}
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
          <ScrollView 
            style={styles.tabContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Bio</Text>
              <EditableField
                value={profile.bio}
                onSave={(value) => updateProfile({ bio: value })}
                placeholder="Tell us about your professional background, expertise, and what makes you unique..."
                multiline={true}
                style={styles.bioField}
              />
            </View>

            <SkillManager
              skills={profile.skills}
              userType={profile.userType}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
              editing={editing}
            />

            {/* FIXED: Role-specific sections now properly navigate and display */}
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

            <LocationManager
              location={profile.location}
              onUpdate={(location) => updateProfile({ location })}
              editing={editing}
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <EditableField
                value={profile.contactInfo?.phone}
                onSave={(value) => updateProfile({ contactInfo: { ...profile.contactInfo, phone: value } })}
                placeholder="+1 (555) 123-4567"
                label="Phone Number"
                type="phone"
              />
              <EditableField
                value={profile.contactInfo?.email}
                onSave={(value) => updateProfile({ contactInfo: { ...profile.contactInfo, email: value } })}
                placeholder="your.email@example.com"
                label="Email Address"
                type="email"
              />
            </View>
          </ScrollView>
        );

      case 'portfolio':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Portfolio</Text>
            <View style={styles.comingSoonSection}>
              <Icon name="images" size={64} color="#666" />
              <Text style={styles.comingSoonTitle}>Portfolio Gallery</Text>
              <Text style={styles.comingSoonText}>
                Showcase your work with images and project details
              </Text>
            </View>
          </View>
        );

      case 'services':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.comingSoonSection}>
              <Icon name="construct" size={64} color="#666" />
              <Text style={styles.comingSoonTitle}>Service Management</Text>
              <Text style={styles.comingSoonText}>
                Manage your services and pricing
              </Text>
            </View>
          </View>
        );

      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <View style={styles.ratingOverview}>
              <Text style={styles.ratingNumber}>{profile.rating}</Text>
              <View style={styles.ratingStars}>
                {[1,2,3,4,5].map((star) => (
                  <Icon 
                    key={star}
                    name={star <= Math.floor(profile.rating) ? "star" : "star-outline"} 
                    size={24} 
                    color="#FFD700" 
                  />
                ))}
              </View>
              <Text style={styles.ratingCount}>
                Based on {profile.completedProjects} projects
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

      <View style={styles.contentContainer}>
        <TabContent />
      </View>

      {/* FIXED: Role Examples Modal for proper role selection */}
      <RoleExamplesModal
        visible={showRoleExamples}
        onClose={() => setShowRoleExamples(false)}
        userTypes={userTypes}
        currentType={profile.userType}
        onRoleSelect={switchUserType}
      />

      <AdvancedBottomNavigation 
        activeTab={bottomNavTab}
        onTabChange={setBottomNavTab}
        navigation={navigation}
      />

      {saving && (
        <View style={styles.savingOverlay}>
          <View style={styles.savingContent}>
            <ActivityIndicator size="large" color="#00f0a8" />
            <Text style={styles.savingOverlayText}>Saving Changes...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// COMPREHENSIVE STYLES - OPTIMIZED AND ENHANCED
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
    backgroundColor: '#000',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
  },
  headerContent: {
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
  },
  headerTitle: {
    alignItems: 'center',
    flex: 1,
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
  },
  shareButton: {
    padding: 8,
    marginRight: 8,
  },
  editButton: {
    padding: 8,
  },
  editButtonActive: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderRadius: 20,
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
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    marginBottom: 6,
  },
  examplesPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  examplePreviewText: {
    color: '#666',
    fontSize: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  moreExamplesText: {
    color: '#666',
    fontSize: 10,
    fontStyle: 'italic',
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
  },
  typeOptions: {
    gap: 12,
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
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  examplesContainer: {
    marginBottom: 8,
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
    gap: 6,
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
  roleChangeNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  roleChangeNoteText: {
    color: '#00f0a8',
    fontSize: 12,
    flex: 1,
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
  section: {
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
  },
  editSectionButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bioField: {
    minHeight: 120,
  },
  viewField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
  },
  placeholderText: {
    color: '#666',
    fontStyle: 'italic',
  },
  editFieldContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
    overflow: 'hidden',
    marginBottom: 10,
  },
  editField: {
    color: '#fff',
    fontSize: 16,
    padding: 15,
    minHeight: 50,
  },
  multilineField: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  fieldError: {
    borderColor: '#ff6b6b',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginLeft: 4,
  },
  optionsContainer: {
    maxHeight: 200,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  optionItemSelected: {
    backgroundColor: 'rgba(0,240,168,0.1)',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  editButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  cancelButtonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
  },
  saveButtonText: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '600',
  },
  skillManager: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  skillTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  skillSubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  addSkillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  addSkillText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  skillsGrid: {
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  skillMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillCategory: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
  },
  skillLevel: {
    color: '#666',
    fontSize: 10,
  },
  skillYears: {
    color: '#666',
    fontSize: 10,
  },
  certifiedBadge: {
    backgroundColor: '#00f0a8',
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeSkillButton: {
    padding: 4,
  },
  noSkills: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noSkillsText: {
    color: '#666',
    fontSize: 16,
    marginTop: 8,
    fontStyle: 'italic',
  },
  noSkillsSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
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
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  categoryChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  levelOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  },
  yearsSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
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
  },
  addDetailsButton: {
    backgroundColor: '#00f0a8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },
  addDetailsButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
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
  cropInputContainer: {
    marginBottom: 8,
  },
  cropInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectedCrops: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
    gap: 12,
  },
  organicToggleSwitch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  organicToggleSwitchActive: {
    backgroundColor: '#4CD964',
  },
  organicToggleText: {
    color: '#fff',
    fontSize: 14,
  },
  // Client Styles
  clientSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
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
  projectInputContainer: {
    marginBottom: 8,
  },
  projectInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectedProjects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  // Location Styles
  locationSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
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
  // Role Examples Modal Styles
  roleExamplesOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleExamplesContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  roleExamplesHeader: {
    marginBottom: 20,
  },
  roleExamplesTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  roleExamplesSubtitle: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  roleExamplesList: {
    maxHeight: 400,
  },
  roleExampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  roleExampleItemSelected: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    borderWidth: 2,
    borderColor: '#00f0a8',
  },
  roleExampleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleExampleInfo: {
    flex: 1,
  },
  roleExampleTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  roleExampleDescription: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8,
  },
  roleExampleExamples: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  roleExampleExample: {
    color: '#00f0a8',
    fontSize: 10,
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleExampleSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleExamplesClose: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginTop: 12,
  },
  roleExamplesCloseText: {
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
  },
  // Rating Overview
  ratingOverview: {
    alignItems: 'center',
    padding: 40,
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
  },
  savingOverlayText: {
    color: '#00f0a8',
    fontSize: 16,
    marginTop: 10,
  },
});