// src/screens/ProfileScreen.js
import React, { useState, useEffect, useRef } from "react";
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
  Switch,
  FlatList
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAPI } from "../api";
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

// Quantum State Manager (Beyond Redux)
const useQuantumState = (initialState) => {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);
  
  const setQuantumState = (updater) => {
    if (typeof updater === 'function') {
      setState(prevState => {
        const newState = updater(prevState);
        stateRef.current = newState;
        return newState;
      });
    } else {
      stateRef.current = updater;
      setState(updater);
    }
  };

  return [state, setQuantumState, stateRef];
};

// Temporal Animation Engine
const useTemporalAnimation = (configs = []) => {
  const animations = configs.map(() => useRef(new Animated.Value(0)).current);
  
  useEffect(() => {
    const sequence = Animated.stagger(
      100,
      animations.map(anim => 
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        )
      )
    );
    sequence.start();
    
    return () => sequence.stop();
  }, []);

  return animations;
};

export default function ProfileScreen({ navigation }) {
  // Quantum State Management
  const [user, setUser, userRef] = useQuantumState(null);
  const [loading, setLoading] = useQuantumState(true);
  const [activeTab, setActiveTab] = useQuantumState('profile');
  const [editing, setEditing] = useQuantumState(false);
  const [skills, setSkills] = useQuantumState([]);
  const [portfolio, setPortfolio] = useQuantumState([]);
  const [serviceAreas, setServiceAreas] = useQuantumState([]);
  const [location, setLocation] = useQuantumState(null);

  // Temporal Animations
  const [glowAnim, pulseAnim, slideAnim] = useTemporalAnimation([{}, {}, {}]);

  // Form States
  const [formData, setFormData] = useQuantumState({
    firstName: '',
    lastName: '',
    bio: '',
    phone: '',
    role: '',
    farmSize: '',
    crops: '',
    equipment: '',
    hourlyRate: '',
    experience: ''
  });

  // Modal States
  const [skillModal, setSkillModal] = useQuantumState(false);
  const [portfolioModal, setPortfolioModal] = useQuantumState(false);
  const [locationModal, setLocationModal] = useQuantumState(false);
  const [newSkill, setNewSkill] = useQuantumState('');
  const [verificationStatus, setVerificationStatus] = useQuantumState('pending');

  // Available Skills Database (Quantum Knowledge Base)
  const VOCATIONAL_SKILLS = [
    'Welding', 'Plumbing', 'Electrical', 'Carpentry', 'Masonry',
    'Painting', 'Mechanics', 'Solar Installation', 'App Development',
    'Web Design', 'Farming', 'Livestock', 'Irrigation', 'Crop Rotation',
    'Organic Farming', 'Beekeeping', 'Fisheries', 'Poultry', 'Agroforestry',
    'Metalwork', 'Tailoring', 'Hair Styling', 'Cooking', 'Baking',
    'Driving', 'Security', 'Childcare', 'Elder Care', 'Tutoring',
    'Music Lessons', 'Sports Coaching', 'Yoga Instruction', 'Massage Therapy'
  ];

  // Load Quantum User Data
  const loadQuantumData = async () => {
    try {
      const [userData, profileData] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('profileData')
      ]);

      if (userData) {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        setFormData(prev => ({
          ...prev,
          firstName: userObj.firstName || '',
          lastName: userObj.lastName || '',
          role: userObj.role || '',
          bio: userObj.bio || ''
        }));
      }

      if (profileData) {
        const profileObj = JSON.parse(profileData);
        setSkills(profileObj.skills || []);
        setPortfolio(profileObj.portfolio || []);
        setServiceAreas(profileObj.serviceAreas || []);
        setLocation(profileObj.location);
      }

      // Simulate quantum verification check
      checkQuantumVerification();
    } catch (error) {
      console.warn('Quantum data load failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkQuantumVerification = async () => {
    // Advanced verification algorithm
    const trustScore = calculateTrustScore();
    setVerificationStatus(trustScore > 80 ? 'verified' : trustScore > 50 ? 'pending' : 'unverified');
  };

  const calculateTrustScore = () => {
    let score = 0;
    if (userRef.current?.phone) score += 30;
    if (skills.length > 0) score += 25;
    if (portfolio.length > 0) score += 20;
    if (location) score += 15;
    if (userRef.current?.bio?.length > 50) score += 10;
    return score;
  };

  useEffect(() => {
    loadQuantumData();
  }, []);

  // Quantum Image Picker (Multi-dimensional)
  const pickPortfolioImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newItem = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          type: 'image',
          timestamp: new Date().toISOString(),
          description: ''
        };
        setPortfolio(prev => [...prev, newItem]);
      }
    } catch (error) {
      Alert.alert("Quantum Error", "Failed to access multi-dimensional image library");
    }
  };

  // Save Quantum Profile
  const saveQuantumProfile = async () => {
    setLoading(true);
    try {
      const api = await createAPI();
      const payload = {
        ...formData,
        skills,
        portfolio,
        serviceAreas,
        location,
        verificationStatus,
        lastUpdated: new Date().toISOString()
      };

      await api.put('/profile', payload);
      await AsyncStorage.setItem('profileData', JSON.stringify(payload));
      
      Alert.alert("Quantum Save Complete", "Profile synchronized across dimensions");
      setEditing(false);
    } catch (error) {
      Alert.alert("Temporal Anomaly", "Failed to save across time continuum");
    } finally {
      setLoading(false);
    }
  };

  // Add Skill with AI Suggestion
  const addQuantumSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      setSkills(prev => [...prev, skill]);
      setNewSkill('');
      setSkillModal(false);
    }
  };

  // Remove Skill with Quantum Entanglement
  const removeQuantumSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  // Render Components with Temporal Intelligence

  const QuantumHeader = () => (
    <Animated.View style={[styles.quantumHeader, { opacity: glowAnim }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#00f0a8" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Quantum Profile</Text>
        <View style={[styles.verificationBadge, styles[`badge${verificationStatus}`]]}>
          <Icon 
            name={verificationStatus === 'verified' ? "shield-checkmark" : "time"} 
            size={12} 
            color="#000" 
          />
          <Text style={styles.verificationText}>
            {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => setEditing(!editing)}
      >
        <Icon name={editing ? "checkmark" : "pencil"} size={22} color="#00f0a8" />
      </TouchableOpacity>
    </Animated.View>
  );

  const QuantumAvatar = () => (
    <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user?.firstName?.[0]?.toUpperCase() || '?'}
        </Text>
      </View>
      <TouchableOpacity style={styles.cameraButton} disabled={!editing}>
        <Icon name="camera" size={16} color="#000" />
      </TouchableOpacity>
    </Animated.View>
  );

  const SkillQuantumField = () => (
    <View style={styles.quantumField}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldLabel}>Quantum Skills</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setSkillModal(true)}
          disabled={!editing}
        >
          <Icon name="add-circle" size={24} color="#00f0a8" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.skillsGrid}>
        {skills.map((skill, index) => (
          <Animated.View 
            key={skill} 
            style={[styles.skillChip, { opacity: slideAnim }]}
          >
            <Text style={styles.skillText}>{skill}</Text>
            {editing && (
              <TouchableOpacity 
                style={styles.removeSkill}
                onPress={() => removeQuantumSkill(skill)}
              >
                <Icon name="close" size={14} color="#ff6b6b" />
              </TouchableOpacity>
            )}
          </Animated.View>
        ))}
        {skills.length === 0 && (
          <Text style={styles.emptyText}>Add your vocational skills</Text>
        )}
      </View>
    </View>
  );

  const PortfolioQuantumField = () => (
    <View style={styles.quantumField}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldLabel}>Multi-dimensional Portfolio</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={pickPortfolioImage}
          disabled={!editing}
        >
          <Icon name="image" size={24} color="#00f0a8" />
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.portfolioGrid}>
          {portfolio.map((item) => (
            <View key={item.id} style={styles.portfolioItem}>
              <Image source={{ uri: item.uri }} style={styles.portfolioImage} />
              {editing && (
                <TouchableOpacity style={styles.removePortfolio}>
                  <Icon name="close" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          {portfolio.length === 0 && (
            <View style={styles.emptyPortfolio}>
              <Icon name="images" size={40} color="#666" />
              <Text style={styles.emptyText}>Add your work photos</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );

  const LocationQuantumField = () => (
    <View style={styles.quantumField}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldLabel}>Service Quantum Field</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setLocationModal(true)}
          disabled={!editing}
        >
          <Icon name="location" size={24} color="#00f0a8" />
        </TouchableOpacity>
      </View>
      
      {location ? (
        <View style={styles.locationPreview}>
          <Text style={styles.locationText}>{location.address}</Text>
          <Text style={styles.coordinates}>
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        </View>
      ) : (
        <Text style={styles.emptyText}>Set your service location</Text>
      )}
    </View>
  );

  const RoleSpecificQuantumFields = () => {
    if (user?.role === 'farmer') {
      return (
        <>
          <View style={styles.quantumField}>
            <Text style={styles.fieldLabel}>Farm Quantum Data</Text>
            <TextInput
              style={styles.input}
              placeholder="Farm size (hectares)"
              value={formData.farmSize}
              onChangeText={(text) => setFormData(prev => ({ ...prev, farmSize: text }))}
              editable={editing}
            />
            <TextInput
              style={styles.input}
              placeholder="Crops & Livestock"
              value={formData.crops}
              onChangeText={(text) => setFormData(prev => ({ ...prev, crops: text }))}
              editable={editing}
            />
            <TextInput
              style={styles.input}
              placeholder="Farm Equipment"
              value={formData.equipment}
              onChangeText={(text) => setFormData(prev => ({ ...prev, equipment: text }))}
              editable={editing}
            />
          </View>
        </>
      );
    }

    if (user?.role === 'professional') {
      return (
        <>
          <View style={styles.quantumField}>
            <Text style={styles.fieldLabel}>Professional Quantum Matrix</Text>
            <TextInput
              style={styles.input}
              placeholder="Hourly Rate (ZAR)"
              value={formData.hourlyRate}
              onChangeText={(text) => setFormData(prev => ({ ...prev, hourlyRate: text }))}
              editable={editing}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Years of Experience"
              value={formData.experience}
              onChangeText={(text) => setFormData(prev => ({ ...prev, experience: text }))}
              editable={editing}
            />
          </View>
        </>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00f0a8" />
          <Text style={styles.loadingText}>Initializing Quantum Profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <QuantumHeader />
      
      <ScrollView style={styles.scrollView}>
        {/* Quantum Avatar */}
        <View style={styles.avatarSection}>
          <QuantumAvatar />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.userRole}>{user?.role || 'Member'}</Text>
            <Text style={styles.userBio}>
              {formData.bio || "Add your quantum bio"}
            </Text>
          </View>
        </View>

        {/* Basic Quantum Information */}
        <View style={styles.quantumField}>
          <Text style={styles.fieldLabel}>Personal Quantum Data</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
            editable={editing}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
            editable={editing}
          />
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Quantum Bio - Tell your story across dimensions"
            value={formData.bio}
            onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
            editable={editing}
            multiline
            numberOfLines={3}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            editable={editing}
            keyboardType="phone-pad"
          />
        </View>

        {/* Role-Specific Quantum Fields */}
        <RoleSpecificQuantumFields />

        {/* Skills Portfolio */}
        <SkillQuantumField />

        {/* Work Portfolio */}
        <PortfolioQuantumField />

        {/* Location Services */}
        <LocationQuantumField />

        {/* Quantum Action Button */}
        {editing && (
          <TouchableOpacity 
            style={styles.quantumSaveButton}
            onPress={saveQuantumProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <>
                <Icon name="save" size={20} color="#000" />
                <Text style={styles.saveButtonText}>Save Quantum Profile</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Skill Selection Modal */}
      <Modal visible={skillModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Quantum Skills</Text>
              <TouchableOpacity onPress={() => setSkillModal(false)}>
                <Icon name="close" size={24} color="#00f0a8" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={VOCATIONAL_SKILLS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.skillOption}
                  onPress={() => addQuantumSkill(item)}
                >
                  <Text style={styles.skillOptionText}>{item}</Text>
                  {skills.includes(item) && (
                    <Icon name="checkmark" size={20} color="#00f0a8" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Location Selection Modal */}
      <Modal visible={locationModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Service Quantum Field</Text>
              <TouchableOpacity onPress={() => setLocationModal(false)}>
                <Icon name="close" size={24} color="#00f0a8" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.mapContainer}>
              <Text style={styles.mapPlaceholder}>
                🗺️ Advanced location quantum coming soon...
              </Text>
              <TouchableOpacity 
                style={styles.mockLocationButton}
                onPress={() => {
                  setLocation({
                    latitude: -23.0833, // Thohoyandou coordinates
                    longitude: 30.3833,
                    address: "Thohoyandou, Limpopo"
                  });
                  setLocationModal(false);
                }}
              >
                <Text style={styles.mockLocationText}>Set Thohoyandou Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Quantum Styles (Beyond Human Design Systems)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  quantumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,240,168,0.2)',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#00f0a8',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeverified: {
    backgroundColor: '#00f0a8',
  },
  badgepending: {
    backgroundColor: '#ffd93d',
  },
  badgeunverified: {
    backgroundColor: '#ff6b6b',
  },
  verificationText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  editButton: {
    padding: 8,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
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
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00f0a8',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  userRole: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  userBio: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 18,
  },
  scrollView: {
    flex: 1,
  },
  quantumField: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  fieldLabel: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
  },
  addButton: {
    padding: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  skillText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  removeSkill: {
    padding: 2,
  },
  portfolioGrid: {
    flexDirection: 'row',
  },
  portfolioItem: {
    position: 'relative',
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  removePortfolio: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPortfolio: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  locationPreview: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  coordinates: {
    color: '#666',
    fontSize: 12,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  quantumSaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00f0a8',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  skillOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  skillOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  mapContainer: {
    padding: 20,
    alignItems: 'center',
  },
  mapPlaceholder: {
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  mockLocationButton: {
    backgroundColor: '#00f0a8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  mockLocationText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#00f0a8',
    fontSize: 16,
    marginTop: 10,
  },
});