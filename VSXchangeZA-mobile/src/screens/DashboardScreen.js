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
  PanResponder,
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

// ADVANCED VECTOR ICONS SYSTEM - MATCHING DASHBOARD SCREEN
const VectorIcons = {
  // Bottom Navigation Icons - Matching DashboardScreen
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

  // Professional Category Icons - Enhanced for better matching
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
  )
};

// ENHANCED ENTERPRISE STATE MANAGEMENT
const useAdvancedEnterpriseProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSave, setLastSave] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const saveTimeoutRef = useRef(null);

  // Enhanced default profile with James Carter data
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
      },
      {
        id: 'skill_2',
        name: 'Commercial Installation',
        category: 'electrical',
        subcategory: 'Commercial Installation',
        level: 'expert',
        years: 6,
        certified: true
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
        popular: true
      }
    ],
    portfolio: [],
    certifications: [
      {
        id: 'cert_1',
        name: 'Certified Electrician',
        issuer: 'National Electrical Association',
        year: 2016,
        verified: true
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
      harvestSeasons: []
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

  // Enhanced load profile with backup systems
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
      // Fallback to default
      setProfile(defaultProfile);
    } finally {
      setLoading(false);
    }
  }, []);

  // Enhanced real-time save with backup
  const saveProfile = useCallback(async (newProfile) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        const profileToSave = newProfile || profile;
        const timestamp = new Date().toISOString();
        
        // Enhanced save with backup
        await AsyncStorage.setItem('advanced_enterprise_profile', JSON.stringify({
          ...profileToSave,
          lastUpdated: timestamp,
          metadata: {
            ...profileToSave.metadata,
            lastBackup: timestamp
          }
        }));

        // Create backup
        await AsyncStorage.setItem('advanced_enterprise_profile_backup', JSON.stringify(profileToSave));
        
        setLastSave(timestamp);
        
        console.log('Profile saved with backup');
      } catch (error) {
        console.error('Save error:', error);
        // Try backup save
        try {
          await AsyncStorage.setItem('advanced_enterprise_profile_emergency', JSON.stringify(profile));
        } catch (e) {
          console.error('Emergency save failed:', e);
        }
      } finally {
        setSaving(false);
      }
    }, 800); // Reduced debounce for better real-time feel
  }, [profile]);

  // Enhanced update with analytics
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

  // Enhanced portfolio management
  const addPortfolioItem = useCallback(async (imageAsset) => {
    try {
      const portfolioItem = {
        id: `portfolio_${Date.now()}`,
        uri: imageAsset.uri,
        filename: imageAsset.fileName || `portfolio_${Date.now()}.jpg`,
        description: '',
        uploaded: new Date().toISOString(),
        size: imageAsset.fileSize,
        dimensions: { width: imageAsset.width, height: imageAsset.height }
      };

      setProfile(prev => {
        const newProfile = {
          ...prev,
          portfolio: [...(prev.portfolio || []), portfolioItem],
          lastUpdated: new Date().toISOString()
        };
        saveProfile(newProfile);
        return newProfile;
      });

      return true;
    } catch (error) {
      console.error('Portfolio add failed:', error);
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
        saveProfile(newProfile);
        return newProfile;
      });
      return true;
    } catch (error) {
      console.error('Profile image update failed:', error);
      return false;
    }
  }, [saveProfile]);

  // Reset profile to defaults
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
    updateProfile,
    updateFarmDetails,
    updateClientDetails,
    addSkill,
    removeSkill,
    addPortfolioItem,
    updateProfileImage,
    saveProfile,
    loadProfile,
    resetProfile,
    calculateProfileCompleteness
  };
};

// ADVANCED IMAGE MANAGEMENT SYSTEM
const useImageManager = () => {
  const [uploading, setUploading] = useState(false);

  const pickImage = useCallback(async (options = {}) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera roll access is needed');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options.allowsEditing ?? true,
        allowsMultipleSelection: options.allowsMultipleSelection ?? false,
        aspect: options.aspect || [1, 1],
        quality: options.quality || 0.8,
        exif: true
      });

      if (!result.canceled && result.assets) {
        return result.assets;
      }
      return null;
    } catch (error) {
      console.error('Image pick failed:', error);
      Alert.alert('Error', 'Failed to pick image');
      return null;
    }
  }, []);

  const captureImage = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera access is needed');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8
      });

      if (!result.canceled && result.assets) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Camera capture failed:', error);
      Alert.alert('Error', 'Failed to capture image');
      return null;
    }
  }, []);

  const optimizeImage = useCallback(async (uri) => {
    try {
      // In a real app, you'd compress and optimize the image
      // For now, we return the original URI
      return uri;
    } catch (error) {
      console.error('Image optimization failed:', error);
      return uri;
    }
  }, []);

  return {
    uploading,
    setUploading,
    pickImage,
    captureImage,
    optimizeImage
  };
};

// PROFILE IMAGE EDITOR COMPONENT - FIXED VERSION
const ProfileImageEditor = ({ profileImage, onImageUpdate, editing }) => {
  const { pickImage, captureImage, uploading, setUploading } = useImageManager();
  const [showImageOptions, setShowImageOptions] = useState(false);

  const handleImageSelect = async (source) => {
    setShowImageOptions(false);
    setUploading(true);

    try {
      let imageAsset;
      
      if (source === 'camera') {
        imageAsset = await captureImage();
      } else {
        const assets = await pickImage({ allowsEditing: true, aspect: [1, 1] });
        imageAsset = assets?.[0];
      }

      if (imageAsset) {
        const success = await onImageUpdate(imageAsset.uri);
        if (success) {
          Alert.alert('Success', 'Profile picture updated successfully');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.profileImageSection}>
      <TouchableOpacity 
        style={styles.avatarContainer}
        onPress={() => editing && setShowImageOptions(true)}
        disabled={!editing || uploading}
      >
        <View style={styles.avatarWrapper}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={40} color="#666" />
            </View>
          )}
          
          {uploading && (
            <View style={styles.uploadOverlay}>
              <ActivityIndicator size="large" color="#00f0a8" />
            </View>
          )}
          
          {editing && !uploading && (
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

// ENHANCED CATEGORY SYSTEM WITH MORE OPTIONS
const useAdvancedCategorySystem = (userType) => {
  const categories = {
    skilled: {
      electrical: ['Residential Wiring', 'Commercial Installation', 'Safety Inspection', 'Panel Upgrade', 'Lighting Installation', 'Generator Installation', 'Solar Panel Installation', 'Emergency Repair'],
      plumbing: ['Pipe Installation', 'Leak Repair', 'Water Heater', 'Drain Cleaning', 'Fixture Installation', 'Sewer Line', 'Gas Line', 'Water Treatment'],
      carpentry: ['Framing', 'Finishing', 'Cabinet Making', 'Furniture Building', 'Structural Repair', 'Deck Building', 'Custom Millwork', 'Restoration'],
      mechanical: ['Engine Repair', 'Equipment Maintenance', 'Diagnostic', 'Preventive Maintenance', 'Parts Replacement', 'HVAC', 'Automotive', 'Heavy Machinery'],
      construction: ['Renovation', 'New Construction', 'Demolition', 'Structural Work', 'Project Management', 'Masonry', 'Roofing', 'Flooring'],
      technology: ['Network Setup', 'Computer Repair', 'Smart Home', 'Security Systems', 'Software Installation', 'Data Recovery', 'IT Support', 'CCTV Installation'],
      other: ['Painting', 'Landscaping', 'Cleaning', 'Moving', 'Assembly', 'Delivery', 'Consultation']
    },
    farmer: {
      crops: ['Maize/Corn', 'Wheat', 'Soybeans', 'Vegetables', 'Fruits', 'Grains', 'Organic Crops', 'Coffee', 'Tea', 'Cotton', 'Sugarcane'],
      livestock: ['Cattle', 'Poultry', 'Swine', 'Dairy', 'Sheep/Goats', 'Fish Farming', 'Beekeeping', 'Horse Breeding', 'Aquaculture'],
      equipment: ['Tractors', 'Harvesters', 'Irrigation Systems', 'Planters', 'Sprayers', 'Balers', 'Cultivators', 'Seeders'],
      specialties: ['Organic Farming', 'Hydroponics', 'Precision Agriculture', 'Sustainable Farming', 'Greenhouse', 'Vermiculture', 'Agroforestry', 'Permaculture'],
      skills: ['Soil Analysis', 'Crop Rotation', 'Pest Management', 'Irrigation Management', 'Harvest Planning', 'Livestock Care', 'Equipment Maintenance', 'Market Analysis']
    },
    client: {
      projectTypes: ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Renovation', 'New Construction', 'Maintenance', 'Emergency Repair'],
      serviceNeeds: ['Electrical', 'Plumbing', 'Carpentry', 'Mechanical', 'Construction', 'Technology', 'Farming', 'Consultation'],
      timelines: ['Immediate', '1-2 Weeks', '1 Month', '3 Months', '6 Months+', 'Ongoing'],
      budgets: ['Under $1k', '$1k-$5k', '$5k-$10k', '$10k-$25k', '$25k-$50k', '$50k+']
    }
  };

  const getCategories = useCallback(() => {
    return categories[userType] || {};
  }, [userType]);

  const getSubcategories = useCallback((category) => {
    return categories[userType]?.[category] || [];
  }, [userType]);

  return {
    getCategories,
    getSubcategories,
    categories
  };
};

// REAL-TIME EDITING COMPONENTS - FIXED PERFORMANCE
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
    if (type === 'email' && input) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) return 'Please enter a valid email';
    }
    if (type === 'phone' && input) {
      const phoneRegex = /^\+?[\d\s-()]+$/;
      if (!phoneRegex.test(input)) return 'Please enter a valid phone number';
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
          keyboardType={
            type === 'email' ? 'email-address' :
            type === 'phone' ? 'phone-pad' :
            type === 'number' ? 'numeric' : 'default'
          }
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

// USER TYPE SELECTOR - FIXED PERFORMANCE
const UserTypeSelector = ({ currentType, onTypeChange, editing }) => {
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

// SKILL MANAGER COMPONENT - FIXED PERFORMANCE
const SkillManager = ({ 
  skills = [], 
  userType, 
  onAddSkill, 
  onRemoveSkill, 
  editing 
}) => {
  const { getCategories, getSubcategories } = useAdvancedCategorySystem(userType);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    subcategory: '',
    level: 'intermediate',
    years: 1,
    certified: false
  });

  const categories = getCategories();
  const subcategories = newSkill.category ? getSubcategories(newSkill.category) : [];

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
    setNewSkill({ name: '', category: '', subcategory: '', level: 'intermediate', years: 1, certified: false });
    setShowAddSkill(false);
  };

  const SkillChip = ({ skill, onRemove }) => (
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
            {userType === 'skilled' && 'Skills & Expertise'}
            {userType === 'farmer' && 'Farm Specialties & Equipment'}
            {userType === 'client' && 'Service Interests'}
          </Text>
          <Text style={styles.skillSubtitle}>
            {skills.length} {skills.length === 1 ? 'skill' : 'skills'} added
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
            onRemove={() => onRemoveSkill(skill.id)} 
          />
        ))}
        
        {skills.length === 0 && (
          <View style={styles.noSkills}>
            <Icon name="construct-outline" size={48} color="#666" />
            <Text style={styles.noSkillsText}>No skills added yet</Text>
            <Text style={styles.noSkillsSubtext}>
              Add your skills to showcase your expertise
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
              <Text style={styles.modalTitle}>Add New Skill</Text>
              <TouchableOpacity 
                onPress={() => setShowAddSkill(false)}
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
                  value={newSkill.name}
                  onChangeText={(text) => setNewSkill(prev => ({ ...prev, name: text }))}
                  placeholder="e.g., Electrical Wiring, Crop Management"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {Object.keys(categories).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        newSkill.category === category && styles.categoryChipSelected
                      ]}
                      onPress={() => setNewSkill(prev => ({ ...prev, category, subcategory: '' }))}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.categoryChipText}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {newSkill.category && (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Specialization</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {subcategories.map((subcat) => (
                      <TouchableOpacity
                        key={subcat}
                        style={[
                          styles.subcategoryChip,
                          newSkill.subcategory === subcat && styles.subcategoryChipSelected
                        ]}
                        onPress={() => setNewSkill(prev => ({ ...prev, subcategory: subcat }))}
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
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                    { value: 'expert', label: 'Expert' }
                  ].map((level) => (
                    <TouchableOpacity
                      key={level.value}
                      style={[
                        styles.levelChip,
                        newSkill.level === level.value && styles.levelChipSelected
                      ]}
                      onPress={() => setNewSkill(prev => ({ ...prev, level: level.value }))}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.levelChipText}>{level.label}</Text>
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

              <View style={styles.formGroup}>
                <TouchableOpacity
                  style={[
                    styles.certifiedToggle,
                    newSkill.certified && styles.certifiedToggleActive
                  ]}
                  onPress={() => setNewSkill(prev => ({ ...prev, certified: !prev.certified }))}
                  activeOpacity={0.7}
                >
                  <View style={styles.certifiedToggleContent}>
                    <View style={[
                      styles.certifiedToggleSwitch,
                      newSkill.certified && styles.certifiedToggleSwitchActive
                    ]}>
                      <Icon 
                        name={newSkill.certified ? "checkmark" : "close"} 
                        size={12} 
                        color="#000" 
                      />
                    </View>
                    <Text style={styles.certifiedToggleText}>
                      Certified in this skill
                    </Text>
                  </View>
                </TouchableOpacity>
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
                  (!newSkill.name || !newSkill.category) && styles.saveModalButtonDisabled
                ]}
                onPress={handleAddSkill}
                disabled={!newSkill.name || !newSkill.category}
                activeOpacity={0.7}
              >
                <Text style={styles.saveModalText}>Add Skill</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ENHANCED FARMER PROFILE COMPONENT - FIXED PERFORMANCE
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

// ENHANCED CLIENT PROFILE COMPONENT - FIXED PERFORMANCE
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

// LOCATION MANAGER - FIXED PERFORMANCE
const LocationManager = ({ location, onUpdate, editing }) => {
  const [gettingLocation, setGettingLocation] = useState(false);

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for accurate service matching');
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

      Alert.alert('Success', 'Location updated with high accuracy');
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get current location. Please try manual entry.');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleManualLocation = () => {
    Alert.prompt(
      'Enter Your Location',
      'Type your full address for better service matching:',
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

// ADVANCED BOTTOM NAVIGATION WITH VECTOR ICONS - FIXED PERFORMANCE
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

// MAIN ENHANCED ENTERPRISE PLATFORM - FIXED SCROLLING AND ADAPTIVE ISSUES
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
    addPortfolioItem,
    updateProfileImage,
    saveProfile,
    loadProfile,
    resetProfile
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
          {/* Enhanced Top Bar */}
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

              {/* Enhanced Professional Stats */}
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
                  onPress={() => console.log('Call:', profile.contactInfo?.phone)}
                  activeOpacity={0.7}
                >
                  <Icon name="call" size={18} color="#00f0a8" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Enhanced User Type Selector */}
          <UserTypeSelector
            currentType={profile.userType}
            onTypeChange={(type) => updateProfile({ userType: type })}
            editing={editing}
          />

          {/* Enhanced Save Status */}
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
            {/* Professional Bio */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Bio</Text>
              <EditableField
                value={profile.bio}
                onSave={(value) => updateProfile({ bio: value })}
                placeholder="Tell us about your professional background, expertise, and what makes you unique..."
                multiline={true}
                style={styles.bioField}
                label="About Me"
              />
            </View>

            {/* Skills & Expertise */}
            <SkillManager
              skills={profile.skills}
              userType={profile.userType}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
              editing={editing}
            />

            {/* User Type Specific Sections */}
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

            {/* Enhanced Location */}
            <LocationManager
              location={profile.location}
              onUpdate={(location) => updateProfile({ location })}
              editing={editing}
            />

            {/* Enhanced Contact Information */}
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
              {editing && (
                <TouchableOpacity 
                  style={styles.comingSoonButton}
                  activeOpacity={0.7}
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

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNavigation 
        activeTab={bottomNavTab}
        onTabChange={setBottomNavTab}
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

// COMPLETE ENTERPRISE-LEVEL STYLES - OPTIMIZED FOR SCROLLING
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
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
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
  sectionSubtitle: {
    color: '#666',
    fontSize: 12,
    marginBottom: 15,
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
    textTransform: 'capitalize',
  },
  skillSubcategory: {
    color: '#666',
    fontSize: 10,
  },
  skillLevel: {
    color: '#666',
    fontSize: 10,
    textTransform: 'capitalize',
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
    marginBottom: 16,
  },
  addFirstSkillButton: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  addFirstSkillText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
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
  locationSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  locationDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    backgroundColor: '#00f0a8',
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  locationInfo: {
    flex: 1,
  },
  locationAddress: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  locationCoords: {
    color: '#666',
    fontSize: 12,
  },
  locationAccuracy: {
    color: '#666',
    fontSize: 12,
  },
  locationTimestamp: {
    color: '#666',
    fontSize: 10,
  },
  noLocation: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noLocationText: {
    color: '#666',
    fontSize: 16,
    marginTop: 8,
    fontStyle: 'italic',
  },
  noLocationSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
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
    padding: 15,
    borderRadius: 12,
  },
  locationButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryLocationButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  secondaryLocationButtonText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
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
  comingSoonButton: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  comingSoonButtonText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
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
  imageOptionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOptionsContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    width: '80%',
    overflow: 'hidden',
  },
  imageOptionsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  imageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  imageOptionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  removeOption: {
    borderBottomWidth: 0,
  },
  removeOptionText: {
    color: '#ff6b6b',
  },
  cancelOption: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  cancelOptionText: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '600',
  },
});