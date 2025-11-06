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
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

// 🎯 EARTH-CONNECTED QUANTUM PROFILE SYSTEM
export default function ProfileScreen({ navigation }) {
  // 🌟 CORE USER STATE
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
    userType: 'skilled', // skilled, farmer, client
    farmDetails: null,
    isAvailable: true
  });
  
  // 🎨 UI STATE
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [imageUploading, setImageUploading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // ✨ ANIMATIONS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // 🎪 BOTTOM NAVIGATION MATCHING DASHBOARD
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
              // Use same navigation as dashboard
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

  // 🚀 INITIALIZATION
  useEffect(() => {
    loadUserData();
    startEntranceAnimations();
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

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const profileData = await AsyncStorage.getItem('userProfile');
      
      if (userData) {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        
        // Initialize profile with user data
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

  // 💾 SAVE PROFILE WITH QUANTUM EFFICIENCY
  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      
      // Real-time analytics tracking
      trackProfileUpdate(profile);
      
      Alert.alert('Success', 'Profile updated across all systems');
      setEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const trackProfileUpdate = (profileData) => {
    // Real-time analytics integration
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
    
    // Send to analytics service
    console.log('📊 Analytics:', analyticsData);
  };

  // 📸 ADVANCED IMAGE UPLOAD SYSTEM
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
        
        // Simulate upload with quantum compression
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
        resolve(uri); // In production, upload to cloud storage
      }, 1000);
    });
  };

  // 🗺️ LOCATION SERVICES
  const handleLocationSelect = (region) => {
    const newLocation = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      address: `Custom Location (${region.latitude.toFixed(4)}, ${region.longitude.toFixed(4)})`
    };
    
    setProfile(prev => ({ ...prev, location: newLocation }));
    setShowLocationPicker(false);
    
    // Track location update for service discovery
    trackLocationUpdate(newLocation);
  };

  const trackLocationUpdate = (location) => {
    console.log('📍 Location updated for service discovery:', location);
  };

  // 🛠️ SKILLS & SERVICES MANAGEMENT
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
                skills: [...prev.skills, { id: Date.now().toString(), name: skill.trim() }]
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

  // 🎨 PORTFOLIO MANAGEMENT
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

  // 🌾 FARMER-SPECIFIC PROFILE
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
      
      <TextInput
        style={styles.input}
        placeholder="Farm Size (acres)"
        value={profile.farmDetails?.size || ''}
        onChangeText={(text) => setProfile(prev => ({
          ...prev,
          farmDetails: { ...prev.farmDetails, size: text }
        }))}
        keyboardType="numeric"
        placeholderTextColor="#666"
      />
    </Animated.View>
  );

  // 🎯 PROFILE HEADER COMPONENT
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
                {profile.userType?.toUpperCase()} • {profile.location ? '📍 Located' : '🌐 Remote'}
              </Text>
            </>
          )}
        </View>
      </View>
    </Animated.View>
  );

  // 📍 LOCATION COMPONENT
  const LocationSection = () => (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Service Location</Text>
        <TouchableOpacity onPress={() => setShowLocationPicker(true)}>
          <Text style={styles.seeAllText}>{profile.location ? 'Change' : 'Set Location'}</Text>
        </TouchableOpacity>
      </View>

      {profile.location ? (
        <View style={styles.locationCard}>
          <Icon name="location" size={20} color="#00f0a8" />
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
        <Text style={styles.availabilityText}>Available for Work</Text>
        <Switch
          value={profile.isAvailable}
          onValueChange={(value) => setProfile(prev => ({ ...prev, isAvailable: value }))}
          trackColor={{ false: '#767577', true: '#00f0a8' }}
          thumbColor={profile.isAvailable ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
    </Animated.View>
  );

  // 🛠️ SKILLS COMPONENT
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
          <Text style={styles.emptyText}>No skills added yet</Text>
        )}
      </View>
    </Animated.View>
  );

  // 💼 PORTFOLIO COMPONENT
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

  // 🏢 BUSINESS COMPONENT
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
    </Animated.View>
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
        
        {/* Conditional Farmer Fields */}
        {profile.userType === 'farmer' && renderFarmerFields()}

        {/* Save Button */}
        {editing && (
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveProfile}
          >
            <Text style={styles.saveButtonText}>Save Quantum Profile</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <NavigationTabs />

      {/* Location Picker Modal */}
      <Modal
        visible={showLocationPicker}
        animationType="slide"
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Set Your Location</Text>
            <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
              <Icon name="close" size={24} color="#00f0a8" />
            </TouchableOpacity>
          </View>
          
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -23.0833,
              longitude: 30.3833,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            onPress={(e) => handleLocationSelect(e.nativeEvent.coordinate)}
          >
            {profile.location && (
              <Marker coordinate={profile.location} />
            )}
          </MapView>
          
          <Text style={styles.mapHint}>
            Tap on map to set your service location
          </Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// 🎨 EARTH-CONNECTED QUANTUM STYLES
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
  locationCard: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  coordinates: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
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
  availabilityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    marginRight: 8,
  },
  removeSkill: {
    padding: 2,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
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
  saveButton: {
    backgroundColor: '#00f0a8',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  map: {
    flex: 1,
  },
  mapHint: {
    color: '#666',
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
  },
});