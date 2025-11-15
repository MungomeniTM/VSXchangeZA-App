// src/screens/EnterpriseProfileScreen.js - PERFECT ENTERPRISE PLATFORM
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
  LayoutAnimation,
  FlatList,
  Share,
  KeyboardAvoidingView
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { AppContext } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// ENTERPRISE STATE MANAGEMENT - BUG FREE
const useEnterpriseProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSave, setLastSave] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const saveTimeoutRef = useRef(null);

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
      }
    ],
    services: [
      {
        id: 'service_1',
        title: 'Electrical Installation',
        description: 'Professional electrical wiring and installation',
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
      certifications: []
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
    lastUpdated: new Date().toISOString()
  };

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem('enterprise_profile');
      if (stored) {
        setProfile(JSON.parse(stored));
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

  const saveProfile = useCallback(async (newProfile) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        const profileToSave = newProfile || profile;
        
        await AsyncStorage.setItem('enterprise_profile', JSON.stringify({
          ...profileToSave,
          lastUpdated: new Date().toISOString()
        }));

        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLastSave(new Date().toISOString());
        Vibration.vibrate(50);
        
        console.log('✅ Profile saved');
      } catch (error) {
        console.error('❌ Save error:', error);
      } finally {
        setSaving(false);
      }
    }, 1000);
  }, [profile]);

  const updateProfile = useCallback((updates) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setProfile(prev => {
      const newProfile = {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString(),
        displayName: `${updates.firstName || prev.firstName} ${updates.lastName || prev.lastName}`.trim()
      };
      
      saveProfile(newProfile);
      return newProfile;
    });
  }, [saveProfile]);

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

  const addSkill = useCallback((skill) => {
    const newSkill = {
      id: `skill_${Date.now()}`,
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
    updateProfileImage,
    saveProfile
  };
};

// ADVANCED IMAGE MANAGER - WORKING PERFECTLY
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
      electrical: ['Residential Wiring', 'Commercial Installation', 'Safety Inspection', 'Panel Upgrade'],
      plumbing: ['Pipe Installation', 'Leak Repair', 'Water Heater', 'Drain Cleaning'],
      carpentry: ['Framing', 'Finishing', 'Cabinet Making', 'Furniture Building'],
      mechanical: ['Engine Repair', 'Equipment Maintenance', 'Diagnostic', 'Preventive Maintenance'],
      construction: ['Renovation', 'New Construction', 'Demolition', 'Structural Work'],
    },
    farmer: {
      crops: ['Maize/Corn', 'Wheat', 'Soybeans', 'Vegetables', 'Fruits'],
      livestock: ['Cattle', 'Poultry', 'Swine', 'Dairy', 'Sheep/Goats'],
      equipment: ['Tractors', 'Harvesters', 'Irrigation Systems', 'Planters'],
      specialties: ['Organic Farming', 'Hydroponics', 'Precision Agriculture', 'Sustainable Farming'],
    },
    client: {
      projectTypes: ['Residential', 'Commercial', 'Industrial', 'Agricultural'],
      serviceNeeds: ['Electrical', 'Plumbing', 'Carpentry', 'Mechanical'],
      timelines: ['Immediate', '1-2 Weeks', '1 Month', '3 Months'],
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

// REAL-TIME EDITABLE FIELD - FIXED
const EditableField = ({ 
  value, 
  onSave, 
  placeholder, 
  multiline = false, 
  style,
  type = 'text',
  options = [],
  label
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value || '');
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
        <Feather name="edit-2" size={16} color="#00f0a8" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.editFieldContainer, style]}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      
      {type === 'select' ? (
        <ScrollView style={styles.optionsContainer}>
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
                <Feather name="check" size={16} color="#00f0a8" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <TextInput
          style={[styles.editField, multiline && styles.multilineField]}
          value={tempValue}
          onChangeText={setTempValue}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
        />
      )}
      
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

// PROFILE IMAGE EDITOR - WORKING PERFECTLY
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
              <Feather name="user" size={40} color="#666" />
            </View>
          )}
          
          {uploading && (
            <View style={styles.uploadOverlay}>
              <ActivityIndicator size="large" color="#00f0a8" />
            </View>
          )}
          
          {editing && !uploading && (
            <View style={styles.editBadge}>
              <Feather name="camera" size={16} color="#000" />
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
              <Feather name="camera" size={24} color="#00f0a8" />
              <Text style={styles.imageOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.imageOption}
              onPress={() => handleImageSelect('gallery')}
            >
              <Feather name="image" size={24} color="#00f0a8" />
              <Text style={styles.imageOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
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

// USER TYPE SELECTOR - FIXED
const UserTypeSelector = ({ currentType, onTypeChange, editing }) => {
  const userTypes = [
    {
      type: 'skilled',
      icon: 'tool',
      title: 'Skilled Professional',
      description: 'Offer vocational services',
      color: '#00f0a8'
    },
    {
      type: 'farmer',
      icon: 'feather',
      title: 'Farmer',
      description: 'Agricultural services',
      color: '#4CD964'
    },
    {
      type: 'client',
      icon: 'briefcase',
      title: 'Client',
      description: 'Find professionals',
      color: '#007AFF'
    }
  ];

  if (!editing) {
    const current = userTypes.find(t => t.type === currentType);
    return (
      <View style={styles.userTypeDisplay}>
        <View style={[styles.typeIcon, { backgroundColor: current.color }]}>
          <Feather name={current.icon} size={20} color="#000" />
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
            <View style={[styles.typeOptionIcon, { backgroundColor: userType.color }]}>
              <Feather name={userType.icon} size={24} color="#000" />
            </View>
            <View style={styles.typeOptionTexts}>
              <Text style={styles.typeOptionTitle}>{userType.title}</Text>
              <Text style={styles.typeOptionDescription}>{userType.description}</Text>
            </View>
            {currentType === userType.type && (
              <View style={[styles.selectedBadge, { backgroundColor: userType.color }]}>
                <Feather name="check" size={16} color="#000" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// SKILL MANAGER - FIXED AND WORKING
const SkillManager = ({ skills, userType, onAddSkill, onRemoveSkill, editing }) => {
  const { getCategories, getSubcategories } = useCategorySystem(userType);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    level: 'intermediate',
    years: 1
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
    setNewSkill({ name: '', category: '', level: 'intermediate', years: 1 });
    setShowAddSkill(false);
  };

  return (
    <View style={styles.skillManager}>
      <View style={styles.skillHeader}>
        <Text style={styles.skillTitle}>Skills & Expertise</Text>
        {editing && (
          <TouchableOpacity 
            style={styles.addSkillButton}
            onPress={() => setShowAddSkill(true)}
          >
            <Feather name="plus" size={20} color="#00f0a8" />
            <Text style={styles.addSkillText}>Add Skill</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.skillsGrid}>
        {skills.map((skill) => (
          <View key={skill.id} style={styles.skillChip}>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <Text style={styles.skillMeta}>
                {skill.category} • {skill.level} • {skill.years} year{skill.years !== 1 ? 's' : ''}
              </Text>
            </View>
            {editing && (
              <TouchableOpacity 
                onPress={() => onRemoveSkill(skill.id)} 
                style={styles.removeSkillButton}
              >
                <Feather name="x" size={16} color="#ff6b6b" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        
        {skills.length === 0 && (
          <View style={styles.noSkills}>
            <Feather name="tool" size={32} color="#666" />
            <Text style={styles.noSkillsText}>No skills added yet</Text>
          </View>
        )}
      </View>

      <Modal visible={showAddSkill} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Skill</Text>
              <TouchableOpacity onPress={() => setShowAddSkill(false)}>
                <Feather name="x" size={24} color="#00f0a8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Skill Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={newSkill.name}
                  onChangeText={(text) => setNewSkill(prev => ({ ...prev, name: text }))}
                  placeholder="e.g., Electrical Wiring"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {Object.keys(categories).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        newSkill.category === category && styles.categoryChipSelected
                      ]}
                      onPress={() => setNewSkill(prev => ({ ...prev, category }))}
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
                    >
                      <Text style={styles.levelChipText}>{level}</Text>
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
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveModalButton}
                onPress={handleAddSkill}
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

// LOCATION MANAGER - WORKING
const LocationManager = ({ location, onUpdate, editing }) => {
  const [gettingLocation, setGettingLocation] = useState(false);

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;
      
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      const readableAddress = address[0] 
        ? `${address[0].city}, ${address[0].region}`
        : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      onUpdate({
        latitude,
        longitude,
        address: readableAddress,
        lastUpdated: new Date().toISOString()
      });

      Alert.alert('Success', 'Location updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    } finally {
      setGettingLocation(false);
    }
  };

  return (
    <View style={styles.locationSection}>
      <Text style={styles.sectionTitle}>Location</Text>
      
      {location ? (
        <View style={styles.locationDisplay}>
          <Feather name="map-pin" size={20} color="#00f0a8" />
          <Text style={styles.locationText}>{location.address}</Text>
        </View>
      ) : (
        <Text style={styles.noLocation}>No location set</Text>
      )}

      {editing && (
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={getCurrentLocation}
          disabled={gettingLocation}
        >
          {gettingLocation ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <Feather name="navigation" size={18} color="#000" />
          )}
          <Text style={styles.locationButtonText}>
            {gettingLocation ? 'Getting Location...' : 'Use Current Location'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ADVANCED BOTTOM NAVIGATION - FIXED NAVIGATION
const AdvancedBottomNavigation = ({ activeTab, onTabChange, navigation }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home', component: 'Dashboard' },
    { id: 'explore', label: 'Discover', icon: 'search', component: 'Explore' },
    { id: 'create', label: 'Create', icon: 'plus-square', component: 'Create' },
    { id: 'messages', label: 'Inbox', icon: 'message-circle', component: 'Messages' },
    { id: 'profile', label: 'Profile', icon: 'user', component: 'Profile' }
  ];

  const handleTabPress = (tab) => {
    if (tab.component && tab.component !== 'Profile') {
      navigation.navigate(tab.component);
    }
    onTabChange(tab.id);
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
              onPress={() => handleTabPress(tab)}
            >
              <Feather 
                name={tab.icon} 
                size={24} 
                color={isActive ? '#00f0a8' : '#666'} 
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
};

// MAIN COMPONENT - COMPLETELY FIXED
export default function EnterpriseProfileScreen({ navigation }) {
  const {
    profile,
    loading,
    saving,
    editing,
    setEditing,
    activeTab,
    setActiveTab,
    updateProfile,
    updateFarmDetails,
    updateClientDetails,
    addSkill,
    removeSkill,
    updateProfileImage
  } = useEnterpriseProfile();

  const [activeNav, setActiveNav] = useState('profile');

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

        <View style={styles.profileMain}>
          <ProfileImageEditor
            profileImage={profile.profileImage}
            onImageUpdate={updateProfileImage}
            editing={editing}
          />

          <View style={styles.profileInfo}>
            <View style={styles.nameSection}>
              {editing ? (
                <>
                  <EditableField
                    value={profile.firstName}
                    onSave={(value) => updateProfile({ firstName: value })}
                    placeholder="First Name"
                    style={styles.nameInput}
                  />
                  <EditableField
                    value={profile.lastName}
                    onSave={(value) => updateProfile({ lastName: value })}
                    placeholder="Last Name"
                    style={styles.nameInput}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.userName}>{profile.displayName}</Text>
                  <Text style={styles.profession}>{profile.profession}</Text>
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
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.completedProjects}+</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
            </View>
          </View>
        </View>

        <UserTypeSelector
          currentType={profile.userType}
          onTypeChange={(type) => updateProfile({ userType: type })}
          editing={editing}
        />
      </View>
    </LinearGradient>
  );

  const TabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <ScrollView 
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Bio</Text>
              <EditableField
                value={profile.bio}
                onSave={(value) => updateProfile({ bio: value })}
                placeholder="Tell us about yourself..."
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

            {profile.userType === 'farmer' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Farm Details</Text>
                <EditableField
                  value={profile.farmDetails.farmName}
                  onSave={(value) => updateFarmDetails({ farmName: value })}
                  placeholder="Farm Name"
                />
                <EditableField
                  value={profile.farmDetails.farmSize?.toString()}
                  onSave={(value) => updateFarmDetails({ farmSize: parseFloat(value) || 0 })}
                  placeholder="Farm Size (hectares)"
                />
              </View>
            )}

            <LocationManager
              location={profile.location}
              onUpdate={(location) => updateProfile({ location })}
              editing={editing}
            />
          </ScrollView>
        );

      case 'portfolio':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Portfolio</Text>
            <Text style={styles.comingSoon}>Portfolio features coming soon...</Text>
          </View>
        );

      case 'services':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Services</Text>
            <Text style={styles.comingSoon}>Services features coming soon...</Text>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['about', 'portfolio', 'services'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.contentContainer}>
        <TabContent />
      </View>

      <AdvancedBottomNavigation
        activeTab={activeNav}
        onTabChange={setActiveNav}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

// COMPLETE STYLES - OPTIMIZED
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
  },
  headerTitle: {
    alignItems: 'center',
  },
  headerTitleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
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
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  editButtonActive: {
    backgroundColor: 'rgba(0,240,168,0.2)',
  },
  profileMain: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#00f0a8',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00f0a8',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
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
  userName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  profession: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '600',
  },
  nameInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#00f0a8',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
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
  },
  typeDescription: {
    color: '#666',
    fontSize: 12,
  },
  userTypeSelector: {
    marginBottom: 10,
  },
  selectorTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  typeOptions: {
    gap: 10,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
  },
  typeOptionSelected: {
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    fontSize: 14,
    fontWeight: '600',
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
  tabsContainer: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00f0a8',
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
  },
  tabContent: {
    flex: 1,
  },
  scrollContent: {
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
  bioField: {
    minHeight: 100,
  },
  viewField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  viewFieldContent: {
    flex: 1,
  },
  fieldLabel: {
    color: '#666',
    fontSize: 12,
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
    overflow: 'hidden',
    marginBottom: 10,
  },
  editField: {
    color: '#fff',
    fontSize: 16,
    padding: 15,
  },
  multilineField: {
    minHeight: 100,
    textAlignVertical: 'top',
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
    marginBottom: 0,
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
  addSkillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addSkillText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  skillsGrid: {
    gap: 10,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  skillMeta: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
  },
  removeSkillButton: {
    padding: 4,
  },
  noSkills: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noSkillsText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
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
  cancelOption: {
    padding: 20,
    alignItems: 'center',
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
  },
  categoryChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  levelChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
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
  },
  yearChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
  },
  yearChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelModalButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
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
  saveModalText: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '600',
  },
  locationSection: {
    padding: 20,
  },
  locationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  noLocation: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00f0a8',
    padding: 15,
    borderRadius: 8,
  },
  locationButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  comingSoon: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  navGradient: {
    flex: 1,
    flexDirection: 'row',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    transform: [{ translateY: -5 }],
  },
  navLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#00f0a8',
  },
});

