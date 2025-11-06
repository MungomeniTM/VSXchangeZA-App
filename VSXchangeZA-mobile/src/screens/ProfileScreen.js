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
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAPI } from "../api";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

// 🌀 QUANTUM KEYBOARD ENTANGLEMENT SYSTEM
const useQuantumKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setIsKeyboardVisible(true);
    });

    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  return { keyboardHeight, isKeyboardVisible };
};

// 🌟 QUANTUM REAL-TIME SYNC SYSTEM
const useQuantumSync = (profile, user) => {
  useEffect(() => {
    const syncAcrossDimensions = async () => {
      try {
        // Sync with global user state
        if (profile.firstName || profile.lastName || profile.profileImage) {
          const currentUser = await AsyncStorage.getItem('user');
          if (currentUser) {
            const userObj = JSON.parse(currentUser);
            const updatedUser = {
              ...userObj,
              firstName: profile.firstName || userObj.firstName,
              lastName: profile.lastName || userObj.lastName,
              profileImage: profile.profileImage || userObj.profileImage,
              lastSynced: new Date().toISOString()
            };
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Sync with posts and other dimensions
            await syncUserPosts(updatedUser);
          }
        }
      } catch (error) {
        console.warn('Quantum sync anomaly:', error);
      }
    };

    syncAcrossDimensions();
  }, [profile.firstName, profile.lastName, profile.profileImage]);

  const syncUserPosts = async (userData) => {
    try {
      // Update all posts with new user information
      const postsData = await AsyncStorage.getItem('posts');
      if (postsData) {
        const posts = JSON.parse(postsData);
        const updatedPosts = posts.map(post => {
          if (post.userId === userData.id) {
            return {
              ...post,
              user: {
                ...post.user,
                firstName: userData.firstName,
                lastName: userData.lastName,
                profileImage: userData.profileImage
              }
            };
          }
          return post;
        });
        await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
      }
    } catch (error) {
      console.warn('Post sync quantum disruption:', error);
    }
  };
};

export default function ProfileScreen({ navigation }) {
  // 🌟 QUANTUM STATE ENTANGLEMENT
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
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
  });
  
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [imageUploading, setImageUploading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  // 🌀 QUANTUM SYSTEMS
  const { keyboardHeight, isKeyboardVisible } = useQuantumKeyboard();
  useQuantumSync(profile, user);

  // ✨ QUANTUM ANIMATIONS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const quantumGlow = useRef(new Animated.Value(0)).current;

  // 🎯 QUANTUM INPUT REFS
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const companyRef = useRef(null);
  const websiteRef = useRef(null);
  const bioRef = useRef(null);

  // 🎪 INTELLIGENT NAVIGATION SYSTEM
  const NavigationTabs = () => (
    <View style={[styles.navTabs, isKeyboardVisible && styles.navTabsHidden]}>
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
        
        // Initialize profile with user data
        if (!profileData) {
          setProfile(prev => ({
            ...prev,
            firstName: userObj.firstName || '',
            lastName: userObj.lastName || '',
            userType: userObj.role?.toLowerCase() || 'skilled'
          }));
        }
      }
      
      if (profileData) {
        setProfile(prev => ({ ...prev, ...JSON.parse(profileData) }));
      }
    } catch (error) {
      console.warn('Quantum data loading failed:', error);
    }
  };

  // 💾 QUANTUM AUTO-SAVE WITH REAL-TIME SYNC
  const quantumAutoSave = useCallback((field, value) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        [field]: value,
        lastUpdated: new Date().toISOString()
      };
      
      // Real-time persistence with quantum sync
      AsyncStorage.setItem('quantumProfile', JSON.stringify(newProfile));
      
      // Immediate global sync
      syncProfileToGlobalUser(newProfile);
      
      return newProfile;
    });
  }, []);

  const syncProfileToGlobalUser = async (profileData) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const userObj = JSON.parse(userData);
        const updatedUser = {
          ...userObj,
          firstName: profileData.firstName || userObj.firstName,
          lastName: profileData.lastName || userObj.lastName,
          profileImage: profileData.profileImage || userObj.profileImage,
          lastSynced: new Date().toISOString()
        };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.warn('Quantum global sync disruption:', error);
    }
  };

  // ⌨️ QUANTUM KEYBOARD INTELLIGENCE SYSTEM
  const handleInputSubmit = (nextRef) => {
    if (nextRef && nextRef.current) {
      nextRef.current.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  const QuantumInput = ({ 
    ref, 
    value, 
    onChangeText, 
    placeholder, 
    onSubmitEditing, 
    returnKeyType = 'next',
    ...props 
  }) => (
    <TextInput
      ref={ref}
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#666"
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType}
      blurOnSubmit={returnKeyType === 'done'}
      {...props}
    />
  );

  // 📸 QUANTUM IMAGE UPLOAD
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

  // 🗺️ QUANTUM LOCATION SYSTEM
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
      
      quantumAutoSave('location', quantumLocation);
      Alert.alert('Quantum Location Set', 'Spatial coordinates entangled successfully');
    } catch (error) {
      console.warn('Quantum location acquisition failed:', error);
      Alert.alert('Spatial Anomaly', 'Quantum field disruption detected');
    }
  };

  // 🛠️ QUANTUM SKILL SYSTEM
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
              <QuantumInput
                ref={firstNameRef}
                value={profile.firstName}
                onChangeText={(text) => quantumAutoSave('firstName', text)}
                placeholder="First Name"
                onSubmitEditing={() => handleInputSubmit(lastNameRef)}
                returnKeyType="next"
              />
              <QuantumInput
                ref={lastNameRef}
                value={profile.lastName}
                onChangeText={(text) => quantumAutoSave('lastName', text)}
                placeholder="Last Name"
                onSubmitEditing={() => handleInputSubmit(companyRef)}
                returnKeyType="next"
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

  const BusinessSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Quantum Identity Matrix</Text>
      
      <QuantumInput
        ref={companyRef}
        value={profile.company}
        onChangeText={(text) => quantumAutoSave('company', text)}
        placeholder="Quantum Entity Name (Optional)"
        editable={editing}
        onSubmitEditing={() => handleInputSubmit(websiteRef)}
        returnKeyType="next"
      />
      
      <QuantumInput
        ref={websiteRef}
        value={profile.website}
        onChangeText={(text) => quantumAutoSave('website', text)}
        placeholder="Quantum Web Portal (Optional)"
        editable={editing}
        keyboardType="url"
        onSubmitEditing={() => handleInputSubmit(bioRef)}
        returnKeyType="next"
      />
      
      <TextInput
        ref={bioRef}
        style={[styles.input, styles.textArea]}
        value={profile.bio}
        onChangeText={(text) => quantumAutoSave('bio', text)}
        placeholder="Quantum Bio & Service Description"
        editable={editing}
        multiline
        numberOfLines={4}
        placeholderTextColor="#666"
        onSubmitEditing={() => Keyboard.dismiss()}
        returnKeyType="done"
        blurOnSubmit={true}
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.scrollContainer}>
            <ProfileHeader />
            
            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: keyboardHeight + 20 }
              ]}
            >
              <BusinessSection />
              
              {/* Add other sections here (Location, Skills, Portfolio, etc.) */}
              <View style={styles.quantumSaveSection}>
                <Icon name="infinite" size={20} color="#00f0a8" />
                <Text style={styles.quantumSaveText}>
                  Quantum Auto-Save Active • Real-time sync across all dimensions
                </Text>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <NavigationTabs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.1)',
  },
  sectionTitle: {
    color: '#00f0a8',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
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
});