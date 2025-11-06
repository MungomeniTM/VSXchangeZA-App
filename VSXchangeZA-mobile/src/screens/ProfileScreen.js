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
  FlatList,
  Vibration,
  Switch,
  Keyboard
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAPI } from "../api";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

// 🌀 QUANTUM STATE ENTANGLEMENT SYSTEM
const useQuantumState = (initialState, persistenceKey = null) => {
  const [state, setState] = useState(initialState);
  const quantumField = useRef(new Map());
  
  const setQuantumState = useCallback((updater) => {
    setState(prevState => {
      const newState = typeof updater === 'function' ? updater(prevState) : updater;
      
      // Quantum persistence across dimensions
      if (persistenceKey) {
        AsyncStorage.setItem(persistenceKey, JSON.stringify(newState));
      }
      
      // Entanglement propagation
      if (quantumField.current.has(persistenceKey)) {
        quantumField.current.get(persistenceKey).forEach(callback => {
          callback(newState);
        });
      }
      
      return newState;
    });
  }, [persistenceKey]);

  const entangle = useCallback((callback, dimension = 'alpha') => {
    if (!quantumField.current.has(persistenceKey)) {
      quantumField.current.set(persistenceKey, new Map());
    }
    quantumField.current.get(persistenceKey).set(dimension, callback);
  }, [persistenceKey]);

  return [state, setQuantumState, { entangle, quantumField }];
};

export default function ProfileScreen({ navigation }) {
  // 🌟 QUANTUM STATE ENTANGLEMENT
  const [user, setUser] = useQuantumState(null, 'userConsciousness');
  const [profile, setProfile, profileQuantum] = useQuantumState({
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
    farmDetails: { images: [], location: null },
    clientDetails: { location: null, serviceNeeds: [] },
    isAvailable: true,
    quantumSignature: Math.random().toString(36).substr(2, 9)
  }, 'quantumProfile');
  
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [imageUploading, setImageUploading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // ✨ QUANTUM ANIMATIONS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const quantumGlow = useRef(new Animated.Value(0)).current;

  // 🎪 REAL-TIME SYNC SYSTEM
  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  // Entangle profile updates with user data
  useEffect(() => {
    profileQuantum.entangle((newProfile) => {
      // Real-time sync with global user state
      if (newProfile.firstName || newProfile.lastName) {
        updateGlobalUserState(newProfile);
      }
    }, 'globalSync');
  }, []);

  const updateGlobalUserState = async (profileData) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const userObj = JSON.parse(userData);
        const updatedUser = {
          ...userObj,
          firstName: profileData.firstName || userObj.firstName,
          lastName: profileData.lastName || userObj.lastName,
          profileImage: profileData.profileImage || userObj.profileImage
        };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.warn('Quantum sync failed:', error);
    }
  };

  const NavigationTabs = () => (
    <View style={[styles.navTabs, keyboardVisible && styles.navTabsHidden]}>
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

  useEffect(() => {
    loadUserData();
    startEntranceAnimations();
    requestLocationPermission();
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
      Animated.timing(quantumGlow, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    } catch (error) {
      console.warn('Location permission request failed:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const [userData, profileData] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('quantumProfile')
      ]);
      
      if (userData) {
        const userObj = JSON.parse(userData);
        setUser(userObj);
      }
      
      if (profileData) {
        setProfile(prev => ({ ...prev, ...JSON.parse(profileData) }));
      }
    } catch (error) {
      console.warn('Quantum data loading failed:', error);
    }
  };

  // 💾 QUANTUM AUTO-SAVE SYSTEM
  const quantumAutoSave = useCallback((field, value) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        [field]: value,
        lastUpdated: new Date().toISOString()
      };
      
      // Real-time persistence
      AsyncStorage.setItem('quantumProfile', JSON.stringify(newProfile));
      
      return newProfile;
    });
  }, []);

  const trackProfileUpdate = (profileData) => {
    const analyticsData = {
      userId: user?.id,
      updateType: 'quantum_profile',
      timestamp: new Date().toISOString(),
      quantumSignature: profileData.quantumSignature,
      fieldsUpdated: Object.keys(profileData).filter(key => 
        profileData[key] !== null && profileData[key] !== ''
      ),
      userType: profileData.userType,
      hasLocation: !!profileData.location,
      portfolioItems: profileData.portfolio?.length || 0,
      skillsCount: profileData.skills?.length || 0
    };
    
    console.log('Quantum Analytics:', analyticsData);
  };

  // 📸 ADVANCED MULTI-TYPE IMAGE UPLOAD
  const uploadImages = async (type = 'profile') => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        Alert.alert('Quantum Access Required', 'Need camera roll permissions');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: type === 'profile',
        allowsMultipleSelection: type !== 'profile',
        aspect: type === 'profile' ? [1, 1] : [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        setImageUploading(true);
        
        const uploadedUrls = await Promise.all(
          result.assets.map(asset => simulateQuantumUpload(asset.uri))
        );

        if (type === 'profile') {
          quantumAutoSave('profileImage', uploadedUrls[0]);
        } else if (type === 'farm' && profile.userType === 'farmer') {
          setProfile(prev => ({
            ...prev,
            farmDetails: {
              ...prev.farmDetails,
              images: [...prev.farmDetails.images, ...uploadedUrls.map(url => ({
                uri: url,
                id: Date.now().toString() + Math.random(),
                timestamp: new Date().toISOString()
              }))]
            }
          }));
        } else if (type === 'portfolio') {
          setProfile(prev => ({
            ...prev,
            portfolio: [...prev.portfolio, ...uploadedUrls.map(url => ({
              uri: url,
              id: Date.now().toString() + Math.random(),
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
      Alert.alert('Quantum Upload Failed', 'Dimensional interference detected');
    }
  };

  const simulateQuantumUpload = async (uri) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(uri);
      }, 500);
    });
  };

  // 🗺️ QUANTUM LOCATION ENTANGLEMENT
  const getCurrentLocation = async () => {
    try {
      if (!locationPermission) {
        Alert.alert('Quantum Location', 'Enable location permissions for precise entanglement');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      const readableAddress = address[0] 
        ? `${address[0].name || ''} ${address[0].city || ''} ${address[0].region || ''}`.trim()
        : `Quantum Coordinates (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;

      const quantumLocation = {
        latitude,
        longitude,
        address: readableAddress,
        accuracy: 'Quantum GPS Precision',
        timestamp: new Date().toISOString()
      };
      
      // Set location based on user type
      if (profile.userType === 'farmer') {
        setProfile(prev => ({
          ...prev,
          farmDetails: { ...prev.farmDetails, location: quantumLocation }
        }));
      } else if (profile.userType === 'client') {
        setProfile(prev => ({
          ...prev,
          clientDetails: { ...prev.clientDetails, location: quantumLocation }
        }));
      } else {
        quantumAutoSave('location', quantumLocation);
      }
      
      trackLocationUpdate(quantumLocation);
      Alert.alert('Quantum Location Set', 'Spatial coordinates entangled successfully');
    } catch (error) {
      console.warn('Quantum location acquisition failed:', error);
      Alert.alert('Spatial Anomaly', 'Quantum field disruption detected');
    }
  };

  const handleManualLocation = (userType = 'general') => {
    Alert.prompt(
      'Quantum Location Input',
      'Enter your spatial coordinates (address):',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Entangle Location', 
          onPress: (address) => {
            if (address && address.trim()) {
              const manualLocation = {
                latitude: -23.0833 + (Math.random() - 0.5) * 0.01,
                longitude: 30.3833 + (Math.random() - 0.5) * 0.01,
                address: address.trim(),
                accuracy: 'Manual Quantum Input'
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
                quantumAutoSave('location', manualLocation);
              }
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const trackLocationUpdate = (location) => {
    console.log('Quantum location entanglement:', location);
  };

  // 🛠️ QUANTUM SKILL MATRIX
  const addSkill = () => {
    Alert.prompt(
      'Acquire Quantum Skill',
      'Enter your expertise:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Quantum Upload', 
          onPress: (skill) => {
            if (skill && skill.trim()) {
              setProfile(prev => ({
                ...prev,
                skills: [...prev.skills, { 
                  id: Date.now().toString(), 
                  name: skill.trim(),
                  category: 'quantum',
                  proficiency: 0.85,
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

  // 🌾 QUANTUM FARMER PROFILE
  const renderFarmerFields = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Quantum Farm Matrix</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Farm Name"
        value={profile.farmDetails?.name || ''}
        onChangeText={(text) => setProfile(prev => ({
          ...prev,
          farmDetails: { ...prev.farmDetails, name: text }
        }))}
        placeholderTextColor="#666"
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Farm Description & Crops"
        value={profile.farmDetails?.description || ''}
        onChangeText={(text) => setProfile(prev => ({
          ...prev,
          farmDetails: { ...prev.farmDetails, description: text }
        }))}
        multiline
        numberOfLines={3}
        placeholderTextColor="#666"
      />
      
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Farm Size (acres)"
          value={profile.farmDetails?.size || ''}
          onChangeText={(text) => setProfile(prev => ({
            ...prev,
            farmDetails: { ...prev.farmDetails, size: text }
          }))}
          keyboardType="numeric"
          placeholderTextColor="#666"
        />
        
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Main Crop"
          value={profile.farmDetails?.mainCrop || ''}
          onChangeText={(text) => setProfile(prev => ({
            ...prev,
            farmDetails: { ...prev.farmDetails, mainCrop: text }
          }))}
          placeholderTextColor="#666"
        />
      </View>

      {/* Farm Images */}
      <View style={styles.imagesSection}>
        <Text style={styles.imagesTitle}>Farm Images</Text>
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
              >
                <Icon name="add" size={30} color="#00f0a8" />
                <Text style={styles.addImageText}>Add Farm Photos</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Farm Location */}
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

  // 👥 QUANTUM CLIENT PROFILE
  const renderClientFields = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Client Service Matrix</Text>
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Service Needs & Requirements"
        value={profile.clientDetails?.serviceNeeds?.join(', ') || ''}
        onChangeText={(text) => setProfile(prev => ({
          ...prev,
          clientDetails: {
            ...prev.clientDetails,
            serviceNeeds: text.split(',').map(s => s.trim()).filter(Boolean)
          }
        }))}
        multiline
        numberOfLines={3}
        placeholderTextColor="#666"
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
          onValueChange={(value) => quantumAutoSave('isAvailable', value)}
          trackColor={{ false: '#767577', true: '#00f0a8' }}
          thumbColor={profile.isAvailable ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
    </Animated.View>
  );

  const ProfileHeader = () => (
    <Animated.View 
      style={[
        styles.header,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
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
        
        <Text style={styles.headerTitle}>Quantum Profile</Text>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setEditing(!editing)}
        >
          <Icon 
            name={editing ? "checkmark" : "create-outline"} 
            size={24} 
            color="#00f0a8" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.profileMain}>
        <TouchableOpacity onPress={() => uploadImages('profile')}>
          <Animated.View style={[styles.avatarContainer, {
            opacity: quantumGlow
          }]}>
            {profile.profileImage ? (
              <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.firstName?.[0]?.toUpperCase() || 'Ψ'}
                </Text>
              </View>
            )}
            {imageUploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator color="#00f0a8" />
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          {editing ? (
            <>
              <TextInput
                style={styles.nameInput}
                value={profile.firstName}
                onChangeText={(text) => quantumAutoSave('firstName', text)}
                placeholder="First Name"
                placeholderTextColor="#666"
                onSubmitEditing={Keyboard.dismiss}
              />
              <TextInput
                style={styles.nameInput}
                value={profile.lastName}
                onChangeText={(text) => quantumAutoSave('lastName', text)}
                placeholder="Last Name"
                placeholderTextColor="#666"
                onSubmitEditing={Keyboard.dismiss}
              />
            </>
          ) : (
            <>
              <Text style={styles.userName}>
                {profile.firstName} {profile.lastName}
              </Text>
              <Text style={styles.userType}>
                {profile.userType?.toUpperCase()} 
                <Icon name="location" size={12} color="#00f0a8" /> 
                {profile.location ? ' Quantum Located' : ' Remote Entity'}
              </Text>
              <Text style={styles.userStats}>
                <Icon name="construct" size={12} color="#666" /> {profile.skills.length} skills 
                <Icon name="images" size={12} color="#666" /> {profile.portfolio.length} quantum assets
              </Text>
            </>
          )}
        </View>
      </View>
    </Animated.View>
  );

  const LocationSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quantum Service Field</Text>
        {editing && (
          <TouchableOpacity onPress={() => setShowLocationPicker(true)}>
            <Text style={styles.seeAllText}>
              {profile.location ? 'Re-Entangle' : 'Set Coordinates'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {profile.location ? (
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Icon name="location" size={20} color="#00f0a8" />
            <Text style={styles.locationStatus}>Quantum Entangled</Text>
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
          <Text style={styles.addLocationText}>Entangle Service Coordinates</Text>
        </TouchableOpacity>
      )}

      <View style={styles.availability}>
        <View style={styles.availabilityInfo}>
          <Icon name="business" size={18} color="#fff" />
          <Text style={styles.availabilityText}>Quantum Available</Text>
        </View>
        <Switch
          value={profile.isAvailable}
          onValueChange={(value) => quantumAutoSave('isAvailable', value)}
          trackColor={{ false: '#767577', true: '#00f0a8' }}
          thumbColor={profile.isAvailable ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
    </Animated.View>
  );

  const SkillsSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quantum Skills Matrix</Text>
        {editing && (
          <TouchableOpacity onPress={addSkill}>
            <Text style={styles.seeAllText}>Acquire Skill</Text>
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
            <Text style={styles.emptyText}>No quantum skills acquired</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const PortfolioSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quantum Portfolio</Text>
        {editing && (
          <TouchableOpacity onPress={() => uploadImages('portfolio')}>
            <Text style={styles.seeAllText}>Add Quantum Assets</Text>
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
            >
              <Icon name="add" size={40} color="#00f0a8" />
              <Text style={styles.addPortfolioText}>Add Quantum Assets</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );

  const BusinessSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Quantum Identity Matrix</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Quantum Entity Name (Optional)"
        value={profile.company}
        onChangeText={(text) => quantumAutoSave('company', text)}
        editable={editing}
        placeholderTextColor="#666"
        onSubmitEditing={Keyboard.dismiss}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Quantum Web Portal (Optional)"
        value={profile.website}
        onChangeText={(text) => quantumAutoSave('website', text)}
        editable={editing}
        placeholderTextColor="#666"
        keyboardType="url"
        onSubmitEditing={Keyboard.dismiss}
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Quantum Bio & Service Description"
        value={profile.bio}
        onChangeText={(text) => quantumAutoSave('bio', text)}
        editable={editing}
        multiline
        numberOfLines={4}
        placeholderTextColor="#666"
        onSubmitEditing={Keyboard.dismiss}
      />

      <View style={styles.userTypeSection}>
        <Text style={styles.userTypeLabel}>Quantum Entity Type:</Text>
        <View style={styles.userTypeOptions}>
          {['skilled', 'farmer', 'client'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.userTypeOption,
                profile.userType === type && styles.userTypeOptionActive
              ]}
              onPress={() => quantumAutoSave('userType', type)}
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

  const LocationPickerModal = () => (
    <Modal
      visible={showLocationPicker}
      animationType="slide"
      transparent
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Quantum Location Entanglement</Text>
          <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
            <Icon name="close" size={24} color="#00f0a8" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.locationOptions}>
          <TouchableOpacity 
            style={styles.locationOption}
            onPress={getCurrentLocation}
          >
            <Icon name="navigate" size={32} color="#00f0a8" />
            <Text style={styles.locationOptionTitle}>Quantum GPS Detection</Text>
            <Text style={styles.locationOptionDesc}>
              Precise spatial coordinate acquisition
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.locationOption}
            onPress={() => handleManualLocation('general')}
          >
            <Icon name="pencil" size={32} color="#00f0a8" />
            <Text style={styles.locationOptionTitle}>Manual Coordinate Input</Text>
            <Text style={styles.locationOptionDesc}>
              Enter spatial coordinates manually
            </Text>
          </TouchableOpacity>

          {profile.location && (
            <TouchableOpacity 
              style={[styles.locationOption, styles.removeLocationOption]}
              onPress={() => {
                quantumAutoSave('location', null);
                setShowLocationPicker(false);
              }}
            >
              <Icon name="trash" size={32} color="#ff6b6b" />
              <Text style={[styles.locationOptionTitle, styles.removeLocationText]}>
                Clear Quantum Coordinates
              </Text>
              <Text style={styles.locationOptionDesc}>
                Remove spatial entanglement
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.locationHint}>
          Quantum location entanglement enables precise service matching across dimensions
        </Text>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <ProfileHeader />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BusinessSection />
        <LocationSection />
        <SkillsSection />
        <PortfolioSection />
        
        {/* Conditional Quantum Fields */}
        {profile.userType === 'farmer' && renderFarmerFields()}
        {profile.userType === 'client' && renderClientFields()}

        {/* Quantum Save Indicator */}
        {editing && (
          <View style={styles.quantumSaveSection}>
            <Icon name="infinite" size={20} color="#00f0a8" />
            <Text style={styles.quantumSaveText}>
              Quantum Auto-Save Active • All changes persist across dimensions
            </Text>
          </View>
        )}
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
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  scrollView: {
    flex: 1,
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
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
  },
  quantumSaveSection: {
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
  quantumSaveText: {
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
  },
  navTabsHidden: {
    display: 'none',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 15,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
  // Farm-specific styles
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