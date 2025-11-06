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
  Switch
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAPI } from "../api";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
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
    farmDetails: null,
    isAvailable: true
  });
  
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [imageUploading, setImageUploading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
      Animated.timing(scaleAnim, { 
        toValue: 1, 
        duration: 700, 
        useNativeDriver: true 
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
      const userData = await AsyncStorage.getItem('user');
      const profileData = await AsyncStorage.getItem('userProfile');
      
      if (userData) {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        
        setProfile(prev => ({
          ...prev,
          firstName: userObj.firstName || '',
          lastName: userObj.lastName || '',
          userType: userObj.role?.toLowerCase() || 'skilled'
        }));
      }
      
      if (profileData) {
        setProfile(prev => ({ ...prev, ...JSON.parse(profileData) }));
      }
    } catch (error) {
      console.warn('Profile data loading failed:', error);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      
      trackProfileUpdate(profile);
      
      Alert.alert('Success', 'Profile updated across all systems');
      setEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const trackProfileUpdate = (profileData) => {
    const analyticsData = {
      userId: user?.id,
      updateType: 'profile',
      timestamp: new Date().toISOString(),
      fieldsUpdated: Object.keys(profileData).filter(key => 
        profileData[key] !== null && profileData[key] !== ''
      ),
      userType: profileData.userType,
      hasLocation: !!profileData.location,
      portfolioItems: profileData.portfolio?.length || 0,
      skillsCount: profileData.skills?.length || 0
    };
    
    console.log('Analytics:', analyticsData);
  };

  const uploadProfileImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        Alert.alert('Permission required', 'Need camera roll access');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUploading(true);
        
        const imageUrl = await simulateQuantumUpload(result.assets[0].uri);
        
        setProfile(prev => ({ ...prev, profileImage: imageUrl }));
        setImageUploading(false);
        
        Vibration.vibrate(50);
      }
    } catch (error) {
      setImageUploading(false);
      Alert.alert('Upload Failed', 'Please try another image');
    }
  };

  const simulateQuantumUpload = async (uri) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(uri);
      }, 1000);
    });
  };

  const getCurrentLocation = async () => {
    try {
      if (!locationPermission) {
        Alert.alert('Location Access', 'Please enable location permissions in settings');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      
      const address = await getAddressFromCoords(latitude, longitude);
      
      const newLocation = {
        latitude,
        longitude,
        address: address || `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
      };
      
      setProfile(prev => ({ ...prev, location: newLocation }));
      trackLocationUpdate(newLocation);
      
      Alert.alert('Location Set', 'Your service location has been updated');
    } catch (error) {
      console.warn('Location fetch failed:', error);
      Alert.alert('Location Error', 'Could not get your current location');
    }
  };

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.address) {
        const { road, suburb, city, state, country } = data.address;
        return [road, suburb, city, state, country].filter(Boolean).join(', ');
      }
    } catch (error) {
      console.warn('Geocoding failed:', error);
    }
    return null;
  };

  const handleManualLocation = () => {
    Alert.prompt(
      'Set Location Manually',
      'Enter your service location:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Set Location', 
          onPress: (address) => {
            if (address && address.trim()) {
              const manualLocation = {
                latitude: -23.0833 + (Math.random() - 0.5) * 0.1,
                longitude: 30.3833 + (Math.random() - 0.5) * 0.1,
                address: address.trim()
              };
              setProfile(prev => ({ ...prev, location: manualLocation }));
              trackLocationUpdate(manualLocation);
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const trackLocationUpdate = (location) => {
    console.log('Location updated for service discovery:', location);
  };

  const addSkill = () => {
    Alert.prompt(
      'Add Skill',
      'Enter your skill or expertise:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: (skill) => {
            if (skill && skill.trim()) {
              setProfile(prev => ({
                ...prev,
                skills: [...prev.skills, { 
                  id: Date.now().toString(), 
                  name: skill.trim(),
                  category: 'general'
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

  const addPortfolioItem = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets) {
        const newItems = result.assets.map(asset => ({
          id: Date.now().toString() + Math.random(),
          uri: asset.uri,
          description: '',
          timestamp: new Date().toISOString()
        }));

        setProfile(prev => ({
          ...prev,
          portfolio: [...prev.portfolio, ...newItems]
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add portfolio items');
    }
  };

  const renderFarmerFields = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Farm Details</Text>
      
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
        <TouchableOpacity onPress={uploadProfileImage}>
          <View style={styles.avatarContainer}>
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
                <ActivityIndicator color="#00f0a8" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          {editing ? (
            <>
              <TextInput
                style={styles.nameInput}
                value={profile.firstName}
                onChangeText={(text) => setProfile(prev => ({ ...prev, firstName: text }))}
                placeholder="First Name"
                placeholderTextColor="#666"
              />
              <TextInput
                style={styles.nameInput}
                value={profile.lastName}
                onChangeText={(text) => setProfile(prev => ({ ...prev, lastName: text }))}
                placeholder="Last Name"
                placeholderTextColor="#666"
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
                {profile.location ? ' Located' : ' Remote'}
              </Text>
              <Text style={styles.userStats}>
                <Icon name="hammer" size={12} color="#666" /> {profile.skills.length} skills 
                <Icon name="images" size={12} color="#666" /> {profile.portfolio.length} portfolio items
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
        <Text style={styles.sectionTitle}>Service Location</Text>
        {editing && (
          <TouchableOpacity onPress={() => setShowLocationPicker(true)}>
            <Text style={styles.seeAllText}>{profile.location ? 'Change' : 'Set Location'}</Text>
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
            {profile.location.latitude.toFixed(4)}, {profile.location.longitude.toFixed(4)}
          </Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.addLocationButton}
          onPress={() => setShowLocationPicker(true)}
        >
          <Icon name="add-circle" size={24} color="#00f0a8" />
          <Text style={styles.addLocationText}>Add Your Service Location</Text>
        </TouchableOpacity>
      )}

      <View style={styles.availability}>
        <View style={styles.availabilityInfo}>
          <Icon name="business" size={18} color="#fff" />
          <Text style={styles.availabilityText}>Available for Work</Text>
        </View>
        <Switch
          value={profile.isAvailable}
          onValueChange={(value) => setProfile(prev => ({ ...prev, isAvailable: value }))}
          trackColor={{ false: '#767577', true: '#00f0a8' }}
          thumbColor={profile.isAvailable ? '#f4f3f4' : '#f4f3f4'}
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
            <Text style={styles.emptyText}>No skills added yet. Add your expertise!</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const PortfolioSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Work Portfolio</Text>
        {editing && (
          <TouchableOpacity onPress={addPortfolioItem}>
            <Text style={styles.seeAllText}>Add Items</Text>
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
              onPress={addPortfolioItem}
            >
              <Icon name="add" size={40} color="#00f0a8" />
              <Text style={styles.addPortfolioText}>Add Photos</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );

  const BusinessSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>Business Information</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Company Name (Optional)"
        value={profile.company}
        onChangeText={(text) => setProfile(prev => ({ ...prev, company: text }))}
        editable={editing}
        placeholderTextColor="#666"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Website URL (Optional)"
        value={profile.website}
        onChangeText={(text) => setProfile(prev => ({ ...prev, website: text }))}
        editable={editing}
        placeholderTextColor="#666"
        keyboardType="url"
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Bio & Service Description"
        value={profile.bio}
        onChangeText={(text) => setProfile(prev => ({ ...prev, bio: text }))}
        editable={editing}
        multiline
        numberOfLines={4}
        placeholderTextColor="#666"
      />

      <View style={styles.userTypeSection}>
        <Text style={styles.userTypeLabel}>I am a:</Text>
        <View style={styles.userTypeOptions}>
          {['skilled', 'farmer', 'client'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.userTypeOption,
                profile.userType === type && styles.userTypeOptionActive
              ]}
              onPress={() => setProfile(prev => ({ ...prev, userType: type }))}
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
          <Text style={styles.modalTitle}>Set Service Location</Text>
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
            <Text style={styles.locationOptionTitle}>Use Current Location</Text>
            <Text style={styles.locationOptionDesc}>
              Automatically detect your location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.locationOption}
            onPress={handleManualLocation}
          >
            <Icon name="pencil" size={32} color="#00f0a8" />
            <Text style={styles.locationOptionTitle}>Enter Address</Text>
            <Text style={styles.locationOptionDesc}>
              Type your service location
            </Text>
          </TouchableOpacity>

          {profile.location && (
            <TouchableOpacity 
              style={[styles.locationOption, styles.removeLocationOption]}
              onPress={() => {
                setProfile(prev => ({ ...prev, location: null }));
                setShowLocationPicker(false);
              }}
            >
              <Icon name="trash" size={32} color="#ff6b6b" />
              <Text style={[styles.locationOptionTitle, styles.removeLocationText]}>
                Remove Location
              </Text>
              <Text style={styles.locationOptionDesc}>
                Clear your service location
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.locationHint}>
          Setting your location helps clients find your services in their area
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
      >
        <BusinessSection />
        <LocationSection />
        <SkillsSection />
        <PortfolioSection />
        
        {profile.userType === 'farmer' && renderFarmerFields()}

        {editing && (
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveProfile}
          >
            <Icon name="save" size={24} color="#000" />
            <Text style={styles.saveButtonText}>Save Quantum Profile</Text>
          </TouchableOpacity>
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
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00f0a8',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 18,
    borderRadius: 14,
    shadowColor: '#00f0a8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 8,
  },
  navTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 10,
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
});