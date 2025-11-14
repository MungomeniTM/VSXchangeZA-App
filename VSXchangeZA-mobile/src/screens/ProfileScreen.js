// src/screens/EnterpriseProfileScreen.js - COMPLETE ENTERPRISE PLATFORM
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { AppContext } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

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
        level: 'expert',
        years: 8,
        certified: true
      },
      {
        id: 'skill_2',
        name: 'Commercial Installation',
        category: 'electrical',
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
      farmName: '',
      farmSize: 0,
      mainCrops: [],
      farmType: '',
      equipment: [],
      livestock: [],
      certifications: [],
      irrigationSystems: []
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

// PROFILE IMAGE COMPONENT WITH UPLOAD
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

      <Modal visible={showImageOptions} transparent animationType="slide">
        <View style={styles.imageOptionsOverlay}>
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
        </View>
      </Modal>
    </View>
  );
};

// USER TYPE SELECTOR
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
        <View style={[styles.typeIcon, { backgroundColor: current.color }]}>
          <Icon name={current.icon} size={20} color="#000" />
        </View>
        <View style={styles.typeInfo}>
          <Text style={styles.typeTitle}>{current.title}</Text>
          <Text style={styles.typeDescription}>{current.description}</Text>
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

// SKILL MANAGER COMPONENT
const SkillManager = ({ 
  skills, 
  userType, 
  onAddSkill, 
  onRemoveSkill, 
  editing 
}) => {
  const { getCategories, getSubcategories } = useCategorySystem(userType);
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
        <TouchableOpacity onPress={onRemove} style={styles.removeSkillButton}>
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
              >
                <Text style={styles.addFirstSkillText}>Add Your First Skill</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Add Skill Modal */}
      <Modal visible={showAddSkill} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Skill</Text>
              <TouchableOpacity onPress={() => setShowAddSkill(false)}>
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

// LOCATION MANAGER
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
          >
            <Icon name="create" size={18} color="#00f0a8" />
            <Text style={styles.secondaryLocationButtonText}>Enter Address</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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

  const { globalUser, updateGlobalUser } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);

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
          </View>
        </View>

        {/* Profile Main Section */}
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
                <Icon name="chatbubble-ellipses" size={18} color="#000" />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.hireButton}
                onPress={() => navigation.navigate('Booking', { professional: profile })}
              >
                <Icon name="calendar" size={18} color="#000" />
                <Text style={styles.hireButtonText}>Hire Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* User Type Selector */}
        <UserTypeSelector
          currentType={profile.userType}
          onTypeChange={(type) => updateProfile({ userType: type })}
          editing={editing}
        />

        {/* Save Status */}
        {lastSave && (
          <View style={styles.saveStatus}>
            <Icon name="checkmark-circle" size={12} color="#00f0a8" />
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

            {/* User Type Specific Details */}
            {profile.userType === 'farmer' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Farm Details</Text>
                <EditableField
                  value={profile.farmDetails.farmName}
                  onSave={(value) => updateFarmDetails({ farmName: value })}
                  placeholder="Enter farm name"
                  label="Farm Name"
                />
                <EditableField
                  value={profile.farmDetails.farmSize?.toString()}
                  onSave={(value) => updateFarmDetails({ farmSize: parseFloat(value) || 0 })}
                  placeholder="Enter farm size in hectares"
                  label="Farm Size (hectares)"
                  type="number"
                />
                <EditableField
                  value={profile.farmDetails.farmType}
                  onSave={(value) => updateFarmDetails({ farmType: value })}
                  placeholder="Select farm type"
                  label="Farm Type"
                  type="select"
                  options={['Crop Farm', 'Dairy Farm', 'Poultry Farm', 'Mixed Farm', 'Organic Farm', 'Vineyard', 'Orchard']}
                />
              </View>
            )}

            {profile.userType === 'client' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Client Information</Text>
                <EditableField
                  value={profile.clientDetails.companyName}
                  onSave={(value) => updateClientDetails({ companyName: value })}
                  placeholder="Enter company name"
                  label="Company Name"
                />
                <EditableField
                  value={profile.clientDetails.industry}
                  onSave={(value) => updateClientDetails({ industry: value })}
                  placeholder="Select industry"
                  label="Industry"
                  type="select"
                  options={['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Construction', 'Technology']}
                />
              </View>
            )}

            {/* Location */}
            <LocationManager
              location={profile.location}
              onUpdate={(location) => updateProfile({ location })}
              editing={editing}
            />

            {/* Contact Information */}
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
            {/* Portfolio implementation would go here */}
            <View style={styles.comingSoonSection}>
              <Icon name="images" size={64} color="#666" />
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
              <Icon name="construct" size={64} color="#666" />
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
                  <Icon 
                    key={star}
                    name={star <= profile.rating ? "star" : "star-outline"} 
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

      {/* Main Content */}
      <KeyboardAvoidingView 
        style={styles.contentContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <TabContent />
      </KeyboardAvoidingView>

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

// COMPLETE ENTERPRISE-LEVEL STYLES
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
  },
  editButtonActive: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    transform: [{ scale: 1.1 }],
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
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  contactButton: {
    flex: 1,
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
    flex: 1,
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
  categoryChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  categoryChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderColor: '#00f0a8',
  },
  categoryChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  subcategoryChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  subcategoryChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    borderColor: '#00f0a8',
  },
  subcategoryChipText: {
    color: '#fff',
    fontSize: 10,
  },
  levelOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  levelChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  levelChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderColor: '#00f0a8',
  },
  levelChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  yearsSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  yearChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  yearChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderColor: '#00f0a8',
  },
  yearChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  certifiedToggle: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  certifiedToggleActive: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    borderColor: '#00f0a8',
  },
  certifiedToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certifiedToggleSwitch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  certifiedToggleSwitchActive: {
    backgroundColor: '#00f0a8',
  },
  certifiedToggleText: {
    color: '#fff',
    fontSize: 14,
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
});

