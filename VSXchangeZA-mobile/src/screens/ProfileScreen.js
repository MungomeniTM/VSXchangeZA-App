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
  RefreshControl
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { AppContext } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ENHANCED VECTOR ICONS SYSTEM - MATCHING DASHBOARD
const VectorIcons = {
  // Bottom Navigation Icons (Matching Dashboard)
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

// OPTIMIZED ENTERPRISE STATE MANAGEMENT
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
      }
    ],
    farmDetails: {
      farmName: '',
      farmSize: 0,
      farmType: '',
      mainCrops: [],
      livestock: [],
      equipment: [],
      hectares: 0,
      soilType: '',
      waterSource: '',
      organicCertified: false
    },
    clientDetails: {
      companyName: '',
      industry: '',
      projectTypes: [],
      budgetRange: { min: 0, max: 0 },
      projectSize: ''
    },
    isAvailable: true,
    lastUpdated: new Date().toISOString(),
    profileCompleteness: 85
  };

  // Optimized load profile
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

  // Optimized real-time save
  const saveProfile = useCallback(async (newProfile) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        const profileToSave = newProfile || profile;
        
        await AsyncStorage.setItem('advanced_enterprise_profile', JSON.stringify({
          ...profileToSave,
          lastUpdated: new Date().toISOString()
        }));

        setLastSave(new Date().toISOString());
        Vibration.vibrate(50);
      } catch (error) {
        console.error('Save error:', error);
      } finally {
        setSaving(false);
      }
    }, 800);
  }, [profile]);

  // Optimized update with performance
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

  // Specialized updates
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
    updateProfileImage,
    saveProfile,
    loadProfile
  };
};

// OPTIMIZED IMAGE MANAGEMENT
const useImageManager = () => {
  const [uploading, setUploading] = useState(false);

  const pickImage = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera roll access is needed');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8
      });

      if (!result.canceled && result.assets) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Image pick failed:', error);
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
      return null;
    }
  }, []);

  return {
    uploading,
    setUploading,
    pickImage,
    captureImage
  };
};

// OPTIMIZED PROFILE IMAGE EDITOR
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
        imageAsset = await pickImage();
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

// OPTIMIZED EDITABLE FIELD COMPONENT
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

  const handleSave = () => {
    if (required && !tempValue.trim()) {
      Alert.alert('Error', 'This field is required');
      return;
    }
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
        <Icon name="create-outline" size={16} color="#00f0a8" />
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
                <Icon name="checkmark" size={16} color="#00f0a8" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <TextInput
          style={[
            styles.editField, 
            multiline && styles.multilineField
          ]}
          value={tempValue}
          onChangeText={setTempValue}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          autoFocus
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

// OPTIMIZED USER TYPE SELECTOR
const UserTypeSelector = ({ currentType, onTypeChange, editing }) => {
  const userTypes = [
    {
      type: 'skilled',
      icon: 'construct',
      title: 'Skilled Professional',
      description: 'Offer vocational services and expertise',
      color: '#00f0a8'
    },
    {
      type: 'farmer',
      icon: 'leaf',
      title: 'Farmer',
      description: 'Agricultural services and farm management',
      color: '#4CD964'
    },
    {
      type: 'client',
      icon: 'business',
      title: 'Client',
      description: 'Find and hire skilled professionals',
      color: '#007AFF'
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
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// OPTIMIZED SKILL MANAGER
const SkillManager = ({ 
  skills, 
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
    years: 1
  });

  const categories = {
    skilled: ['Electrical', 'Plumbing', 'Carpentry', 'Mechanical', 'Construction', 'Technology'],
    farmer: ['Crops', 'Livestock', 'Equipment', 'Specialties', 'Skills'],
    client: ['Project Types', 'Service Needs', 'Industries']
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      Alert.alert('Error', 'Please enter a skill name');
      return;
    }

    onAddSkill(newSkill);
    setNewSkill({ name: '', category: '', level: 'intermediate', years: 1 });
    setShowAddSkill(false);
  };

  return (
    <View style={styles.skillManager}>
      <View style={styles.skillHeader}>
        <View>
          <Text style={styles.skillTitle}>
            {userType === 'skilled' && 'Skills & Expertise'}
            {userType === 'farmer' && 'Farm Specialties'}
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
          <View key={skill.id} style={styles.skillChip}>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <View style={styles.skillMeta}>
                <Text style={styles.skillCategory}>{skill.category}</Text>
                <Text style={styles.skillLevel}>• {skill.level}</Text>
                <Text style={styles.skillYears}>• {skill.years} year{skill.years !== 1 ? 's' : ''}</Text>
              </View>
            </View>
            {editing && (
              <TouchableOpacity onPress={() => onRemoveSkill(skill.id)} style={styles.removeSkillButton}>
                <Icon name="close" size={16} color="#ff6b6b" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

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
                <Text style={styles.formLabel}>Skill Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={newSkill.name}
                  onChangeText={(text) => setNewSkill(prev => ({ ...prev, name: text }))}
                  placeholder="e.g., Electrical Wiring, Crop Management"
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

// OPTIMIZED FARMER PROFILE MANAGER
const FarmerProfileManager = ({ farmDetails, onUpdate, editing }) => {
  const farmTypes = ['Crop Farm', 'Dairy Farm', 'Poultry Farm', 'Mixed Farm', 'Organic Farm'];

  return (
    <View style={styles.farmSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Farm Details</Text>
        {editing && (
          <TouchableOpacity style={styles.editSectionButton}>
            <Icon name="create-outline" size={20} color="#00f0a8" />
          </TouchableOpacity>
        )}
      </View>

      <EditableField
        value={farmDetails.farmName}
        onSave={(value) => onUpdate({ farmName: value })}
        placeholder="Enter farm name"
        label="Farm Name"
        editing={editing}
      />

      <EditableField
        value={farmDetails.farmType}
        onSave={(value) => onUpdate({ farmType: value })}
        placeholder="Select farm type"
        label="Farm Type"
        type="select"
        options={farmTypes}
        editing={editing}
      />

      <EditableField
        value={farmDetails.hectares?.toString()}
        onSave={(value) => onUpdate({ hectares: parseFloat(value) || 0 })}
        placeholder="Enter farm size in hectares"
        label="Farm Size (hectares)"
        type="number"
        editing={editing}
      />
    </View>
  );
};

// OPTIMIZED CLIENT PROFILE MANAGER
const ClientProfileManager = ({ clientDetails, onUpdate, editing }) => {
  const industries = ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Construction'];

  return (
    <View style={styles.clientSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Client Information</Text>
        {editing && (
          <TouchableOpacity style={styles.editSectionButton}>
            <Icon name="create-outline" size={20} color="#00f0a8" />
          </TouchableOpacity>
        )}
      </View>

      <EditableField
        value={clientDetails.companyName}
        onSave={(value) => onUpdate({ companyName: value })}
        placeholder="Enter company name"
        label="Company Name"
        editing={editing}
      />

      <EditableField
        value={clientDetails.industry}
        onSave={(value) => onUpdate({ industry: value })}
        placeholder="Select industry"
        label="Industry"
        type="select"
        options={industries}
        editing={editing}
      />
    </View>
  );
};

// OPTIMIZED LOCATION MANAGER
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
        ? `${address[0].city}, ${address[0].region}, ${address[0].country}`
        : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      onUpdate({
        latitude,
        longitude,
        address: readableAddress,
        lastUpdated: new Date().toISOString()
      });

    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setGettingLocation(false);
    }
  };

  return (
    <View style={styles.locationSection}>
      <Text style={styles.sectionTitle}>Service Location</Text>
      
      {location ? (
        <View style={styles.locationDisplay}>
          <Icon name="location" size={20} color="#00f0a8" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationAddress}>{location.address}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noLocationText}>No location set</Text>
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
            <Icon name="navigate" size={18} color="#000" />
          )}
          <Text style={styles.locationButtonText}>
            {gettingLocation ? 'Getting Location...' : 'Use Current Location'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// OPTIMIZED BOTTOM NAVIGATION
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

// MAIN OPTIMIZED ENTERPRISE PLATFORM
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
    updateProfileImage
  } = useAdvancedEnterpriseProfile();

  const [refreshing, setRefreshing] = useState(false);
  const [bottomNavTab, setBottomNavTab] = useState('profile');
  const scrollViewRef = useRef();

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Check out ${profile.displayName}'s professional profile!`,
        title: `${profile.displayName}'s Profile`
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00f0a8" />
        <Text style={styles.loadingText}>Loading Platform...</Text>
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
            <Icon name="chevron-back" size={28} color="#00f0a8" />
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>VSXchange Pro</Text>
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
                  />
                  <EditableField
                    value={profile.lastName}
                    onSave={(value) => updateProfile({ lastName: value })}
                    placeholder="Last Name"
                    style={styles.nameInput}
                  />
                </View>
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
                <Text style={styles.statLabel}>Years Exp</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
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
            ref={scrollViewRef}
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Bio</Text>
              <EditableField
                value={profile.bio}
                onSave={(value) => updateProfile({ bio: value })}
                placeholder="Tell us about your professional background..."
                multiline={true}
                style={styles.bioField}
                editing={editing}
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
                value={profile.contactInfo.phone}
                onSave={(value) => updateProfile({ contactInfo: { ...profile.contactInfo, phone: value } })}
                placeholder="Phone number"
                editing={editing}
              />
              <EditableField
                value={profile.contactInfo.email}
                onSave={(value) => updateProfile({ contactInfo: { ...profile.contactInfo, email: value } })}
                placeholder="Email address"
                editing={editing}
              />
            </View>
          </ScrollView>
        );

      default:
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Text>
            <Text style={styles.comingSoonText}>This section is coming soon!</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <ProfileHeader />
      
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['about', 'portfolio', 'services', 'reviews'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab)}
            >
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
        keyboardVerticalOffset={100}
      >
        <TabContent />
      </KeyboardAvoidingView>

      <AdvancedBottomNavigation 
        activeTab={bottomNavTab}
        onTabChange={setBottomNavTab}
      />

      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="#00f0a8" />
          <Text style={styles.savingOverlayText}>Saving...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// OPTIMIZED STYLES
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
  },
  nameInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
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
    marginBottom: 15,
  },
  selectorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
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
  },
  typeOptionSelected: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  typeOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  editSectionButton: {
    padding: 8,
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
  },
  skillManager: {
    padding: 20,
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
    flexDirection: 'row',
    gap: 6,
  },
  skillCategory: {
    color: '#666',
    fontSize: 10,
  },
  skillLevel: {
    color: '#666',
    fontSize: 10,
  },
  skillYears: {
    color: '#666',
    fontSize: 10,
  },
  removeSkillButton: {
    padding: 4,
  },
  farmSection: {
    padding: 20,
  },
  clientSection: {
    padding: 20,
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    color: '#fff',
    fontSize: 16,
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
  },
  levelOptions: {
    flexDirection: 'row',
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
  },
  cancelModalButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  cancelModalText: {
    color: '#ff6b6b',
    fontSize: 16,
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
  },
  locationSection: {
    padding: 20,
  },
  locationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationAddress: {
    color: '#fff',
    fontSize: 16,
  },
  noLocationText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  locationButton: {
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
  },
  navLabelActive: {
    color: '#00f0a8',
  },
  comingSoonText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});
