// src/screens/ProfileScreen.js - ENHANCED VERSION
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
  Switch
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// 🎯 GLOBAL STATE MANAGEMENT
import { AppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

// 🌐 ENHANCED BACKEND INTEGRATION
const useBackendSync = () => {
  const [saving, setSaving] = useState(false);
  const [lastSave, setLastSave] = useState(null);

  const saveProfileToBackend = async (profileData, token) => {
    try {
      setSaving(true);
      
      const backendData = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        bio: profileData.bio,
        company: profileData.company,
        website: profileData.website,
        location: profileData.location,
        avatar_url: profileData.profileImage,
        role: profileData.userType,
        extended_profile: {
          skills: profileData.skills,
          portfolio: profileData.portfolio,
          farmDetails: profileData.farmDetails,
          clientDetails: profileData.clientDetails,
          isAvailable: profileData.isAvailable,
          skillCategories: profileData.skillCategories || []
        }
      };

      const response = await fetch('https://api.vsxchangeza.com/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backendData)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      setLastSave(new Date().toISOString());
      
      // Update global state
      await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
      await AsyncStorage.setItem('globalUserData', JSON.stringify({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        profileImage: profileData.profileImage,
        userType: profileData.userType,
        skills: profileData.skills
      }));
      
      return { success: true, data: result };
      
    } catch (error) {
      console.error('Backend sync failed:', error);
      return { success: false, error: error.message };
    } finally {
      setSaving(false);
    }
  };

  const loadProfileFromBackend = async (token) => {
    try {
      const response = await fetch('https://api.vsxchangeza.com/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to load profile');
      
      const userData = await response.json();
      
      const profileData = {
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        bio: userData.bio || '',
        company: userData.company || '',
        website: userData.website || '',
        location: userData.location || null,
        profileImage: userData.avatar_url || null,
        userType: userData.role || 'skilled',
        skills: userData.extended_profile?.skills || [],
        skillCategories: userData.extended_profile?.skillCategories || [],
        portfolio: userData.extended_profile?.portfolio || [],
        farmDetails: userData.extended_profile?.farmDetails || { 
          images: [], 
          location: null, 
          name: '', 
          description: '', 
          size: '', 
          mainCrop: '',
          farmType: '',
          soilType: '',
          irrigation: '',
          equipment: []
        },
        clientDetails: userData.extended_profile?.clientDetails || { 
          location: null, 
          serviceNeeds: [],
          budget: '',
          timeline: '',
          frequency: ''
        },
        isAvailable: userData.extended_profile?.isAvailable ?? true
      };

      // Update global storage
      await AsyncStorage.setItem('globalUserData', JSON.stringify({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        profileImage: profileData.profileImage,
        userType: profileData.userType,
        skills: profileData.skills,
        skillCategories: profileData.skillCategories
      }));

      return profileData;
      
    } catch (error) {
      console.error('Backend load failed:', error);
      return null;
    }
  };

  return { saving, lastSave, saveProfileToBackend, loadProfileFromBackend };
};

// 🎪 ENHANCED SMART INPUT WITH GUIDANCE
const SmartTextInput = ({ 
  value, 
  onChangeText, 
  placeholder, 
  style, 
  multiline = false, 
  onSave,
  guidanceText,
  exampleText 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    onChangeText(inputValue);
    onSave?.();
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input, 
          style,
          isFocused && styles.inputFocused
        ]}
        value={inputValue}
        onChangeText={setInputValue}
        placeholder={placeholder}
        placeholderTextColor="#888"
        multiline={multiline}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        blurOnSubmit={!multiline}
      />
      
      {/* GUIDANCE TEXT */}
      {guidanceText && isFocused && (
        <Text style={styles.guidanceText}>{guidanceText}</Text>
      )}
      
      {/* EXAMPLE TEXT */}
      {exampleText && isFocused && (
        <Text style={styles.exampleText}>Example: {exampleText}</Text>
      )}
      
      {isFocused && (
        <TouchableOpacity style={styles.doneButton} onPress={handleSave}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// 🎯 ENHANCED STATE MANAGEMENT
const useAdvancedState = (initialState, storageKey = null) => {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(initialState);
  
  const setAdvancedState = useCallback((updater) => {
    setState(prevState => {
      const newState = typeof updater === 'function' ? updater(prevState) : updater;
      stateRef.current = newState;
      
      if (storageKey) {
        setTimeout(() => {
          AsyncStorage.setItem(storageKey, JSON.stringify(newState))
            .catch(error => console.warn('Storage failed:', error));
        }, 1000);
      }
      
      return newState;
    });
  }, [storageKey]);

  const getCurrentState = useCallback(() => stateRef.current, []);

  return [state, setAdvancedState, { getCurrentState }];
};

export default function ProfileScreen({ navigation }) {
  // 🎯 GLOBAL STATE
  const { updateGlobalUser, globalUser } = useContext(AppContext);
  
  // 🎯 STATE MANAGEMENT
  const [user, setUser] = useAdvancedState(null, 'userData');
  const [profile, setProfile, profileManager] = useAdvancedState({
    firstName: '',
    lastName: '',
    bio: '',
    company: '',
    website: '',
    skills: [],
    skillCategories: [],
    services: [],
    portfolio: [],
    location: null,
    userType: 'skilled',
    farmDetails: { 
      images: [], 
      location: null, 
      name: '', 
      description: '', 
      size: '', 
      mainCrop: '',
      farmType: '',
      soilType: '',
      irrigation: '',
      equipment: []
    },
    clientDetails: { 
      location: null, 
      serviceNeeds: [],
      budget: '',
      timeline: '',
      frequency: ''
    },
    isAvailable: true,
    profileImage: null
  }, 'userProfile');
  
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [imageUploading, setImageUploading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // 🛠️ SYSTEMS INTEGRATION
  const { saving, lastSave, saveProfileToBackend, loadProfileFromBackend } = useBackendSync();
  const scrollViewRef = useRef(null);

  // 🎨 ANIMATIONS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const profileScale = useRef(new Animated.Value(0.95)).current;
  const savePulse = useRef(new Animated.Value(1)).current;

  // 🚀 INITIALIZATION
  useEffect(() => {
    const initializeApp = async () => {
      await loadUserData();
      await requestLocationPermission();
      startEntranceAnimations();
    };
    
    initializeApp();
  }, []);

  const startEntranceAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { 
        toValue: 1, 
        duration: 800, 
        useNativeDriver: true 
      }),
      Animated.timing(slideAnim, { 
        toValue: 0, 
        duration: 600, 
        useNativeDriver: true 
      }),
      Animated.timing(profileScale, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      })
    ]).start();
  };

  const triggerSaveAnimation = () => {
    setSaveSuccess(true);
    Animated.sequence([
      Animated.timing(savePulse, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(savePulse, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
    
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    } catch (error) {
      console.warn('Location permission failed:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const [userData, profileData, token] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem('userToken')
      ]);
      
      if (userData) {
        const userObj = JSON.parse(userData);
        setUser(userObj);
      }
      
      let finalProfileData = null;
      if (token) {
        finalProfileData = await loadProfileFromBackend(token);
      }
      
      if (!finalProfileData && profileData) {
        finalProfileData = JSON.parse(profileData);
      }
      
      if (finalProfileData) {
        setProfile(prev => ({ 
          ...prev, 
          ...finalProfileData,
          farmDetails: { ...prev.farmDetails, ...finalProfileData.farmDetails },
          clientDetails: { ...prev.clientDetails, ...finalProfileData.clientDetails }
        }));
        
        // Update global context
        updateGlobalUser({
          firstName: finalProfileData.firstName,
          lastName: finalProfileData.lastName,
          profileImage: finalProfileData.profileImage,
          userType: finalProfileData.userType,
          skills: finalProfileData.skills,
          skillCategories: finalProfileData.skillCategories
        });
      }
    } catch (error) {
      console.warn('Data loading failed:', error);
    }
  };

  // 💾 ENHANCED FIELD UPDATES WITH GLOBAL SYNC
  const updateField = useCallback((field, value) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        [field]: value,
        lastUpdated: new Date().toISOString()
      };
      
      // Update global context for immediate UI updates
      if (['firstName', 'lastName', 'profileImage', 'userType', 'skills', 'skillCategories'].includes(field)) {
        updateGlobalUser({
          firstName: field === 'firstName' ? value : newProfile.firstName,
          lastName: field === 'lastName' ? value : newProfile.lastName,
          profileImage: field === 'profileImage' ? value : newProfile.profileImage,
          userType: field === 'userType' ? value : newProfile.userType,
          skills: field === 'skills' ? value : newProfile.skills,
          skillCategories: field === 'skillCategories' ? value : newProfile.skillCategories
        });
      }
      
      return newProfile;
    });
  }, [updateGlobalUser]);

  const updateFarmField = useCallback((field, value) => {
    setProfile(prev => ({
      ...prev,
      farmDetails: { ...prev.farmDetails, [field]: value }
    }));
  }, []);

  const updateClientField = useCallback((field, value) => {
    setProfile(prev => ({
      ...prev,
      clientDetails: { 
        ...prev.clientDetails, 
        [field]: field === 'serviceNeeds' ? value.split(',').map(s => s.trim()).filter(Boolean) : value 
      }
    }));
  }, []);

  // 🌐 ENHANCED BACKEND SYNC WITH GLOBAL UPDATE
  const syncProfileToBackend = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Authentication Required', 'Please log in to save changes');
        return false;
      }

      const currentProfile = profileManager.getCurrentState();
      const result = await saveProfileToBackend(currentProfile, token);
      
      if (result.success) {
        // Update global context with latest data
        updateGlobalUser({
          firstName: currentProfile.firstName,
          lastName: currentProfile.lastName,
          profileImage: currentProfile.profileImage,
          userType: currentProfile.userType,
          skills: currentProfile.skills,
          skillCategories: currentProfile.skillCategories
        });
        
        triggerSaveAnimation();
        Vibration.vibrate(100);
        return true;
      } else {
        Alert.alert('Sync Failed', 'Could not save to server. Changes saved locally.');
        return false;
      }
    } catch (error) {
      console.error('Sync failed:', error);
      Alert.alert('Sync Error', 'Failed to connect to server. Changes saved locally.');
      return false;
    }
  };

  // 🛠️ ENHANCED SKILLS MANAGEMENT WITH CATEGORIES
  const addSkill = () => {
    Alert.prompt(
      'Add Skill & Category',
      'Enter skill and category (format: Skill Name - Category):',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: (input) => {
            if (input && input.trim()) {
              const parts = input.split('-').map(part => part.trim());
              const skillName = parts[0];
              const category = parts[1] || 'general';
              
              const newSkill = { 
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9), 
                name: skillName,
                category: category,
                acquired: new Date().toISOString()
              };
              
              setProfile(prev => {
                const newSkills = [...prev.skills, newSkill];
                const newCategories = [...new Set([...prev.skillCategories, category])];
                
                // Update global context
                updateGlobalUser({
                  skills: newSkills,
                  skillCategories: newCategories
                });
                
                return {
                  ...prev,
                  skills: newSkills,
                  skillCategories: newCategories
                };
              });
            }
          }
        }
      ],
      'plain-text',
      'e.g., Tractor Operation - Machinery'
    );
  };

  const removeSkill = (skillId) => {
    setProfile(prev => {
      const newSkills = prev.skills.filter(skill => skill.id !== skillId);
      const remainingCategories = [...new Set(newSkills.map(skill => skill.category))];
      
      // Update global context
      updateGlobalUser({
        skills: newSkills,
        skillCategories: remainingCategories
      });
      
      return {
        ...prev,
        skills: newSkills,
        skillCategories: remainingCategories
      };
    });
  };

  // 🧭 NAVIGATION - ENHANCED
  const NavigationTabs = () => (
    <View style={styles.navTabs}>
      {[
        { id: 'feed', icon: 'home', label: 'Home' },
        { id: 'explore', icon: 'search', label: 'Discover' },
        { id: 'create', icon: 'add', label: 'Create' },
        { id: 'messages', icon: 'chatbubble', label: 'Inbox' },
        { id: 'profile', icon: 'person', label: 'Profile' },
      ].map((tab) => (
        <TouchableOpacity 
          key={tab.id} 
          style={[styles.navTab, activeTab === tab.id && styles.navTabActive]}
          onPress={() => {
            if (tab.id === 'profile') {
              setActiveTab('profile');
            } else {
              navigation.navigate(tab.id === 'feed' ? 'Dashboard' : tab.id);
            }
          }}
        >
          <Icon 
            name={activeTab === tab.id ? tab.icon : `${tab.icon}-outline`} 
            size={24} 
            color={activeTab === tab.id ? '#00f0a8' : '#666'} 
          />
          <Text style={[styles.navTabText, activeTab === tab.id && styles.navTabTextActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // 🎨 ENHANCED COMPONENTS WITH GUIDANCE

  const ProfileHeader = () => (
    <Animated.View 
      style={[
        styles.header,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: profileScale }] 
        }
      ]}
    >
      <View style={styles.headerTop}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={28} color="#00f0a8" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Profile</Text>
        
        <TouchableOpacity 
          style={[styles.editButton, editing && styles.editButtonActive]}
          onPress={() => setEditing(!editing)}
        >
          <Icon 
            name={editing ? "checkmark-circle" : "create-outline"} 
            size={24} 
            color="#00f0a8" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.profileMain}>
        <TouchableOpacity 
          onPress={() => uploadImages('profile')}
          disabled={imageUploading}
        >
          <Animated.View style={styles.avatarContainer}>
            {profile.profileImage ? (
              <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
            {imageUploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator color="#00f0a8" size="large" />
              </View>
            )}
            <View style={styles.avatarEditBadge}>
              <Icon name="camera" size={16} color="#000" />
            </View>
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          {editing ? (
            <>
              <SmartTextInput
                value={profile.firstName}
                onChangeText={(text) => updateField('firstName', text)}
                placeholder="First Name"
                style={styles.nameInput}
                onSave={() => {}}
                guidanceText="Your first name as you want it to appear on posts"
              />
              <SmartTextInput
                value={profile.lastName}
                onChangeText={(text) => updateField('lastName', text)}
                placeholder="Last Name"
                style={styles.nameInput}
                onSave={() => {}}
                guidanceText="Your last name for professional identification"
              />
            </>
          ) : (
            <>
              <Text style={styles.userName}>
                {profile.firstName || 'User'} {profile.lastName || 'Name'}
              </Text>
              <Text style={styles.userType}>
                {profile.userType?.toUpperCase()} 
                <Icon name="location" size={12} color="#00f0a8" /> 
                {profile.location ? ' Located' : ' Remote'}
              </Text>
              <Text style={styles.userStats}>
                <Icon name="construct" size={12} color="#666" /> {profile.skills.length} skills 
                <Icon name="images" size={12} color="#666" /> {profile.portfolio.length} portfolio items
              </Text>
            </>
          )}
        </View>
      </View>
    </Animated.View>
  );

  const BusinessSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Professional Information</Text>
      
      <SmartTextInput
        value={profile.company}
        onChangeText={(text) => updateField('company', text)}
        placeholder="Company Name (Optional)"
        style={styles.input}
        onSave={() => {}}
        guidanceText="Your business or organization name"
        exampleText="Green Fields Agriculture"
      />
      
      <SmartTextInput
        value={profile.website}
        onChangeText={(text) => updateField('website', text)}
        placeholder="Website (Optional)"
        style={styles.input}
        onSave={() => {}}
        guidanceText="Your professional website or portfolio"
        exampleText="https://yourfarm.com"
      />
      
      <SmartTextInput
        value={profile.bio}
        onChangeText={(text) => updateField('bio', text)}
        placeholder="Bio & Service Description"
        style={[styles.input, styles.textArea]}
        multiline={true}
        onSave={() => {}}
        guidanceText="Describe your services, expertise, and what you offer"
        exampleText="Expert in sustainable farming with 10+ years experience in crop rotation and soil management. Specializing in organic farming practices."
      />

      <View style={styles.userTypeSection}>
        <Text style={styles.userTypeLabel}>Account Type:</Text>
        <Text style={styles.userTypeDescription}>
          Choose how you want to use the platform. This affects how others find and interact with you.
        </Text>
        <View style={styles.userTypeOptions}>
          {[
            { type: 'skilled', icon: 'construct', label: 'Skilled Professional', description: 'Offer your skills and services' },
            { type: 'farmer', icon: 'leaf', label: 'Farmer/Grower', description: 'Manage your farm and hire help' },
            { type: 'client', icon: 'business', label: 'Service Client', description: 'Find skilled professionals' }
          ].map((item) => (
            <TouchableOpacity
              key={item.type}
              style={[
                styles.userTypeCard,
                profile.userType === item.type && styles.userTypeCardActive
              ]}
              onPress={() => editing && updateField('userType', item.type)}
              disabled={!editing}
            >
              <View style={styles.userTypeIconContainer}>
                <Icon 
                  name={item.icon} 
                  size={20} 
                  color={profile.userType === item.type ? '#000' : '#00f0a8'} 
                />
              </View>
              <Text style={[
                styles.userTypeCardText,
                profile.userType === item.type && styles.userTypeCardTextActive
              ]}>
                {item.label}
              </Text>
              <Text style={styles.userTypeCardDescription}>
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const EnhancedSkillsSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Skills & Expertise</Text>
          <Text style={styles.sectionSubtitle}>
            Add skills with categories for better discovery
          </Text>
        </View>
        {editing && (
          <TouchableOpacity onPress={addSkill} style={styles.addSkillButton}>
            <Icon name="add" size={20} color="#00f0a8" />
            <Text style={styles.seeAllText}>Add Skill</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.guidanceNote}>
        💡 Format: "Skill Name - Category". Example: "Tractor Operation - Machinery"
      </Text>

      <View style={styles.skillsGrid}>
        {profile.skills.map((skill) => (
          <View key={skill.id} style={styles.skillChip}>
            <Icon name="construct" size={14} color="#00f0a8" />
            <View style={styles.skillInfo}>
              <Text style={styles.skillText}>{skill.name}</Text>
              <Text style={styles.skillCategory}>{skill.category}</Text>
            </View>
            {editing && (
              <TouchableOpacity 
                onPress={() => removeSkill(skill.id)}
                style={styles.removeSkill}
              >
                <Icon name="close" size={16} color="#00f0a8" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        
        {profile.skills.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="construct-outline" size={32} color="#666" />
            <Text style={styles.emptyText}>No skills added yet</Text>
            <Text style={styles.emptySubtext}>
              Add skills to be discovered by clients and farmers
            </Text>
          </View>
        )}
      </View>

      {profile.skillCategories.length > 0 && (
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Your Skill Categories:</Text>
          <View style={styles.categoriesGrid}>
            {profile.skillCategories.map((category, index) => (
              <View key={index} style={styles.categoryChip}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Animated.View>
  );

  const EnhancedFarmerFields = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Farm Details</Text>
          <Text style={styles.sectionSubtitle}>
            Complete your farm profile for better service matching
          </Text>
        </View>
      </View>
      
      <SmartTextInput
        value={profile.farmDetails?.name || ''}
        onChangeText={(text) => updateFarmField('name', text)}
        placeholder="Farm Name"
        style={styles.input}
        onSave={() => {}}
        guidanceText="The official name of your farm"
        exampleText="Sunshine Valley Organic Farm"
      />
      
      <SmartTextInput
        value={profile.farmDetails?.description || ''}
        onChangeText={(text) => updateFarmField('description', text)}
        placeholder="Farm Description & Operations"
        style={[styles.input, styles.textArea]}
        multiline={true}
        onSave={() => {}}
        guidanceText="Describe your farm operations, crops, livestock, and farming methods"
        exampleText="50-acre organic farm specializing in heirloom tomatoes and sustainable agriculture. We practice crop rotation and use integrated pest management."
      />
      
      <View style={styles.row}>
        <SmartTextInput
          value={profile.farmDetails?.size || ''}
          onChangeText={(text) => updateFarmField('size', text)}
          placeholder="Farm Size (acres/hectares)"
          style={[styles.input, styles.halfInput]}
          onSave={() => {}}
          guidanceText="Total land area under cultivation"
          exampleText="50 acres"
        />
        
        <SmartTextInput
          value={profile.farmDetails?.mainCrop || ''}
          onChangeText={(text) => updateFarmField('mainCrop', text)}
          placeholder="Main Crop/Product"
          style={[styles.input, styles.halfInput]}
          onSave={() => {}}
          guidanceText="Primary agricultural product"
          exampleText="Organic Tomatoes"
        />
      </View>

      <View style={styles.row}>
        <SmartTextInput
          value={profile.farmDetails?.farmType || ''}
          onChangeText={(text) => updateFarmField('farmType', text)}
          placeholder="Farm Type"
          style={[styles.input, styles.halfInput]}
          onSave={() => {}}
          guidanceText="Type of farming operation"
          exampleText="Organic, Commercial, Family Farm"
        />
        
        <SmartTextInput
          value={profile.farmDetails?.soilType || ''}
          onChangeText={(text) => updateFarmField('soilType', text)}
          placeholder="Soil Type"
          style={[styles.input, styles.halfInput]}
          onSave={() => {}}
          guidanceText="Predominant soil composition"
          exampleText="Sandy Loam, Clay, Alluvial"
        />
      </View>

      <SmartTextInput
        value={profile.farmDetails?.irrigation || ''}
        onChangeText={(text) => updateFarmField('irrigation', text)}
        placeholder="Irrigation System"
        style={styles.input}
        onSave={() => {}}
        guidanceText="Type of irrigation methods used"
        exampleText="Drip irrigation, Center pivot, Flood irrigation"
      />

      <SmartTextInput
        value={profile.farmDetails?.equipment?.join(', ') || ''}
        onChangeText={(text) => updateFarmField('equipment', text.split(',').map(item => item.trim()).filter(Boolean))}
        placeholder="Farm Equipment Available"
        style={[styles.input, styles.textArea]}
        multiline={true}
        onSave={() => {}}
        guidanceText="List your farm machinery and equipment"
        exampleText="Tractors, Harvesters, Plows, Irrigation systems"
      />

      <View style={styles.imagesSection}>
        <Text style={styles.imagesTitle}>Farm Photos</Text>
        <Text style={styles.imagesSubtitle}>
          Showcase your farm with photos of fields, crops, and facilities
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.imagesGrid}>
            {profile.farmDetails?.images?.map((image) => (
              <View key={image.id} style={styles.imageItem}>
                <Image source={{ uri: image.uri }} style={styles.farmImage} />
                {editing && (
                  <TouchableOpacity 
                    style={styles.removeImage}
                    onPress={() => setProfile(prev => ({
                      ...prev,
                      farmDetails: {
                        ...prev.farmDetails,
                        images: prev.farmDetails.images.filter(img => img.id !== image.id)
                      }
                    }))}
                  >
                    <Icon name="close-circle" size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            {editing && (
              <TouchableOpacity 
                style={styles.addImageButton}
                onPress={() => uploadImages('farm')}
                disabled={imageUploading}
              >
                {imageUploading ? (
                  <ActivityIndicator color="#00f0a8" />
                ) : (
                  <>
                    <Icon name="add" size={30} color="#00f0a8" />
                    <Text style={styles.addImageText}>Add Farm Photos</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      <View style={styles.locationSubsection}>
        <Text style={styles.subsectionTitle}>Farm Location</Text>
        <Text style={styles.subsectionDescription}>
          Set your farm location for local service matching
        </Text>
        {profile.farmDetails?.location ? (
          <View style={styles.locationCard}>
            <Icon name="location" size={16} color="#00f0a8" />
            <Text style={styles.locationText}>{profile.farmDetails.location.address}</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.addLocationSmall}
            onPress={() => handleManualLocation('farmer')}
          >
            <Icon name="add" size={16} color="#00f0a8" />
            <Text style={styles.addLocationSmallText}>Set Farm Location</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  const EnhancedClientFields = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Service Requirements</Text>
          <Text style={styles.sectionSubtitle}>
            Tell us what services you need for better matching
          </Text>
        </View>
      </View>
      
      <SmartTextInput
        value={profile.clientDetails?.serviceNeeds?.join(', ') || ''}
        onChangeText={(text) => updateClientField('serviceNeeds', text)}
        placeholder="Service needs (comma separated)"
        style={[styles.input, styles.textArea]}
        multiline={true}
        onSave={() => {}}
        guidanceText="List the specific services you require"
        exampleText="Tractor operation, Crop spraying, Harvesting, Fence repair"
      />
      
      <View style={styles.row}>
        <SmartTextInput
          value={profile.clientDetails?.budget || ''}
          onChangeText={(text) => updateClientField('budget', text)}
          placeholder="Budget Range"
          style={[styles.input, styles.halfInput]}
          onSave={() => {}}
          guidanceText="Your estimated budget for services"
          exampleText="$500-$2000"
        />
        
        <SmartTextInput
          value={profile.clientDetails?.timeline || ''}
          onChangeText={(text) => updateClientField('timeline', text)}
          placeholder="Timeline"
          style={[styles.input, styles.halfInput]}
          onSave={() => {}}
          guidanceText="When you need the services"
          exampleText="Immediate, Within 2 weeks, Next month"
        />
      </View>

      <SmartTextInput
        value={profile.clientDetails?.frequency || ''}
        onChangeText={(text) => updateClientField('frequency', text)}
        placeholder="Service Frequency"
        style={styles.input}
        onSave={() => {}}
        guidanceText="How often you need these services"
        exampleText="One-time, Weekly, Monthly, Seasonal"
      />

      <View style={styles.locationSubsection}>
        <Text style={styles.subsectionTitle}>Service Location</Text>
        <Text style={styles.subsectionDescription}>
          Where do you need the services performed?
        </Text>
        {profile.clientDetails?.location ? (
          <View style={styles.locationCard}>
            <Icon name="location" size={16} color="#00f0a8" />
            <Text style={styles.locationText}>{profile.clientDetails.location.address}</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.addLocationSmall}
            onPress={() => handleManualLocation('client')}
          >
            <Icon name="add" size={16} color="#00f0a8" />
            <Text style={styles.addLocationSmallText}>Set Service Location</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.availability}>
        <View style={styles.availabilityInfo}>
          <Icon name="notifications" size={18} color="#fff" />
          <View>
            <Text style={styles.availabilityText}>Receive Service Offers</Text>
            <Text style={styles.availabilityDescription}>
              Get matched with skilled professionals
            </Text>
          </View>
        </View>
        <Switch
          value={profile.isAvailable}
          onValueChange={(value) => updateField('isAvailable', value)}
          trackColor={{ false: '#767577', true: '#00f0a8' }}
          thumbColor={profile.isAvailable ? '#f4f3f4' : '#f4f3f4'}
          disabled={!editing}
        />
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <ProfileHeader />
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <BusinessSection />
        <LocationSection />
        <EnhancedSkillsSection />
        <PortfolioSection />
        
        {/* Conditional Fields */}
        {profile.userType === 'farmer' && <EnhancedFarmerFields />}
        {profile.userType === 'client' && <EnhancedClientFields />}

        {/* Save Button */}
        {editing && <SaveButton />}

        {/* Status Indicator */}
        <View style={styles.statusSection}>
          <Icon name="sync" size={16} color="#00f0a8" />
          <Text style={styles.statusText}>
            Auto-save enabled • Changes are saved automatically
          </Text>
        </View>
      </ScrollView>

      <NavigationTabs />
      <LocationPickerModal />
    </SafeAreaView>
  );
}

// 🎯 NEW GLOBAL CONTEXT FOR STATE MANAGEMENT
// src/context/AppContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [globalUser, setGlobalUser] = useState({
    firstName: '',
    lastName: '',
    profileImage: null,
    userType: 'skilled',
    skills: [],
    skillCategories: []
  });

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadGlobalData();
  }, []);

  const loadGlobalData = async () => {
    try {
      const [userData, postsData] = await Promise.all([
        AsyncStorage.getItem('globalUserData'),
        AsyncStorage.getItem('globalPosts')
      ]);

      if (userData) {
        setGlobalUser(JSON.parse(userData));
      }

      if (postsData) {
        setPosts(JSON.parse(postsData));
      }
    } catch (error) {
      console.warn('Global data loading failed:', error);
    }
  };

  const updateGlobalUser = (userData) => {
    setGlobalUser(prev => {
      const newUser = { ...prev, ...userData };
      AsyncStorage.setItem('globalUserData', JSON.stringify(newUser));
      return newUser;
    });
  };

  const addPost = (post) => {
    const newPost = {
      ...post,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      author: {
        firstName: globalUser.firstName,
        lastName: globalUser.lastName,
        profileImage: globalUser.profileImage,
        userType: globalUser.userType
      },
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    setPosts(prev => {
      const newPosts = [newPost, ...prev];
      AsyncStorage.setItem('globalPosts', JSON.stringify(newPosts));
      return newPosts;
    });
  };

  return (
    <AppContext.Provider value={{
      globalUser,
      updateGlobalUser,
      posts,
      addPost,
      setPosts
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export { AppContext };

// 🎯 ENHANCED STYLES WITH GUIDANCE
const styles = StyleSheet.create({
  // ... (previous styles remain the same)
  
  // NEW STYLES FOR GUIDANCE AND ENHANCED UI
  guidanceText: {
    color: '#00f0a8',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  exampleText: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
    fontStyle: 'italic',
  },
  guidanceNote: {
    color: '#00f0a8',
    fontSize: 12,
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgba(0,240,168,0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#00f0a8',
  },
  sectionSubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  userTypeDescription: {
    color: '#666',
    fontSize: 12,
    marginBottom: 15,
    lineHeight: 16,
  },
  userTypeCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  userTypeCardActive: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderColor: '#00f0a8',
  },
  userTypeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,240,168,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  userTypeCardText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  userTypeCardTextActive: {
    color: '#000',
    fontWeight: '700',
  },
  userTypeCardDescription: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 12,
  },
  addSkillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  skillInfo: {
    flex: 1,
    marginLeft: 6,
  },
  skillCategory: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
  },
  categoriesSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  categoriesTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  categoryText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  subsectionDescription: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8,
  },
  availabilityDescription: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  imagesSubtitle: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default ProfileScreen;