// src/screens/ProfileScreen.js
import React, { useState, useEffect, useRef, useCallback } from "react";
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

const { width, height } = Dimensions.get('window');

// 🎯 ADVANCED STATE MANAGEMENT SYSTEM
const useAdvancedState = (initialState, storageKey = null) => {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(initialState);
  
  const setAdvancedState = useCallback((updater) => {
    setState(prevState => {
      const newState = typeof updater === 'function' ? updater(prevState) : updater;
      stateRef.current = newState;
      
      // Delayed persistence to prevent re-renders
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

// 🌐 BACKEND INTEGRATION
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
          isAvailable: profileData.isAvailable
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
      
      return {
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        bio: userData.bio || '',
        company: userData.company || '',
        website: userData.website || '',
        location: userData.location || null,
        profileImage: userData.avatar_url || null,
        userType: userData.role || 'skilled',
        skills: userData.extended_profile?.skills || [],
        portfolio: userData.extended_profile?.portfolio || [],
        farmDetails: userData.extended_profile?.farmDetails || { images: [], location: null, name: '', description: '', size: '', mainCrop: '' },
        clientDetails: userData.extended_profile?.clientDetails || { location: null, serviceNeeds: [] },
        isAvailable: userData.extended_profile?.isAvailable ?? true
      };
      
    } catch (error) {
      console.error('Backend load failed:', error);
      return null;
    }
  };

  return { saving, lastSave, saveProfileToBackend, loadProfileFromBackend };
};

// 🎪 SMART INPUT COMPONENT WITH DONE BUTTON
const SmartTextInput = ({ 
  value, 
  onChangeText, 
  placeholder, 
  style, 
  multiline = false, 
  onSave 
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
      {isFocused && (
        <TouchableOpacity style={styles.doneButton} onPress={handleSave}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function ProfileScreen({ navigation }) {
  // 🎯 STATE MANAGEMENT
  const [user, setUser] = useAdvancedState(null, 'userData');
  const [profile, setProfile, profileManager] = useAdvancedState({
    firstName: '',
    lastName: '',
    bio: '',
    company: '',
    website: '',
    skills: [],
    services: [],
    portfolio: [],
    location: null,
    userType: 'skilled',
    farmDetails: { images: [], location: null, name: '', description: '', size: '', mainCrop: '' },
    clientDetails: { location: null, serviceNeeds: [] },
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
      }
    } catch (error) {
      console.warn('Data loading failed:', error);
    }
  };

  // 💾 SMART FIELD UPDATES
  const updateField = useCallback((field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date().toISOString()
    }));
  }, []);

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

  // 🌐 BACKEND SYNC
  const syncProfileToBackend = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Authentication Required', 'Please log in to save changes');
        return false;
      }

      const result = await saveProfileToBackend(profileManager.getCurrentState(), token);
      
      if (result.success) {
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

  // 🧭 NAVIGATION
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

  // 📸 IMAGE UPLOAD
  const uploadImages = async (type = 'profile') => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera roll access is needed to upload images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: type === 'profile',
        allowsMultipleSelection: type !== 'profile',
        aspect: type === 'profile' ? [1, 1] : [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets) {
        setImageUploading(true);
        
        // Simulate upload process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const uploadedUrls = result.assets.map(asset => asset.uri);

        if (type === 'profile') {
          updateField('profileImage', uploadedUrls[0]);
        } else if (type === 'farm' && profile.userType === 'farmer') {
          setProfile(prev => ({
            ...prev,
            farmDetails: {
              ...prev.farmDetails,
              images: [...(prev.farmDetails?.images || []), ...uploadedUrls.map(url => ({
                uri: url,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString()
              }))]
            }
          }));
        } else if (type === 'portfolio') {
          setProfile(prev => ({
            ...prev,
            portfolio: [...prev.portfolio, ...uploadedUrls.map(url => ({
              uri: url,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              description: '',
              timestamp: new Date().toISOString()
            }))]
          }));
        }
        
        setImageUploading(false);
        Vibration.vibrate(50);
      }
    } catch (error) {
      setImageUploading(false);
      Alert.alert('Upload Failed', 'Failed to upload images. Please try again.');
    }
  };

  // 🗺️ LOCATION SERVICES
  const getCurrentLocation = async () => {
    try {
      if (!locationPermission) {
        Alert.alert('Location Access', 'Enable location permissions to use this feature');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000
      });

      const { latitude, longitude } = location.coords;
      
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      const readableAddress = address[0] 
        ? `${address[0].name || ''} ${address[0].city || ''} ${address[0].region || ''}`.trim()
        : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      const locationData = {
        latitude,
        longitude,
        address: readableAddress,
        timestamp: new Date().toISOString()
      };
      
      if (profile.userType === 'farmer') {
        setProfile(prev => ({
          ...prev,
          farmDetails: { 
            ...prev.farmDetails, 
            location: locationData 
          }
        }));
      } else if (profile.userType === 'client') {
        setProfile(prev => ({
          ...prev,
          clientDetails: { 
            ...prev.clientDetails, 
            location: locationData 
          }
        }));
      } else {
        updateField('location', locationData);
      }
      
      setShowLocationPicker(false);
      Alert.alert('Location Set', 'Your location has been updated successfully');
    } catch (error) {
      console.warn('Location acquisition failed:', error);
      Alert.alert('Location Error', 'Failed to get your location. Please try again.');
    }
  };

  const handleManualLocation = (userType = 'general') => {
    Alert.prompt(
      'Enter Location',
      'Please enter your address:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save Location', 
          onPress: (address) => {
            if (address && address.trim()) {
              const manualLocation = {
                latitude: -23.0833 + (Math.random() - 0.5) * 0.01,
                longitude: 30.3833 + (Math.random() - 0.5) * 0.01,
                address: address.trim(),
                accuracy: 'Manual Input'
              };

              if (userType === 'farmer') {
                setProfile(prev => ({
                  ...prev,
                  farmDetails: { ...prev.farmDetails, location: manualLocation }
                }));
              } else if (userType === 'client') {
                setProfile(prev => ({
                  ...prev,
                  clientDetails: { ...prev.clientDetails, location: manualLocation }
                }));
              } else {
                updateField('location', manualLocation);
              }
              setShowLocationPicker(false);
            }
          }
        }
      ],
      'plain-text'
    );
  };

  // 🛠️ SKILLS MANAGEMENT
  const addSkill = () => {
    Alert.prompt(
      'Add Skill',
      'Enter your skill:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: (skill) => {
            if (skill && skill.trim()) {
              setProfile(prev => ({
                ...prev,
                skills: [...prev.skills, { 
                  id: Date.now().toString() + Math.random().toString(36).substr(2, 9), 
                  name: skill.trim(),
                  category: 'general',
                  acquired: new Date().toISOString()
                }]
              }));
            }
          }
        }
      ]
    );
  };

  const removeSkill = (skillId) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== skillId)
    }));
  };

  // 🎨 COMPONENTS
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
              />
              <SmartTextInput
                value={profile.lastName}
                onChangeText={(text) => updateField('lastName', text)}
                placeholder="Last Name"
                style={styles.nameInput}
                onSave={() => {}}
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
      />
      
      <SmartTextInput
        value={profile.website}
        onChangeText={(text) => updateField('website', text)}
        placeholder="Website (Optional)"
        style={styles.input}
        onSave={() => {}}
      />
      
      <SmartTextInput
        value={profile.bio}
        onChangeText={(text) => updateField('bio', text)}
        placeholder="Bio & Service Description"
        style={[styles.input, styles.textArea]}
        multiline={true}
        onSave={() => {}}
      />

      <View style={styles.userTypeSection}>
        <Text style={styles.userTypeLabel}>Account Type:</Text>
        <View style={styles.userTypeOptions}>
          {['skilled', 'farmer', 'client'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.userTypeOption,
                profile.userType === type && styles.userTypeOptionActive
              ]}
              onPress={() => editing && updateField('userType', type)}
              disabled={!editing}
            >
              <Icon 
                name={
                  type === 'skilled' ? 'construct' : 
                  type === 'farmer' ? 'leaf' : 'person'
                } 
                size={16} 
                color={profile.userType === type ? '#000' : '#fff'} 
              />
              <Text style={[
                styles.userTypeText,
                profile.userType === type && styles.userTypeTextActive
              ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const LocationSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Service Location</Text>
        {editing && (
          <TouchableOpacity onPress={() => setShowLocationPicker(true)}>
            <Text style={styles.seeAllText}>
              {profile.location ? 'Update' : 'Set Location'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {profile.location ? (
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Icon name="location" size={20} color="#00f0a8" />
            <Text style={styles.locationStatus}>Location Set</Text>
            <Icon name="checkmark-circle" size={16} color="#00f0a8" />
          </View>
          <Text style={styles.locationText}>
            {profile.location.address}
          </Text>
          <Text style={styles.coordinates}>
            {profile.location.latitude.toFixed(6)}, {profile.location.longitude.toFixed(6)}
          </Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.addLocationButton}
          onPress={() => setShowLocationPicker(true)}
        >
          <Icon name="navigate-circle" size={24} color="#00f0a8" />
          <Text style={styles.addLocationText}>Set Service Location</Text>
        </TouchableOpacity>
      )}

      <View style={styles.availability}>
        <View style={styles.availabilityInfo}>
          <Icon name="business" size={18} color="#fff" />
          <Text style={styles.availabilityText}>Available for Work</Text>
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

  const SkillsSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Skills & Expertise</Text>
        {editing && (
          <TouchableOpacity onPress={addSkill}>
            <Text style={styles.seeAllText}>Add Skill</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.skillsGrid}>
        {profile.skills.map((skill) => (
          <View key={skill.id} style={styles.skillChip}>
            <Icon name="construct" size={14} color="#00f0a8" />
            <Text style={styles.skillText}>{skill.name}</Text>
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
          </View>
        )}
      </View>
    </Animated.View>
  );

  const PortfolioSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Portfolio</Text>
        {editing && (
          <TouchableOpacity onPress={() => uploadImages('portfolio')}>
            <Text style={styles.seeAllText}>Add Photos</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.portfolioGrid}>
          {profile.portfolio.map((item) => (
            <View key={item.id} style={styles.portfolioItem}>
              <Image source={{ uri: item.uri }} style={styles.portfolioImage} />
              {editing && (
                <TouchableOpacity 
                  style={styles.removePortfolio}
                  onPress={() => setProfile(prev => ({
                    ...prev,
                    portfolio: prev.portfolio.filter(p => p.id !== item.id)
                  }))}
                >
                  <Icon name="close-circle" size={24} color="#ff6b6b" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          {editing && (
            <TouchableOpacity 
              style={styles.addPortfolioButton}
              onPress={() => uploadImages('portfolio')}
              disabled={imageUploading}
            >
              {imageUploading ? (
                <ActivityIndicator color="#00f0a8" size="large" />
              ) : (
                <>
                  <Icon name="add" size={40} color="#00f0a8" />
                  <Text style={styles.addPortfolioText}>Add Photos</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );

  const FarmerFields = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Farm Details</Text>
      
      <SmartTextInput
        value={profile.farmDetails?.name || ''}
        onChangeText={(text) => updateFarmField('name', text)}
        placeholder="Farm Name"
        style={styles.input}
        onSave={() => {}}
      />
      
      <SmartTextInput
        value={profile.farmDetails?.description || ''}
        onChangeText={(text) => updateFarmField('description', text)}
        placeholder="Farm Description & Crops"
        style={[styles.input, styles.textArea]}
        multiline={true}
        onSave={() => {}}
      />
      
      <View style={styles.row}>
        <SmartTextInput
          value={profile.farmDetails?.size || ''}
          onChangeText={(text) => updateFarmField('size', text)}
          placeholder="Farm Size (acres)"
          style={[styles.input, styles.halfInput]}
          onSave={() => {}}
        />
        
        <SmartTextInput
          value={profile.farmDetails?.mainCrop || ''}
          onChangeText={(text) => updateFarmField('mainCrop', text)}
          placeholder="Main Crop"
          style={[styles.input, styles.halfInput]}
          onSave={() => {}}
        />
      </View>

      <View style={styles.imagesSection}>
        <Text style={styles.imagesTitle}>Farm Photos</Text>
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
                    <Text style={styles.addImageText}>Add Photos</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      <View style={styles.locationSubsection}>
        <Text style={styles.subsectionTitle}>Farm Location</Text>
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

  const ClientFields = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Service Requirements</Text>
      
      <SmartTextInput
        value={profile.clientDetails?.serviceNeeds?.join(', ') || ''}
        onChangeText={(text) => updateClientField('serviceNeeds', text)}
        placeholder="Service needs (comma separated)"
        style={[styles.input, styles.textArea]}
        multiline={true}
        onSave={() => {}}
      />
      
      <View style={styles.locationSubsection}>
        <Text style={styles.subsectionTitle}>Service Location</Text>
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
          <Text style={styles.availabilityText}>Receive Service Offers</Text>
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

  const LocationPickerModal = () => (
    <Modal
      visible={showLocationPicker}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Set Location</Text>
            <TouchableOpacity 
              onPress={() => setShowLocationPicker(false)}
              style={styles.modalCloseButton}
            >
              <Icon name="close" size={24} color="#00f0a8" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.locationOptions}>
            <TouchableOpacity 
              style={styles.locationOption}
              onPress={getCurrentLocation}
            >
              <Icon name="navigate" size={32} color="#00f0a8" />
              <Text style={styles.locationOptionTitle}>Use Current Location</Text>
              <Text style={styles.locationOptionDesc}>
                Automatically detect your location
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.locationOption}
              onPress={() => handleManualLocation('general')}
            >
              <Icon name="pencil" size={32} color="#00f0a8" />
              <Text style={styles.locationOptionTitle}>Enter Address</Text>
              <Text style={styles.locationOptionDesc}>
                Manually enter your location
              </Text>
            </TouchableOpacity>

            {profile.location && (
              <TouchableOpacity 
                style={[styles.locationOption, styles.removeLocationOption]}
                onPress={() => {
                  updateField('location', null);
                  setShowLocationPicker(false);
                }}
              >
                <Icon name="trash" size={32} color="#ff6b6b" />
                <Text style={[styles.locationOptionTitle, styles.removeLocationText]}>
                  Clear Location
                </Text>
                <Text style={styles.locationOptionDesc}>
                  Remove your location data
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.locationHint}>
            Setting your location helps match you with relevant services and opportunities
          </Text>
        </View>
      </View>
    </Modal>
  );

  const SaveButton = () => (
    <Animated.View style={[styles.saveButtonContainer, { transform: [{ scale: savePulse }] }]}>
      <TouchableOpacity 
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={async () => {
          const success = await syncProfileToBackend();
          if (success) {
            setEditing(false);
          }
        }}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#000" size="small" />
        ) : (
          <>
            <Icon name="cloud-upload" size={20} color="#000" />
            <Text style={styles.saveButtonText}>
              {saveSuccess ? 'Saved ✓' : 'Save Changes'}
            </Text>
          </>
        )}
      </TouchableOpacity>
      
      {lastSave && (
        <Text style={styles.lastSaveText}>
          Last saved: {new Date(lastSave).toLocaleTimeString()}
        </Text>
      )}
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
        <SkillsSection />
        <PortfolioSection />
        
        {/* Conditional Fields */}
        {profile.userType === 'farmer' && <FarmerFields />}
        {profile.userType === 'client' && <ClientFields />}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,240,168,0.2)',
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
    backgroundColor: 'rgba(0,240,168,0.1)',
  },
  headerTitle: {
    color: '#00f0a8',
    fontSize: 20,
    fontWeight: '800',
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,240,168,0.1)',
  },
  editButtonActive: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    transform: [{ scale: 1.1 }],
  },
  profileMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
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
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00f0a8',
  },
  avatarText: {
    color: '#000',
    fontSize: 32,
    fontWeight: '900',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatarEditBadge: {
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
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  userType: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  userStats: {
    color: '#666',
    fontSize: 12,
  },
  nameInput: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: '#00f0a8',
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  // SMART INPUT STYLES
  inputContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputFocused: {
    borderColor: '#00f0a8',
    backgroundColor: 'rgba(0,240,168,0.05)',
  },
  doneButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#00f0a8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  doneButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 100,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#00f0a8',
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  locationCard: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationStatus: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 4,
    flex: 1,
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  coordinates: {
    color: '#666',
    fontSize: 12,
  },
  addLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0,240,168,0.3)',
    borderStyle: 'dashed',
  },
  addLocationText: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  availability: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  skillText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    marginRight: 8,
  },
  removeSkill: {
    padding: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  portfolioGrid: {
    flexDirection: 'row',
  },
  portfolioItem: {
    position: 'relative',
    width: 120,
    height: 120,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.2)',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  removePortfolio: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 2,
  },
  addPortfolioButton: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,240,168,0.3)',
    borderStyle: 'dashed',
  },
  addPortfolioText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  userTypeSection: {
    marginTop: 15,
  },
  userTypeLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  userTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  userTypeOptionActive: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderColor: '#00f0a8',
  },
  userTypeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  userTypeTextActive: {
    color: '#000',
    fontWeight: '700',
  },
  saveButtonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00f0a8',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
  },
  saveButtonDisabled: {
    backgroundColor: '#666',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  lastSaveText: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: 'rgba(0,240,168,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  statusText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    textAlign: 'center',
  },
  navTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 15,
    marginHorizontal: 2,
  },
  navTabActive: {
    backgroundColor: 'rgba(0,240,168,0.14)',
  },
  navTabText: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  navTabTextActive: {
    color: '#00f0a8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#000',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
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
    fontSize: 20,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 4,
  },
  locationOptions: {
    padding: 20,
  },
  locationOption: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.2)',
  },
  removeLocationOption: {
    borderColor: 'rgba(255,107,107,0.3)',
  },
  locationOptionTitle: {
    color: '#00f0a8',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  removeLocationText: {
    color: '#ff6b6b',
  },
  locationOptionDesc: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  locationHint: {
    color: '#666',
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
    fontStyle: 'italic',
  },
  imagesSection: {
    marginTop: 15,
  },
  imagesTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  imagesGrid: {
    flexDirection: 'row',
  },
  imageItem: {
    position: 'relative',
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.2)',
  },
  farmImage: {
    width: '100%',
    height: '100%',
  },
  removeImage: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    padding: 2,
  },
  addImageButton: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,240,168,0.3)',
    borderStyle: 'dashed',
  },
  addImageText: {
    color: '#00f0a8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
  locationSubsection: {
    marginTop: 15,
  },
  subsectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  addLocationSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  addLocationSmallText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});