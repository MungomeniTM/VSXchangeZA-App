// src/screens/AdvancedProfessionalProfileScreen.js - REAL-TIME ENTERPRISE PROFILE
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
  KeyboardAvoidingView
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { AppContext } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// REAL-TIME ENTERPRISE STATE MANAGEMENT
const useRealTimeProfile = () => {
  const [profile, setProfile] = useState({
    id: 'user_001',
    firstName: 'James',
    lastName: 'Carter',
    displayName: 'James Carter',
    profession: 'Best Electrician',
    userType: 'skilled', // 'skilled', 'farmer', 'client'
    profileImage: null,
    bio: 'James Carter is a certified electrician with 8 years of experience. He specializes in residential and commercial wiring, completing numerous projects from home rewiring to large-scale commercial installations.',
    experienceYears: 8,
    rating: 4.9,
    completedProjects: 150,
    location: null,
    contactInfo: {
      phone: '+1 (555) 123-4567',
      email: 'james.carter@example.com'
    },
    // Dynamic skills based on user type
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
    // Professional services
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
    // Portfolio with real images
    portfolio: [],
    // Certifications and credentials
    certifications: [
      {
        id: 'cert_1',
        name: 'Certified Electrician',
        issuer: 'National Electrical Association',
        year: 2016,
        verified: true
      }
    ],
    // Availability schedule
    availability: {
      monday: { available: true, start: '09:00', end: '18:00' },
      tuesday: { available: true, start: '09:00', end: '18:00' },
      wednesday: { available: true, start: '09:00', end: '18:00' },
      thursday: { available: true, start: '09:00', end: '18:00' },
      friday: { available: true, start: '09:00', end: '17:00' },
      saturday: { available: false, start: '00:00', end: '00:00' },
      sunday: { available: false, start: '00:00', end: '00:00' }
    },
    // Farmer-specific fields
    farmDetails: {
      farmName: '',
      farmSize: 0, // hectares
      mainCrops: [],
      farmType: '', // dairy, crop, poultry, etc.
      equipment: [],
      livestock: [],
      certifications: [],
      irrigationSystems: [],
      soilType: ''
    },
    // Client-specific fields
    clientDetails: {
      companyName: '',
      industry: '',
      projectTypes: [],
      budgetRange: { min: 0, max: 0 },
      timeline: '',
      serviceNeeds: []
    },
    // Real-time status
    isAvailable: true,
    lastUpdated: new Date().toISOString(),
    profileCompleteness: 85
  });

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [saving, setSaving] = useState(false);

  // Real-time update function
  const updateProfile = useCallback((updates) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setProfile(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
      displayName: `${updates.firstName || prev.firstName} ${updates.lastName || prev.lastName}`.trim()
    }));
  }, []);

  // Update nested objects
  const updateFarmDetails = useCallback((updates) => {
    setProfile(prev => ({
      ...prev,
      farmDetails: { ...prev.farmDetails, ...updates },
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const updateClientDetails = useCallback((updates) => {
    setProfile(prev => ({
      ...prev,
      clientDetails: { ...prev.clientDetails, ...updates },
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const updateContactInfo = useCallback((updates) => {
    setProfile(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, ...updates },
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Skill management
  const addSkill = useCallback((skill) => {
    const newSkill = {
      id: `skill_${Date.now()}`,
      added: new Date().toISOString(),
      ...skill
    };
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const removeSkill = useCallback((skillId) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== skillId),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Service management
  const addService = useCallback((service) => {
    const newService = {
      id: `service_${Date.now()}`,
      ...service
    };
    setProfile(prev => ({
      ...prev,
      services: [...prev.services, newService],
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const updateService = useCallback((serviceId, updates) => {
    setProfile(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === serviceId ? { ...service, ...updates } : service
      ),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Portfolio management
  const addPortfolioItem = useCallback((item) => {
    const newItem = {
      id: `portfolio_${Date.now()}`,
      uploaded: new Date().toISOString(),
      ...item
    };
    setProfile(prev => ({
      ...prev,
      portfolio: [...prev.portfolio, newItem],
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const removePortfolioItem = useCallback((itemId) => {
    setProfile(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter(item => item.id !== itemId),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Save to backend
  const saveProfile = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to local storage
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      
      // In real app, would save to backend
      console.log('Profile saved:', profile);
      
      setSaving(false);
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      setSaving(false);
      return false;
    }
  };

  return {
    profile,
    editing,
    setEditing,
    activeTab,
    setActiveTab,
    saving,
    updateProfile,
    updateFarmDetails,
    updateClientDetails,
    updateContactInfo,
    addSkill,
    removeSkill,
    addService,
    updateService,
    addPortfolioItem,
    removePortfolioItem,
    saveProfile
  };
};

// INTELLIGENT CATEGORY SYSTEM
const useCategorySystem = (userType) => {
  const skillCategories = {
    skilled: {
      electrical: ['Residential Wiring', 'Commercial Installation', 'Safety Inspection', 'Panel Upgrade', 'Lighting Installation'],
      plumbing: ['Pipe Installation', 'Leak Repair', 'Water Heater', 'Drain Cleaning', 'Fixture Installation'],
      carpentry: ['Framing', 'Finishing', 'Cabinet Making', 'Furniture Building', 'Structural Repair'],
      mechanical: ['Engine Repair', 'Equipment Maintenance', 'Diagnostic', 'Preventive Maintenance', 'Parts Replacement'],
      construction: ['Renovation', 'New Construction', 'Demolition', 'Structural Work', 'Project Management'],
      technology: ['Network Setup', 'Computer Repair', 'Smart Home', 'Security Systems', 'Software Installation']
    },
    farmer: {
      crops: ['Maize/Corn', 'Wheat', 'Soybeans', 'Vegetables', 'Fruits', 'Grains', 'Organic Crops'],
      livestock: ['Cattle', 'Poultry', 'Swine', 'Dairy', 'Sheep/Goats', 'Fish Farming'],
      equipment: ['Tractors', 'Harvesters', 'Irrigation Systems', 'Planters', 'Sprayers', 'Balers'],
      specialties: ['Organic Farming', 'Hydroponics', 'Precision Agriculture', 'Sustainable Farming', 'Greenhouse'],
      skills: ['Soil Analysis', 'Crop Rotation', 'Pest Management', 'Irrigation Management', 'Harvest Planning']
    },
    client: {
      projectTypes: ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Renovation', 'New Construction'],
      serviceNeeds: ['Electrical', 'Plumbing', 'Carpentry', 'Mechanical', 'Construction', 'Technology'],
      timelines: ['Immediate', '1-2 Weeks', '1 Month', '3 Months', '6 Months+'],
      budgets: ['Under $1k', '$1k-$5k', '$5k-$10k', '$10k-$25k', '$25k+']
    }
  };

  const getCategories = useCallback(() => {
    return skillCategories[userType] || {};
  }, [userType]);

  const getSubcategories = useCallback((category) => {
    return skillCategories[userType]?.[category] || [];
  }, [userType]);

  return {
    getCategories,
    getSubcategories,
    skillCategories
  };
};

// REAL-TIME EDITING COMPONENTS
const EditableField = ({ 
  value, 
  onSave, 
  placeholder, 
  multiline = false, 
  style,
  type = 'text',
  options = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <TouchableOpacity 
        style={[styles.viewField, style]}
        onPress={() => setIsEditing(true)}
      >
        <Text style={styles.viewFieldText}>
          {value || placeholder}
        </Text>
        <Icon name="create-outline" size={16} color="#00f0a8" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.editFieldContainer, style]}>
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

// USER TYPE SELECTOR WITH REAL-TIME UPDATES
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
        <View>
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
              <Icon name={userType.icon} size={24} color="#000" />
            </View>
            <Text style={styles.typeOptionTitle}>{userType.title}</Text>
            <Text style={styles.typeOptionDescription}>{userType.description}</Text>
            {currentType === userType.type && (
              <View style={styles.selectedBadge}>
                <Icon name="checkmark" size={16} color="#000" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// DYNAMIC SKILL MANAGER BASED ON USER TYPE
const SkillManager = ({ 
  skills, 
  userType, 
  onAddSkill, 
  onRemoveSkill, 
  editing 
}) => {
  const { getCategories, getSubcategories } = useCategorySystem(userType);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    subcategory: '',
    level: 'intermediate',
    years: 1
  });

  const categories = getCategories();
  const subcategories = newSkill.category ? getSubcategories(newSkill.category) : [];

  const handleAddSkill = () => {
    if (!newSkill.name || !newSkill.category) {
      Alert.alert('Error', 'Please fill in skill name and category');
      return;
    }

    onAddSkill(newSkill);
    setNewSkill({ name: '', category: '', subcategory: '', level: 'intermediate', years: 1 });
    setShowAddSkill(false);
  };

  const SkillChip = ({ skill, onRemove }) => (
    <View style={styles.skillChip}>
      <View style={styles.skillInfo}>
        <Text style={styles.skillName}>{skill.name}</Text>
        <Text style={styles.skillMeta}>
          {skill.category} • {skill.level} • {skill.years} year{skill.years !== 1 ? 's' : ''}
        </Text>
      </View>
      {editing && (
        <TouchableOpacity onPress={onRemove} style={styles.removeSkillButton}>
          <Icon name="close" size={16} color="#ff6b6b" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.skillManager}>
      <View style={styles.skillHeader}>
        <Text style={styles.skillTitle}>
          {userType === 'skilled' && 'Skills & Expertise'}
          {userType === 'farmer' && 'Farm Specialties'}
          {userType === 'client' && 'Service Interests'}
        </Text>
        {editing && (
          <TouchableOpacity 
            style={styles.addSkillButton}
            onPress={() => setShowAddSkill(true)}
          >
            <Icon name="add" size={20} color="#00f0a8" />
            <Text style={styles.addSkillText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.skillsGrid}>
        {skills.map((skill) => (
          <SkillChip 
            key={skill.id} 
            skill={skill} 
            onRemove={() => onRemoveSkill(skill.id)} 
          />
        ))}
        
        {skills.length === 0 && (
          <View style={styles.noSkills}>
            <Icon name="construct-outline" size={32} color="#666" />
            <Text style={styles.noSkillsText}>No skills added yet</Text>
          </View>
        )}
      </View>

      {/* Add Skill Modal */}
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
                  {Object.keys(categories).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        newSkill.category === category && styles.categoryChipSelected
                      ]}
                      onPress={() => setNewSkill(prev => ({ ...prev, category, subcategory: '' }))}
                    >
                      <Text style={styles.categoryChipText}>{category}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {newSkill.category && (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Specialization</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {subcategories.map((subcat) => (
                      <TouchableOpacity
                        key={subcat}
                        style={[
                          styles.subcategoryChip,
                          newSkill.subcategory === subcat && styles.subcategoryChipSelected
                        ]}
                        onPress={() => setNewSkill(prev => ({ ...prev, subcategory: subcat }))}
                      >
                        <Text style={styles.subcategoryChipText}>{subcat}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

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
                      <Text style={styles.levelChipText}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Years of Experience</Text>
                <View style={styles.yearsSelector}>
                  {[1,2,3,5,8,10,15].map((years) => (
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

// FARMER-SPECIFIC COMPONENTS
const FarmerDetailsManager = ({ farmDetails, onUpdate, editing }) => {
  if (!editing) {
    return (
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Farm Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Farm Name</Text>
            <Text style={styles.detailValue}>{farmDetails.farmName || 'Not set'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Farm Size</Text>
            <Text style={styles.detailValue}>{farmDetails.farmSize || 0} hectares</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Farm Type</Text>
            <Text style={styles.detailValue}>{farmDetails.farmType || 'Not specified'}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.detailsSection}>
      <Text style={styles.sectionTitle}>Farm Details</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Farm Name</Text>
        <EditableField
          value={farmDetails.farmName}
          onSave={(value) => onUpdate({ farmName: value })}
          placeholder="Enter farm name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Farm Size (hectares)</Text>
        <EditableField
          value={farmDetails.farmSize?.toString()}
          onSave={(value) => onUpdate({ farmSize: parseFloat(value) || 0 })}
          placeholder="Enter farm size"
          type="number"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Farm Type</Text>
        <EditableField
          value={farmDetails.farmType}
          onSave={(value) => onUpdate({ farmType: value })}
          placeholder="Select farm type"
          type="select"
          options={['Crop Farm', 'Dairy Farm', 'Poultry Farm', 'Mixed Farm', 'Organic Farm', 'Vineyard', 'Orchard']}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Main Crops</Text>
        <Text style={styles.formHelp}>
          Add crops in the Skills section above
        </Text>
      </View>
    </View>
  );
};

// LOCATION MANAGER WITH REAL-TIME UPDATES
const LocationManager = ({ location, onUpdate, editing }) => {
  const [gettingLocation, setGettingLocation] = useState(false);

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const { latitude, longitude } = locationData.coords;
      
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      const readableAddress = address[0] 
        ? `${address[0].name}, ${address[0].city}, ${address[0].region}`
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

  const handleManualLocation = () => {
    Alert.prompt(
      'Enter Location',
      'Type your address or location:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save', 
          onPress: (address) => {
            if (address) {
              onUpdate({
                address: address.trim(),
                latitude: null,
                longitude: null,
                lastUpdated: new Date().toISOString()
              });
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.locationSection}>
      <Text style={styles.sectionTitle}>Location</Text>
      
      {location ? (
        <View style={styles.locationDisplay}>
          <Icon name="location" size={20} color="#00f0a8" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationAddress}>{location.address}</Text>
            {location.latitude && (
              <Text style={styles.locationCoords}>
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </Text>
            )}
          </View>
        </View>
      ) : (
        <Text style={styles.noLocation}>No location set</Text>
      )}

      {editing && (
        <View style={styles.locationActions}>
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

          <TouchableOpacity 
            style={[styles.locationButton, styles.secondaryLocationButton]}
            onPress={handleManualLocation}
          >
            <Icon name="create" size={18} color="#00f0a8" />
            <Text style={styles.secondaryLocationButtonText}>Enter Manually</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// MAIN PROFILE COMPONENT
export default function AdvancedProfessionalProfileScreen({ navigation }) {
  const {
    profile,
    editing,
    setEditing,
    activeTab,
    setActiveTab,
    saving,
    updateProfile,
    updateFarmDetails,
    updateClientDetails,
    updateContactInfo,
    addSkill,
    removeSkill,
    addPortfolioItem,
    removePortfolioItem,
    saveProfile
  } = useRealTimeProfile();

  const { globalUser, updateGlobalUser } = useContext(AppContext);

  // Save profile when editing is turned off
  useEffect(() => {
    if (!editing && profile.lastUpdated) {
      saveProfile();
      // Update global app state
      updateGlobalUser(profile);
    }
  }, [editing, profile.lastUpdated]);

  const handleSave = async () => {
    const success = await saveProfile();
    if (success) {
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const ProfileHeader = () => (
    <LinearGradient colors={['#000', '#1a1a1a']} style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={28} color="#00f0a8" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.editToggle, editing && styles.editToggleActive]}
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
          <TouchableOpacity style={styles.avatarContainer}>
            <Image 
              source={{ uri: profile.profileImage || 'https://via.placeholder.com/120' }}
              style={styles.avatar}
            />
            {editing && (
              <View style={styles.avatarOverlay}>
                <Icon name="camera" size={24} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

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

            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{profile.experienceYears}</Text>
                <Text style={styles.statLabel}>Years</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{profile.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.stat}>
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
          <ScrollView style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Bio</Text>
              <EditableField
                value={profile.bio}
                onSave={(value) => updateProfile({ bio: value })}
                placeholder="Tell us about your professional background and expertise..."
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
              <FarmerDetailsManager
                farmDetails={profile.farmDetails}
                onUpdate={updateFarmDetails}
                editing={editing}
              />
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
            <Text style={styles.sectionTitle}>Portfolio Gallery</Text>
            {/* Portfolio implementation would go here */}
          </View>
        );

      default:
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Text>
            <Text style={styles.comingSoon}>More features coming soon...</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <ProfileHeader />
      
      <View style={styles.tabs}>
        {['about', 'portfolio', 'services', 'reviews'].map((tab) => (
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
      </View>

      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TabContent />
      </KeyboardAvoidingView>

      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="#00f0a8" />
          <Text style={styles.savingText}>Saving Changes...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
  },
  editToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  editToggleActive: {
    backgroundColor: 'rgba(0,240,168,0.2)',
  },
  profileMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00f0a8',
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  nameSection: {
    marginBottom: 15,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
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
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#00f0a8',
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
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
  typeTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  typeDescription: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  userTypeSelector: {
    marginBottom: 20,
  },
  selectorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  typeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeOption: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  typeOptionSelected: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  typeOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  typeOptionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  typeOptionDescription: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 12,
  },
  selectedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#00f0a8',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
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
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  viewFieldText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  editFieldContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
    overflow: 'hidden',
  },
  editField: {
    color: '#fff',
    fontSize: 16,
    padding: 15,
    minHeight: 50,
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
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
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
    marginBottom: 25,
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
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  addSkillText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
    minWidth: 140,
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
    width: '100%',
  },
  noSkillsText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  formHelp: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
  categoryChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  categoryChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderColor: '#00f0a8',
  },
  categoryChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  subcategoryChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  subcategoryChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    borderColor: '#00f0a8',
  },
  subcategoryChipText: {
    color: '#fff',
    fontSize: 10,
  },
  levelOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  levelChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  levelChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderColor: '#00f0a8',
  },
  levelChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  yearsSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  yearChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  yearChipSelected: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderColor: '#00f0a8',
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
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
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
  detailsSection: {
    marginBottom: 25,
  },
  detailsGrid: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  detailLabel: {
    color: '#666',
    fontSize: 14,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  locationSection: {
    marginBottom: 25,
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
    fontWeight: '600',
  },
  locationCoords: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  noLocation: {
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  locationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00f0a8',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  locationButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryLocationButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  secondaryLocationButtonText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  comingSoon: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  savingText: {
    color: '#00f0a8',
    fontSize: 16,
    marginTop: 10,
  },
});
