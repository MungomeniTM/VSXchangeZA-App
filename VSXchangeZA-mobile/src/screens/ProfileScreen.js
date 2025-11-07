
  // src/screens/ProfileScreen.js - CLEANED VERSION
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
import { AppContext } from '../context/AppContext';

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

  // ... [Rest of the component code remains the same as your original ProfileScreen]
  // Include all the other components like BusinessSection, LocationSection, etc.

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
        {/* Your existing sections here */}
        <Text>Profile Content Goes Here</Text>
        
        {/* Save Button */}
        {editing && (
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
                    {saveSuccess ? 'Saved' : 'Save Changes'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      <NavigationTabs />
    </SafeAreaView>
  );
}

// Your existing styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  
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