// src/screens/EnterpriseProfileScreen.js - COMPLETE FUTURISTIC PLATFORM
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
  RefreshControl
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { AppContext } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// AI-POWERED PROFILE OPTIMIZATION ENGINE
const useAIOptimization = (profile) => {
  const [optimizationScore, setOptimizationScore] = useState(0);
  const [improvementTips, setImprovementTips] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const analyzeProfile = useCallback(() => {
    let score = 0;
    const tips = [];
    const suggestions = [];

    // Profile Completeness (40 points)
    if (profile?.firstName && profile?.lastName) score += 10;
    if (profile?.profileImage) score += 10;
    if (profile?.bio && profile.bio.length > 100) score += 10;
    if (profile?.skills?.length >= 3) score += 10;

    // Professional Metrics (30 points)
    if (profile?.experienceYears >= 3) score += 10;
    if (profile?.rating >= 4.5) score += 10;
    if (profile?.completedProjects >= 50) score += 10;

    // Content Quality (30 points)
    if (profile?.portfolio?.length >= 3) score += 10;
    if (profile?.services?.length >= 2) score += 10;
    if (profile?.location) score += 10;

    // AI-Powered Improvement Tips
    if (!profile?.profileImage) {
      tips.push({
        id: 'add-photo',
        title: 'Add Professional Photo',
        description: 'Increase trust with a professional profile picture',
        priority: 'high',
        icon: 'camera',
        action: 'upload_photo'
      });
    }

    if (!profile?.bio || profile.bio.length < 100) {
      tips.push({
        id: 'enhance-bio',
        title: 'Enhance Your Bio',
        description: 'Write a detailed bio to showcase your expertise',
        priority: 'medium',
        icon: 'document-text',
        action: 'edit_bio'
      });
    }

    if (profile?.skills?.length < 3) {
      tips.push({
        id: 'add-skills',
        title: 'Add More Skills',
        description: 'Showcase your full range of expertise',
        priority: 'high',
        icon: 'construct',
        action: 'add_skills'
      });
    }

    if (!profile?.location) {
      tips.push({
        id: 'set-location',
        title: 'Set Your Location',
        description: 'Enable local job matching and service discovery',
        priority: 'medium',
        icon: 'location',
        action: 'set_location'
      });
    }

    // AI Skill Suggestions based on profile
    if (profile?.userType === 'skilled') {
      suggestions.push({
        id: 'suggestion-1',
        type: 'skill',
        title: 'Advanced Electrical Certification',
        description: 'Based on your experience, consider getting advanced certifications',
        confidence: 0.85,
        category: 'electrical'
      });
    }

    if (profile?.userType === 'farmer') {
      suggestions.push({
        id: 'suggestion-2',
        type: 'equipment',
        title: 'Precision Agriculture Tools',
        description: 'Consider adding precision farming equipment to your profile',
        confidence: 0.78,
        category: 'equipment'
      });
    }

    setOptimizationScore(score);
    setImprovementTips(tips.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }));
    setAiSuggestions(suggestions);
  }, [profile]);

  useEffect(() => {
    if (profile) {
      analyzeProfile();
    }
  }, [profile, analyzeProfile]);

  return {
    optimizationScore,
    improvementTips,
    aiSuggestions,
    analyzeProfile
  };
};

// ENTERPRISE REAL-TIME STATE MANAGEMENT WITH AUTO-SAVE
const useEnterpriseProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSave, setLastSave] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const saveTimeoutRef = useRef(null);

  // Initialize with James Carter data
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
    farmDetails: {
      farmName: 'Green Valley Farms',
      farmSize: 50,
      mainCrops: ['Maize/Corn', 'Vegetables'],
      farmType: 'Crop Farm',
      equipment: ['Tractors', 'Irrigation Systems'],
      livestock: [],
      certifications: ['Organic Certified'],
      irrigationSystems: ['Drip Irrigation']
    },
    clientDetails: {
      companyName: '',
      industry: '',
      projectTypes: [],
      budgetRange: { min: 0, max: 0 },
      timeline: '',
      serviceNeeds: []
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

  // Load profile from storage
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem('enterprise_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
      } else {
        setProfile(defaultProfile);
        await AsyncStorage.setItem('enterprise_profile', JSON.stringify(defaultProfile));
      }
    } catch (error) {
      console.error('Load failed:', error);
      setProfile(defaultProfile);
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time save with debouncing
  const saveProfile = useCallback(async (newProfile) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        const profileToSave = newProfile || profile;
        
        // Save to local storage
        await AsyncStorage.setItem('enterprise_profile', JSON.stringify({
          ...profileToSave,
          lastUpdated: new Date().toISOString()
        }));

        // Simulate API call to backend
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLastSave(new Date().toISOString());
        Vibration.vibrate(50);
        
        console.log('Profile saved successfully');
      } catch (error) {
        console.error('Save error:', error);
        Alert.alert('Save Failed', 'Changes saved locally but sync failed');
      } finally {
        setSaving(false);
      }
    }, 1000); // 1 second debounce
  }, [profile]);

  // Update profile with immediate state update and auto-save
  const updateProfile = useCallback((updates) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setProfile(prev => {
      const newProfile = {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString(),
        displayName: `${updates.firstName || prev.firstName} ${updates.lastName || prev.lastName}`.trim()
      };
      
      // Auto-save
      saveProfile(newProfile);
      
      return newProfile;
    });
  }, [saveProfile]);

  // Specialized update functions
  const updateFarmDetails = useCallback((updates) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        farmDetails: { ...prev.farmDetails, ...updates },
        lastUpdated: new Date().toISOString()
      };
      saveProfile(newProfile);
      return newProfile;
    });
  }, [saveProfile]);

  const updateClientDetails = useCallback((updates) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        clientDetails: { ...prev.clientDetails, ...updates },
        lastUpdated: new Date().toISOString()
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
        skills: [...prev.skills, newSkill],
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
        skills: prev.skills.filter(skill => skill.id !== skillId),
        lastUpdated: new Date().toISOString()
      };
      saveProfile(newProfile);
      return newProfile;
    });
  }, [saveProfile]);

  // Portfolio management
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

  const removePortfolioItem = useCallback((itemId) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        portfolio: prev.portfolio.filter(item => item.id !== itemId),
        lastUpdated: new Date().toISOString()
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
          lastUpdated: new Date().toISOString()
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
    removePortfolioItem,
    updateProfileImage,
    saveProfile,
    loadProfile
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

  return {
    uploading,
    setUploading,
    pickImage,
    captureImage,
  };
};

// INTELLIGENT CATEGORY SYSTEM
const useCategorySystem = (userType) => {
  const categories = {
    skilled: {
      electrical: ['Residential Wiring', 'Commercial Installation', 'Safety Inspection', 'Panel Upgrade', 'Lighting Installation'],
      plumbing: ['Pipe Installation', 'Leak Repair', 'Water Heater', 'Drain Cleaning', 'Fixture Installation'],
      carpentry: ['Framing', 'Finishing', 'Cabinet Making', 'Furniture Building', 'Structural Repair'],
      mechanical: ['Engine Repair', 'Equipment Maintenance', 'Diagnostic', 'Preventive Maintenance', 'Parts Replacement'],
      construction: ['Renovation', 'New Construction', 'Demolition', 'Structural Work', 'Project Management'],
      technology: ['Network Setup', 'Computer Repair', 'Smart Home', 'Security Systems', 'Software Installation']
    },
    farmer: {
      crops: ['Maize/Corn', 'Wheat', 'Soybeans', 'Vegetables', 'Fruits', 'Grains', 'Organic Crops'],
      livestock: ['Cattle', 'Poultry', 'Swine', 'Dairy', 'Sheep/Goats', 'Fish Farming'],
      equipment: ['Tractors', 'Harvesters', 'Irrigation Systems', 'Planters', 'Sprayers', 'Balers'],
      specialties: ['Organic Farming', 'Hydroponics', 'Precision Agriculture', 'Sustainable Farming', 'Greenhouse'],
      skills: ['Soil Analysis', 'Crop Rotation', 'Pest Management', 'Irrigation Management', 'Harvest Planning']
    },
    client: {
      projectTypes: ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Renovation', 'New Construction'],
      serviceNeeds: ['Electrical', 'Plumbing', 'Carpentry', 'Mechanical', 'Construction', 'Technology'],
      timelines: ['Immediate', '1-2 Weeks', '1 Month', '3 Months', '6 Months+'],
      budgets: ['Under $1k', '$1k-$5k', '$5k-$10k', '$10k-$25k', '$25k+']
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

// REAL-TIME EDITING COMPONENTS
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
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          keyboardType={
            type === 'email' ? 'email-address' :
            type === 'phone' ? 'phone-pad' :
            type === 'number' ? 'numeric' : 'default'
          }
        />
      )}
      
      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="warning" size={12} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      <View style={styles.editButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ADVANCED BOTTOM NAVIGATION WITH VECTOR ICONS
const AdvancedBottomNavigation = ({ activeTab, onTabChange, profile }) => {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: 'home',
      iconSet: 'Feather',
      badge: null
    },
    {
      id: 'explore',
      label: 'Discover',
      icon: 'compass',
      iconSet: 'Feather',
      badge: 'new'
    },
    {
      id: 'create',
      label: 'Create',
      icon: 'plus-circle',
      iconSet: 'Feather',
      badge: null
    },
    {
      id: 'messages',
      label: 'Inbox',
      icon: 'message-circle',
      iconSet: 'Feather',
      badge: 3
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'user',
      iconSet: 'Feather',
      badge: null
    }
  ];

  const renderIcon = (tab, isActive) => {
    const iconColor = isActive ? '#00f0a8' : '#666';
    const iconSize = 24;

    switch (tab.iconSet) {
      case 'MaterialIcon':
        return <MaterialIcon name={tab.icon} size={iconSize} color={iconColor} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={tab.icon} size={iconSize} color={iconColor} />;
      case 'Feather':
        return <Feather name={tab.icon} size={iconSize} color={iconColor} />;
      default:
        return <Icon name={tab.icon} size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View style={styles.bottomNavigation}>
      <LinearGradient
        colors={['rgba(0,0,0,0.95)', 'rgba(0,0,0,0.98)']}
        style={styles.navGradient}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => onTabChange(tab.id)}
            >
              <View style={styles.navIconContainer}>
                {renderIcon(tab, isActive)}
                {tab.badge && (
                  <View style={[
                    styles.navBadge,
                    typeof tab.badge === 'number' ? styles.navBadgeNumber : styles.navBadgeDot
                  ]}>
                    {typeof tab.badge === 'number' ? (
                      <Text style={styles.navBadgeText}>{tab.badge}</Text>
                    ) : null}
                  </View>
                )}
              </View>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {tab.label}
              </Text>
              
              {isActive && (
                <View style={styles.activeIndicator}>
                  <View style={styles.activePulse} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
};

// AI OPTIMIZATION PANEL
const AIOptimizationPanel = ({ optimizationScore, improvementTips, onSuggestionClick }) => {
  if (optimizationScore >= 95) return null;

  return (
    <View style={styles.optimizationPanel}>
      <View style={styles.optimizationHeader}>
        <View style={styles.optimizationTitleSection}>
          <Feather name="zap" size={20} color="#00f0a8" />
          <Text style={styles.optimizationTitle}>Profile Optimization</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{optimizationScore}%</Text>
        </View>
      </View>

      <View style={styles.optimizationProgress}>
        <View 
          style={[
            styles.optimizationProgressFill,
            { width: `${optimizationScore}%` }
          ]} 
        />
      </View>

      {improvementTips.length > 0 && (
        <View style={styles.improvementTips}>
          <Text style={styles.tipsTitle}>Quick Improvements</Text>
          {improvementTips.slice(0, 2).map((tip) => (
            <TouchableOpacity
              key={tip.id}
              style={styles.improvementTip}
              onPress={() => onSuggestionClick(tip.action)}
            >
              <View style={styles.tipIcon}>
                <Feather name={tip.icon} size={16} color="#000" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// SMART SERVICE CARDS
const ServiceCard = ({ service, onPress, isPopular }) => {
  return (
    <TouchableOpacity 
      style={[styles.serviceCard, isPopular && styles.popularServiceCard]}
      onPress={onPress}
    >
      {isPopular && (
        <View style={styles.popularRibbon}>
          <Text style={styles.popularRibbonText}>POPULAR</Text>
        </View>
      )}
      
      <View style={styles.serviceHeader}>
        <View style={styles.serviceIcon}>
          <Feather name="tool" size={24} color="#00f0a8" />
        </View>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <Text style={styles.serviceDuration}>{service.duration}</Text>
        </View>
      </View>
      
      <Text style={styles.serviceDescription}>{service.description}</Text>
      
      <View style={styles.serviceFooter}>
        <Text style={styles.servicePrice}>${service.basePrice}</Text>
        <Text style={styles.serviceUnit}>/hour</Text>
        <View style={styles.serviceRating}>
          <Feather name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>4.9</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// MAIN ENTERPRISE PROFILE SCREEN
export default function EnterpriseProfileScreen({ navigation }) {
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
    removePortfolioItem,
    updateProfileImage,
    saveProfile,
    loadProfile
  } = useEnterpriseProfile();

  const { optimizationScore, improvementTips, aiSuggestions } = useAIOptimization(profile);
  const { globalUser, updateGlobalUser } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [activeNav, setActiveNav] = useState('profile');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, [loadProfile]);

  // Update global app state when profile changes
  useEffect(() => {
    if (profile && globalUser) {
      updateGlobalUser({
        ...globalUser,
        ...profile,
        displayName: profile.displayName,
        profileImage: profile.profileImage,
        userType: profile.userType
      });
    }
  }, [profile]);

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Check out ${profile.displayName}'s professional profile on VSXchange!`,
        title: `${profile.displayName}'s Profile`,
        url: 'https://vsxchangeza.com/profiles/' + profile.id
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  const handleContact = () => {
    Alert.alert(
      'Contact James',
      'Choose contact method:',
      [
        {
          text: 'Call',
          onPress: () => console.log('Call:', profile.contactInfo.phone)
        },
        {
          text: 'Email',
          onPress: () => console.log('Email:', profile.contactInfo.email)
        },
        {
          text: 'Message',
          onPress: () => navigation.navigate('Messages', { user: profile })
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleSuggestionClick = (action) => {
    switch (action) {
      case 'upload_photo':
        // Trigger photo upload
        break;
      case 'edit_bio':
        setEditing(true);
        break;
      case 'add_skills':
        setEditing(true);
        break;
      case 'set_location':
        setEditing(true);
        break;
      default:
        break;
    }
  };

  const handleNavChange = (tab) => {
    setActiveNav(tab);
    if (tab !== 'profile') {
      navigation.navigate(tab);
    }
  };

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00f0a8" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  const ProfileHeader = () => (
    <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.header}>
      <View style={styles.headerContent}>
        {/* Top Bar */}
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="chevron-left" size={28} color="#00f0a8" />
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
            >
              <Feather name="share-2" size={20} color="#00f0a8" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.editButton, editing && styles.editButtonActive]}
              onPress={() => setEditing(!editing)}
            >
              <Feather 
                name={editing ? "check" : "edit-3"} 
                size={20} 
                color="#00f0a8" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Main Section */}
        <View style={styles.profileMain}>
          {/* Profile Image Section */}
          <View style={styles.profileImageSection}>
            <TouchableOpacity style={styles.avatarContainer}>
              <Image 
                source={{ uri: profile.profileImage || 'https://via.placeholder.com/120' }}
                style={styles.avatar}
              />
              {editing && (
                <View style={styles.avatarOverlay}>
                  <Feather name="camera" size={24} color="#fff" />
                </View>
              )}
              <View style={styles.onlineIndicator} />
            </TouchableOpacity>
          </View>

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

            {/* Professional Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.experienceYears}</Text>
                <Text style={styles.statLabel}>Years Exp</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.completedProjects}+</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={handleContact}
              >
                <Feather name="message-circle" size={18} color="#000" />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.hireButton}
                onPress={() => navigation.navigate('Booking', { professional: profile })}
              >
                <Feather name="calendar" size={18} color="#000" />
                <Text style={styles.hireButtonText}>Hire Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* AI Optimization Panel */}
        <AIOptimizationPanel
          optimizationScore={optimizationScore}
          improvementTips={improvementTips}
          onSuggestionClick={handleSuggestionClick}
        />

        {/* Save Status */}
        {lastSave && (
          <View style={styles.saveStatus}>
            <Feather name="check-circle" size={12} color="#00f0a8" />
            <Text style={styles.saveStatusText}>
              Last saved {new Date(lastSave).toLocaleTimeString()}
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
            showsVerticalScrollIndicator={false}
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

            {/* Services Preview */}
            {profile.services && profile.services.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Services</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {profile.services.map((service, index) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isPopular={service.popular}
                      onPress={() => console.log('Service selected:', service.title)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Skills & Expertise */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills & Expertise</Text>
              <View style={styles.skillsGrid}>
                {profile.skills.map((skill) => (
                  <View key={skill.id} style={styles.skillChip}>
                    <Feather name="check" size={14} color="#00f0a8" />
                    <Text style={styles.skillChipText}>{skill.name}</Text>
                  </View>
                ))}
              </View>
              {editing && (
                <TouchableOpacity style={styles.addSkillButton}>
                  <Feather name="plus" size={16} color="#00f0a8" />
                  <Text style={styles.addSkillButtonText}>Add Skill</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Suggestions</Text>
                {aiSuggestions.map((suggestion) => (
                  <View key={suggestion.id} style={styles.aiSuggestion}>
                    <View style={styles.suggestionIcon}>
                      <Feather name="zap" size={16} color="#00f0a8" />
                    </View>
                    <View style={styles.suggestionContent}>
                      <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                      <Text style={styles.suggestionDescription}>
                        {suggestion.description}
                      </Text>
                    </View>
                    <Text style={styles.confidenceText}>
                      {Math.round(suggestion.confidence * 100)}% match
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        );

      case 'portfolio':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Portfolio Gallery</Text>
            {/* Portfolio implementation would go here */}
            <View style={styles.comingSoonSection}>
              <Feather name="image" size={64} color="#666" />
              <Text style={styles.comingSoonTitle}>Portfolio Gallery</Text>
              <Text style={styles.comingSoonText}>
                Showcase your work with photos, descriptions, and project details
              </Text>
              {editing && (
                <TouchableOpacity style={styles.comingSoonButton}>
                  <Text style={styles.comingSoonButtonText}>Add Portfolio Items</Text>
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
              <Feather name="tool" size={64} color="#666" />
              <Text style={styles.comingSoonTitle}>Services Management</Text>
              <Text style={styles.comingSoonText}>
                Manage your services, pricing, and availability
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
                  <Feather 
                    key={star}
                    name={star <= profile.rating ? "star" : "star"} 
                    size={24} 
                    color={star <= profile.rating ? "#FFD700" : "#666"} 
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
      
      {/* Tab Navigation */}
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
              <Feather 
                name={
                  tab === 'about' ? 'user' :
                  tab === 'portfolio' ? 'image' :
                  tab === 'services' ? 'tool' :
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

      {/* Main Content */}
      <KeyboardAvoidingView 
        style={styles.contentContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <TabContent />
      </KeyboardAvoidingView>

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNavigation
        activeTab={activeNav}
        onTabChange={handleNavChange}
        profile={profile}
      />

      {/* Saving Overlay */}
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

// COMPLETE ENTERPRISE-LEVEL STYLES WITH FUTURISTIC DESIGN
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
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
  },
  headerContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: {
    padding: 10,
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
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  savingText: {
    color: '#00f0a8',
    fontSize: 11,
    marginLeft: 4,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  editButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  editButtonActive: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    transform: [{ scale: 1.1 }],
  },
  profileMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  profileImageSection: {
    marginRight: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00f0a8',
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00f0a8',
    borderWidth: 2,
    borderColor: '#000',
  },
  profileInfo: {
    flex: 1,
  },
  nameSection: {
    marginBottom: 20,
  },
  nameEditor: {
    gap: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.5,
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
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#00f0a8',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  contactButtonText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  hireButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00f0a8',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  hireButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  optimizationPanel: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.2)',
  },
  optimizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  optimizationTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optimizationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  scoreContainer: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  scoreText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '800',
  },
  optimizationProgress: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 15,
  },
  optimizationProgressFill: {
    height: '100%',
    backgroundColor: '#00f0a8',
    borderRadius: 3,
  },
  improvementTips: {
    gap: 12,
  },
  tipsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  improvementTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  tipDescription: {
    color: '#666',
    fontSize: 12,
    lineHeight: 16,
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
    fontWeight: '600',
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginRight: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00f0a8',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.5,
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
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  bioField: {
    minHeight: 120,
  },
  viewField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  viewFieldContent: {
    flex: 1,
  },
  fieldLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.5,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  editField: {
    color: '#fff',
    fontSize: 16,
    padding: 18,
    minHeight: 50,
  },
  multilineField: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  fieldError: {
    borderColor: '#ff6b6b',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
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
    padding: 18,
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
    padding: 18,
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
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
  },
  saveButtonText: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '600',
  },
  serviceCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginRight: 15,
    width: 280,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  popularServiceCard: {
    borderColor: '#00f0a8',
    backgroundColor: 'rgba(0,240,168,0.05)',
  },
  popularRibbon: {
    position: 'absolute',
    top: 15,
    right: -5,
    backgroundColor: '#00f0a8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularRibbonText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,240,168,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  serviceDuration: {
    color: '#666',
    fontSize: 12,
  },
  serviceDescription: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 15,
  },
  serviceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  servicePrice: {
    color: '#00f0a8',
    fontSize: 20,
    fontWeight: '800',
  },
  serviceUnit: {
    color: '#666',
    fontSize: 12,
    marginLeft: 2,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  skillChipText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  addSkillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  addSkillButtonText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  aiSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,240,168,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  suggestionDescription: {
    color: '#666',
    fontSize: 12,
    lineHeight: 16,
  },
  confidenceText: {
    color: '#00f0a8',
    fontSize: 10,
    fontWeight: '600',
  },
  comingSoonSection: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  comingSoonTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  comingSoonText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
  },
  comingSoonButton: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  comingSoonButtonText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  ratingOverview: {
    alignItems: 'center',
    padding: 50,
  },
  ratingNumber: {
    color: '#00f0a8',
    fontSize: 52,
    fontWeight: '800',
    marginBottom: 15,
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  ratingCount: {
    color: '#666',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  navGradient: {
    flex: 1,
    flexDirection: 'row',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  navItemActive: {
    transform: [{ translateY: -5 }],
  },
  navIconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  navBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBadgeDot: {
    width: 8,
    height: 8,
    backgroundColor: '#00f0a8',
    borderRadius: 4,
  },
  navBadgeNumber: {
    backgroundColor: '#00f0a8',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    minWidth: 16,
  },
  navBadgeText: {
    color: '#000',
    fontSize: 8,
    fontWeight: '900',
  },
  navLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  navLabelActive: {
    color: '#00f0a8',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00f0a8',
  },
  activePulse: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00f0a8',
    opacity: 0.6,
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
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  savingOverlayText: {
    color: '#00f0a8',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
});

