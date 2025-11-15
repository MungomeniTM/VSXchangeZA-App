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
  Vibration,
  Switch,
  LayoutAnimation,
  FlatList,
  Share,
  KeyboardAvoidingView,
  RefreshControl,
  PanResponder
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

// ADVANCED VECTOR ICONS SYSTEM
const VectorIcons = {
  // Bottom Navigation Icons
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

  // Professional Category Icons
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
        Vibration.vibrate(50);
        
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
    let completeness = 0;
    const fields = [
      profileData.firstName,
      profileData.lastName,
      profileData.profession,
      profileData.bio,
      profileData.profileImage,
      profileData.location,
      profileData.skills.length > 0
    ];

    const userTypeFields = {
      skilled: [profileData.skills.length > 0],
      farmer: [profileData.farmDetails.farmName, profileData.farmDetails.farmType],
      client: [profileData.clientDetails.companyName, profileData.clientDetails.industry]
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
        skills: [...prev.skills, newSkill],
        lastUpdated: new Date().toISOString(),
        profileCompleteness: calculateProfileCompleteness({ ...prev, skills: [...prev.skills, newSkill] })
      };
      saveProfile(newProfile);
      return newProfile;
    });
  }, [saveProfile]);

  const removeSkill = useCallback((skillId) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        skills: prev.skills.filter(skill => skill.id !== skillId),
        lastUpdated: new Date().toISOString(),
        profileCompleteness: calculateProfileCompleteness({ ...prev, skills: prev.skills.filter(skill => skill.id !== skillId) })
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
          portfolio: [...prev.portfolio, portfolioItem],
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

// ENHANCED FARMER PROFILE COMPONENT
const FarmerProfileManager = ({ farmDetails, onUpdate, editing }) => {
  const [showFarmEditor, setShowFarmEditor] = useState(false);
  const [tempFarmDetails, setTempFarmDetails] = useState(farmDetails);

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
              setTempFarmDetails(farmDetails);
              setShowFarmEditor(true);
            }}
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
          {farmDetails.mainCrops.length > 0 && (
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
          {farmDetails.equipment.length > 0 && (
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
      <Modal visible={showFarmEditor} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Farm Details</Text>
              <TouchableOpacity onPress={() => setShowFarmEditor(false)}>
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
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Main Crops</Text>
                <View style={styles.cropInputContainer}>
                  <TextInput
                    style={styles.cropInput}
                    placeholder="Add a crop"
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
                      <TouchableOpacity onPress={() => removeCrop(crop)}>
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
                      <TouchableOpacity onPress={() => removeEquipment(item)}>
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

// ENHANCED CLIENT PROFILE COMPONENT
const ClientProfileManager = ({ clientDetails, onUpdate, editing }) => {
  const [showClientEditor, setShowClientEditor] = useState(false);
  const [tempClientDetails, setTempClientDetails] = useState(clientDetails);

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
              setTempClientDetails(clientDetails);
              setShowClientEditor(true);
            }}
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
          {clientDetails.projectTypes.length > 0 && (
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
          {clientDetails.budgetRange.min > 0 && (
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
      <Modal visible={showClientEditor} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Client Details</Text>
              <TouchableOpacity onPress={() => setShowClientEditor(false)}>
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
                      <TouchableOpacity onPress={() => removeProjectType(type)}>
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
    { key: 'home', label: 'Home', icon: VectorIcons.home },
    { key: 'search', label: 'Discover', icon: VectorIcons.search },
    { key: 'marketplace', label: 'Market', icon: VectorIcons.marketplace },
    { key: 'profile', label: 'Profile', icon: VectorIcons.profile }
  ];

  return (
    <View style={styles.bottomNavigation}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.navItem,
            activeTab === tab.key && styles.navItemActive
          ]}
          onPress={() => onTabChange(tab.key)}
        >
          {tab.icon(
            activeTab === tab.key ? '#00f0a8' : '#666',
            24
          )}
          <Text style={[
            styles.navLabel,
            activeTab === tab.key && styles.navLabelActive
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// MAIN ENHANCED ENTERPRISE PLATFORM
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, [loadProfile]);

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Check out ${profile.displayName}'s professional profile on VSXchange Platform!`,
        title: `${profile.displayName}'s Professional Profile`,
        url: 'https://vsxchangeza.com/profiles/' + profile.id
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  const ProfileCompletenessBar = ({ completeness }) => (
    <View style={styles.completenessSection}>
      <View style={styles.completenessHeader}>
        <Text style={styles.completenessTitle}>Profile Completeness</Text>
        <Text style={styles.completenessPercentage}>{completeness}%</Text>
      </View>
      <View style={styles.completenessBar}>
        <View 
          style={[
            styles.completenessFill,
            { width: `${completeness}%` }
          ]} 
        />
      </View>
      <Text style={styles.completenessHint}>
        {completeness < 50 ? 'Add more details to improve your profile' :
         completeness < 80 ? 'Great start! Keep adding details' :
         'Excellent! Your profile is nearly complete'}
      </Text>
    </View>
  );

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00f0a8" />
        <Text style={styles.loadingText}>Loading Advanced Platform...</Text>
      </SafeAreaView>
    );
  }

  const ProfileHeader = () => (
    <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.header}>
      <View style={styles.headerContent}>
        {/* Enhanced Top Bar */}
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
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
            >
              <Icon name="share-social" size={20} color="#00f0a8" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.editButton, editing && styles.editButtonActive]}
              onPress={() => setEditing(!editing)}
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

            {/* Profile Completeness */}
            <ProfileCompletenessBar completeness={profile.profileCompleteness} />

            {/* Enhanced Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => navigation.navigate('Messages', { user: profile })}
              >
                <Icon name="chatbubble-ellipses" size={18} color="#000" />
                <Text style={styles.contactButtonText}>Message</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.hireButton}
                onPress={() => navigation.navigate('Booking', { professional: profile })}
              >
                <Icon name="calendar" size={18} color="#000" />
                <Text style={styles.hireButtonText}>Hire Now</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.callButton}
                onPress={() => console.log('Call:', profile.contactInfo.phone)}
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
                value={profile.contactInfo.phone}
                onSave={(value) => updateProfile({ contactInfo: { ...profile.contactInfo, phone: value } })}
                placeholder="+1 (555) 123-4567"
                label="Phone Number"
                type="phone"
              />
              <EditableField
                value={profile.contactInfo.email}
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
            <Text style={styles.sectionTitle}>Portfolio Gallery</Text>
            <View style={styles.comingSoonSection}>
              <Icon name="images" size={64} color="#666" />
              <Text style={styles.comingSoonTitle}>Advanced Portfolio</Text>
              <Text style={styles.comingSoonText}>
                Showcase your work with high-resolution images, project descriptions, and client testimonials
              </Text>
              {editing && (
                <TouchableOpacity style={styles.comingSoonButton}>
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

// COMPREHENSIVE ENTERPRISE-LEVEL STYLES
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
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
  completenessSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  completenessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completenessTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  completenessPercentage: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
  },
  completenessBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  completenessFill: {
    height: '100%',
    backgroundColor: '#00f0a8',
    borderRadius: 3,
  },
  completenessHint: {
    color: '#666',
    fontSize: 10,
    marginTop: 6,
    fontStyle: 'italic',
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
  // ... (include all other styles from previous implementation)
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
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
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
  // ... (include all other specialized styles for farm, client, etc.)
  // COMPLETE SPECIALIZED STYLES FOR FARM, CLIENT AND ALL COMPONENTS
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
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
  completenessSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  completenessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completenessTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  completenessPercentage: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
  },
  completenessBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  completenessFill: {
    height: '100%',
    backgroundColor: '#00f0a8',
    borderRadius: 3,
  },
  completenessHint: {
    color: '#666',
    fontSize: 10,
    marginTop: 6,
    fontStyle: 'italic',
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

  // User Type Selector Styles
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

  // Tab Navigation Styles
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

  // Section Styles
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

  // Editable Field Styles
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

  // Skill Manager Styles
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

  // Farm Section Styles
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
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
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

  // Client Section Styles
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

  // Modal Styles
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

  // Form Styles
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

  // Farm Modal Specific Styles
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

  // Client Modal Specific Styles
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

  // Modal Action Buttons
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

  // Location Manager Styles
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

  // Bottom Navigation Styles
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

  // Coming Soon/Placeholder Styles
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

  // Rating Styles
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

  // Saving Overlay Styles
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

  // Image Options Styles
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

