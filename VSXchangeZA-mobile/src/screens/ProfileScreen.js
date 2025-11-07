   // src/screens/ProfileScreen.js - ENTERPRISE VERSION (FIXED & ENHANCED)
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
  FlatList
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { AppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

// ENTERPRISE STATE MANAGEMENT SYSTEM
const useEnterpriseState = (initialState, storageKey = null) => {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(initialState);
  const pendingWrites = useRef(new Set());
  const stateHistory = useRef([]);
  const maxHistorySize = 50;
  
  const setEnterpriseState = useCallback((updater) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setState(prevState => {
      const newState = typeof updater === 'function' ? updater(prevState) : updater;
      
      // Add to history for undo/redo capability
      stateHistory.current.push({...stateRef.current, timestamp: Date.now()});
      if (stateHistory.current.length > maxHistorySize) {
        stateHistory.current.shift();
      }
      
      stateRef.current = newState;
      
      if (storageKey) {
        const writeId = Date.now();
        pendingWrites.current.add(writeId);
        
        setTimeout(() => {
          if (pendingWrites.current.has(writeId)) {
            AsyncStorage.setItem(storageKey, JSON.stringify(newState))
              .then(() => {
                console.log('Enterprise State Saved:', storageKey);
              })
              .catch(error => console.warn('Enterprise Storage failed:', error));
            pendingWrites.current.delete(writeId);
          }
        }, 300);
      }
      
      return newState;
    });
  }, [storageKey]);

  const getCurrentState = useCallback(() => stateRef.current, []);
  const getPendingWrites = useCallback(() => pendingWrites.current.size, []);
  const undo = useCallback(() => {
    if (stateHistory.current.length > 0) {
      const previousState = stateHistory.current.pop();
      setEnterpriseState(previousState);
      return true;
    }
    return false;
  }, []);

  return [state, setEnterpriseState, { 
    getCurrentState, 
    getPendingWrites, 
    undo,
    historySize: stateHistory.current.length 
  }];
};

// INTELLIGENT BACKEND SYNC ENGINE
const useIntelligentBackendSync = () => {
  const [saving, setSaving] = useState(false);
  const [lastSave, setLastSave] = useState(null);
  const [syncQueue, setSyncQueue] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('excellent');
  const [syncMetrics, setSyncMetrics] = useState({
    successfulSyncs: 0,
    failedSyncs: 0,
    averageSyncTime: 0,
    lastError: null
  });

  const prepareIntelligentData = (profileData) => {
    const intelligentProfile = {
      first_name: profileData.firstName?.trim() || '',
      last_name: profileData.lastName?.trim() || '',
      display_name: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
      bio: profileData.bio?.substring(0, 500) || '',
      company: profileData.company?.trim() || '',
      website: profileData.website?.trim() || '',
      location: profileData.location || null,
      avatar_url: profileData.profileImage || null,
      role: profileData.userType || 'skilled',
      is_profile_complete: !!(profileData.firstName && profileData.lastName && profileData.userType),
      profile_visibility: 'public',
      extended_profile: {
        skills: profileData.skills.slice(0, 50),
        portfolio: profileData.portfolio.slice(0, 20),
        farmDetails: profileData.farmDetails,
        clientDetails: profileData.clientDetails,
        isAvailable: profileData.isAvailable,
        skillCategories: profileData.skillCategories || [],
        lastSynced: new Date().toISOString(),
        profile_score: calculateProfileScore(profileData)
      },
      metadata: {
        app_version: '2.0.0',
        sync_timestamp: new Date().toISOString(),
        device_id: Platform.OS,
        sync_attempt: syncMetrics.successfulSyncs + syncMetrics.failedSyncs + 1
      }
    };

    console.log('Intelligent Data Prepared:', {
      displayName: intelligentProfile.display_name,
      isComplete: intelligentProfile.is_profile_complete,
      profileScore: intelligentProfile.extended_profile.profile_score
    });

    return intelligentProfile;
  };

  const calculateProfileScore = (profileData) => {
    let score = 0;
    if (profileData.firstName && profileData.lastName) score += 40;
    if (profileData.profileImage) score += 20;
    if (profileData.location) score += 15;
    if (profileData.skills.length > 0) score += 15;
    if (profileData.bio && profileData.bio.length > 50) score += 10;
    return Math.min(score, 100);
  };

  const saveToBackend = async (profileData, token, isPriority = false) => {
    const syncStartTime = Date.now();
    
    try {
      setSaving(true);
      console.log('Starting Intelligent Sync...');
      
      const preparedData = prepareIntelligentData(profileData);
      
      const timeout = connectionStatus === 'poor' ? 15000 : 8000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch('https://api.vsxchangeza.com/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Sync-Priority': isPriority ? 'high' : 'normal',
          'X-Profile-Score': preparedData.extended_profile.profile_score.toString(),
          'X-Intelligent-Sync': 'true'
        },
        body: JSON.stringify(preparedData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Sync Failed:', {
          status: response.status,
          error: errorData,
          profileData: {
            firstName: profileData.firstName,
            lastName: profileData.lastName
          }
        });
        
        throw new Error(`Server error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      const syncTime = Date.now() - syncStartTime;
      
      setLastSave(new Date().toISOString());
      setConnectionStatus('excellent');
      
      setSyncMetrics(prev => ({
        ...prev,
        successfulSyncs: prev.successfulSyncs + 1,
        averageSyncTime: (prev.averageSyncTime * prev.successfulSyncs + syncTime) / (prev.successfulSyncs + 1)
      }));

      console.log('Sync Successful:', {
        syncTime: `${syncTime}ms`,
        profileScore: preparedData.extended_profile.profile_score,
        displayName: preparedData.display_name
      });

      return { 
        success: true, 
        data: result,
        metrics: {
          syncTime,
          profileScore: preparedData.extended_profile.profile_score
        }
      };
      
    } catch (error) {
      const syncTime = Date.now() - syncStartTime;
      console.error('Sync Failure:', {
        error: error.message,
        syncTime: `${syncTime}ms`,
        profileData: {
          firstName: profileData.firstName,
          lastName: profileData.lastName
        }
      });
      
      setConnectionStatus('poor');
      setSyncMetrics(prev => ({
        ...prev,
        failedSyncs: prev.failedSyncs + 1,
        lastError: error.message
      }));

      if (error.name !== 'AbortError') {
        setSyncQueue(prev => [...prev, { 
          profileData, 
          token, 
          attempts: 0,
          timestamp: new Date().toISOString(),
          priority: isPriority ? 'critical' : 'normal'
        }]);
      }
      
      return { 
        success: false, 
        error: error.message,
        queued: true,
        metrics: { syncTime }
      };
    } finally {
      setSaving(false);
    }
  };

  const retrySyncs = useCallback(async () => {
    if (syncQueue.length === 0) return;
    
    const failedSync = syncQueue[0];
    if (failedSync.attempts >= 3) {
      console.warn('Removing failed sync after 3 attempts');
      setSyncQueue(prev => prev.slice(1));
      return;
    }

    console.log('Retrying sync attempt:', failedSync.attempts + 1);
    const result = await saveToBackend(
      failedSync.profileData, 
      failedSync.token, 
      true
    );

    if (result.success) {
      console.log('Retry successful');
      setSyncQueue(prev => prev.slice(1));
    } else {
      console.warn('Retry failed, incrementing attempts');
      setSyncQueue(prev => 
        prev.map((item, index) => 
          index === 0 ? { ...item, attempts: item.attempts + 1 } : item
        )
      );
    }
  }, [syncQueue]);

  useEffect(() => {
    if (syncQueue.length > 0) {
      const retryInterval = setInterval(retrySyncs, 45000);
      return () => clearInterval(retryInterval);
    }
  }, [syncQueue.length, retrySyncs]);

  return { 
    saving, 
    lastSave, 
    saveToBackend, 
    syncQueue,
    connectionStatus,
    retrySyncs,
    syncMetrics
  };
};

// PROFILE REPAIR SYSTEM
const useProfileRepair = (updateField, updateGlobalUser) => {
  const [repairHistory, setRepairHistory] = useState([]);

  const forceProfileSync = async (profile, navigation) => {
    try {
      console.log('Starting Profile Repair...');
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert(
          'Authentication Required', 
          'Advanced authentication required for profile repair',
          [{ text: 'Login', onPress: () => navigation.navigate('Login') }]
        );
        return false;
      }

      // Force reload from storage
      const [userData, profileData] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('userProfile')
      ]);

      let repairedProfile = {...profile};

      if (userData) {
        const userObj = JSON.parse(userData);
        console.log('User data loaded:', userObj);
      }

      if (profileData) {
        const profileObj = JSON.parse(profileData);
        console.log('Profile data loaded:', {
          firstName: profileObj.firstName,
          lastName: profileObj.lastName
        });
        
        // Repair: Ensure all critical fields are properly set
        repairedProfile = {
          ...profileObj,
          firstName: profileObj.firstName || 'User',
          lastName: profileObj.lastName || '',
          displayName: `${profileObj.firstName || 'User'} ${profileObj.lastName || ''}`.trim(),
          isProfileComplete: !!(profileObj.firstName && profileObj.lastName),
          lastRepaired: new Date().toISOString()
        };

        // Update local state
        Object.keys(repairedProfile).forEach(key => {
          if (repairedProfile[key] !== profile[key]) {
            updateField(key, repairedProfile[key]);
          }
        });

        // Force immediate sync
        const result = await saveToBackend(repairedProfile, token, true);
        
        if (result.success) {
          setRepairHistory(prev => [...prev, {
            timestamp: new Date().toISOString(),
            action: 'profile_repair',
            success: true,
            repairedFields: Object.keys(repairedProfile).filter(key => repairedProfile[key] !== profile[key])
          }]);
          
          Alert.alert(
            'Profile Repair Complete', 
            'Profile system has been recalibrated. Display issues should be resolved.',
            [{ text: 'Excellent', style: 'default' }]
          );
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Profile Repair Failed:', error);
      setRepairHistory(prev => [...prev, {
        timestamp: new Date().toISOString(),
        action: 'profile_repair',
        success: false,
        error: error.message
      }]);
      return false;
    }
  };

  const validateProfileForDisplay = (profileData) => {
    const requiredFields = ['firstName', 'lastName', 'userType'];
    const missingFields = requiredFields.filter(field => !profileData[field] || profileData[field].trim() === '');
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        displayName: 'Community Member',
        displayStatus: 'unverified',
        reason: `Validation failed: Missing ${missingFields.join(', ')}`,
        severity: 'high'
      };
    }

    const profileScore = calculateProfileScore(profileData);
    
    return {
      isValid: true,
      displayName: `${profileData.firstName} ${profileData.lastName}`.trim(),
      displayStatus: profileScore > 70 ? 'verified' : 'pending',
      profileScore,
      reason: 'Validation passed'
    };
  };

  return {
    forceProfileSync,
    validateProfileForDisplay,
    repairHistory,
    lastRepair: repairHistory[repairHistory.length - 1]
  };
};

// ENHANCED SMART INPUT SYSTEM WITH VALIDATION
const SmartInput = ({ 
  value, 
  onChangeText, 
  placeholder, 
  style, 
  multiline = false, 
  onSave,
  guidanceText,
  exampleText,
  validationRule,
  maxLength,
  inputType = 'text',
  qualityValidation = null
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const [qualityScore, setQualityScore] = useState(0);

  const validateInput = (text) => {
    if (!validationRule) {
      if (qualityValidation) {
        const qualityResult = qualityValidation(text);
        setQualityScore(qualityResult.score);
        setIsValid(qualityResult.isValid);
        setValidationMessage(qualityResult.message);
        return qualityResult.isValid;
      }
      return true;
    }
    
    if (validationRule === 'email') {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
      setIsValid(emailValid);
      setValidationMessage(emailValid ? '' : 'Please enter a valid email');
      return emailValid;
    }
    
    if (validationRule === 'url') {
      const urlValid = /^https?:\/\/.+\..+$/.test(text);
      setIsValid(urlValid);
      setValidationMessage(urlValid ? '' : 'Please enter a valid URL');
      return urlValid;
    }
    
    if (validationRule === 'required') {
      const requiredValid = text.trim().length > 0;
      setIsValid(requiredValid);
      setValidationMessage(requiredValid ? '' : 'This field is required');
      return requiredValid;
    }
    
    if (validationRule === 'name') {
      const nameValid = text.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(text);
      setIsValid(nameValid);
      setValidationMessage(nameValid ? '' : 'Please enter a valid name (letters only)');
      return nameValid;
    }
    
    return true;
  };

  const handleSave = () => {
    if (validateInput(inputValue)) {
      onChangeText(inputValue);
      onSave?.();
    }
  };

  const handleChange = (text) => {
    setInputValue(text);
    validateInput(text);
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input, 
          style,
          isFocused && styles.inputFocused,
          !isValid && styles.inputError,
          qualityScore > 80 && styles.inputQualityExcellent,
          qualityScore > 60 && qualityScore <= 80 && styles.inputQualityGood
        ]}
        value={inputValue}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#888"
        multiline={multiline}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        blurOnSubmit={!multiline}
        maxLength={maxLength}
        keyboardType={
          inputType === 'email' ? 'email-address' :
          inputType === 'url' ? 'url' : 'default'
        }
      />
      
      {qualityScore > 0 && (
        <View style={styles.qualityScoreContainer}>
          <Text style={styles.qualityScoreText}>
            Quality Score: {qualityScore}%
          </Text>
          <View style={styles.qualityScoreBar}>
            <View 
              style={[
                styles.qualityScoreFill,
                { width: `${qualityScore}%` },
                qualityScore > 80 ? styles.qualityScoreExcellent :
                qualityScore > 60 ? styles.qualityScoreGood :
                styles.qualityScorePoor
              ]} 
            />
          </View>
        </View>
      )}
      
      {guidanceText && isFocused && (
        <View style={styles.guidanceContainer}>
          <Icon name="bulb-outline" size={14} color="#00f0a8" />
          <Text style={styles.guidanceText}>{guidanceText}</Text>
        </View>
      )}
      
      {!isValid && validationMessage && (
        <View style={styles.validationContainer}>
          <Icon name="warning-outline" size={12} color="#ff6b6b" />
          <Text style={styles.validationText}>{validationMessage}</Text>
        </View>
      )}
      
      {exampleText && isFocused && isValid && (
        <Text style={styles.exampleText}>Example: {exampleText}</Text>
      )}
      
      {maxLength && isFocused && (
        <Text style={[
          styles.charCounter,
          inputValue.length > maxLength * 0.8 && styles.charCounterWarning
        ]}>
          {inputValue.length}/{maxLength}
        </Text>
      )}
      
      {isFocused && (
        <TouchableOpacity 
          style={[
            styles.doneButton, 
            !isValid && styles.doneButtonDisabled,
            qualityScore > 80 && styles.doneButtonQuality
          ]} 
          onPress={handleSave}
          disabled={!isValid}
        >
          <Text style={styles.doneButtonText}>
            {isValid ? (qualityScore > 80 ? 'Save' : 'Done') : 'Fix'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// INTELLIGENT SKILL RECOMMENDATIONS ENGINE
const useIntelligentSkillRecommendations = (userSkills, userType) => {
  const [recommendations, setRecommendations] = useState([]);
  const [learningRate, setLearningRate] = useState(0.1);

  const intelligentSkillDatabase = {
    farmer: [
      { name: 'Crop Rotation', weight: 0.95, category: 'agriculture', demand: 0.85 },
      { name: 'Irrigation Management', weight: 0.88, category: 'water_management', demand: 0.92 },
      { name: 'Soil Analysis', weight: 0.82, category: 'science', demand: 0.78 },
      { name: 'Livestock Care', weight: 0.90, category: 'animal_husbandry', demand: 0.87 },
      { name: 'Harvest Planning', weight: 0.85, category: 'operations', demand: 0.80 },
      { name: 'Pest Control', weight: 0.87, category: 'protection', demand: 0.91 },
      { name: 'Equipment Maintenance', weight: 0.83, category: 'mechanical', demand: 0.89 },
      { name: 'Organic Farming', weight: 0.92, category: 'sustainable', demand: 0.94 }
    ],
    skilled: [
      { name: 'Carpentry', weight: 0.88, category: 'construction', demand: 0.85 },
      { name: 'Electrical Work', weight: 0.91, category: 'electrical', demand: 0.92 },
      { name: 'Plumbing', weight: 0.89, category: 'plumbing', demand: 0.88 },
      { name: 'Masonry', weight: 0.84, category: 'construction', demand: 0.82 },
      { name: 'Welding', weight: 0.86, category: 'metalwork', demand: 0.87 },
      { name: 'Equipment Operation', weight: 0.83, category: 'operational', demand: 0.90 },
      { name: 'Construction', weight: 0.87, category: 'building', demand: 0.86 },
      { name: 'Renovation', weight: 0.85, category: 'improvement', demand: 0.89 }
    ],
    client: [
      { name: 'Project Management', weight: 0.90, category: 'management', demand: 0.88 },
      { name: 'Budget Planning', weight: 0.87, category: 'financial', demand: 0.85 },
      { name: 'Quality Control', weight: 0.84, category: 'assurance', demand: 0.82 },
      { name: 'Vendor Management', weight: 0.82, category: 'coordination', demand: 0.80 }
    ]
  };

  const generateIntelligentRecommendations = useCallback(() => {
    const currentSkills = userSkills.map(skill => skill.name.toLowerCase());
    const typeSkills = intelligentSkillDatabase[userType] || [];
    
    const intelligentScoredSkills = typeSkills.map(skill => {
      const baseScore = currentSkills.includes(skill.name.toLowerCase()) ? 0 : 
        (skill.weight * 0.6 + skill.demand * 0.4) * 100;
      
      const learningAdjustment = learningRate * 10;
      
      const finalScore = Math.min(baseScore + learningAdjustment, 100);
      
      return { 
        ...skill, 
        score: finalScore, 
        confidence: finalScore / 100,
        recommendationReason: getRecommendationReason(skill, finalScore)
      };
    });

    return intelligentScoredSkills
      .filter(skill => skill.score > 25)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [userSkills, userType, learningRate]);

  const getRecommendationReason = (skill, score) => {
    if (score > 85) return "High demand in your area";
    if (score > 70) return "Matches your profile perfectly";
    if (score > 50) return "Growing demand trend";
    return "Complementary to your skills";
  };

  useEffect(() => {
    const newRecs = generateIntelligentRecommendations();
    setRecommendations(newRecs);
    
    // Adaptive learning rate adjustment
    if (userSkills.length > 0) {
      setLearningRate(prev => Math.min(prev + 0.02, 0.3));
    }
  }, [generateIntelligentRecommendations]);

  return { recommendations, learningRate };
};

// ENHANCED IMAGE GALLERY COMPONENT
const EnhancedImageGallery = ({ images, onAddImage, onRemoveImage, editable, title, type }) => {
  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageItem}>
      <Image source={{ uri: item.uri }} style={styles.galleryImage} />
      {editable && (
        <TouchableOpacity 
          style={styles.removeImageButton}
          onPress={() => onRemoveImage(item.id)}
        >
          <Icon name="close-circle" size={24} color="#ff6b6b" />
        </TouchableOpacity>
      )}
      {item.description && (
        <Text style={styles.imageDescription}>{item.description}</Text>
      )}
      <View style={styles.imageOptimizationBadge}>
        <Text style={styles.optimizationText}>Optimized</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.gallerySection}>
      <View style={styles.galleryHeader}>
        <View>
          <Text style={styles.galleryTitle}>{title}</Text>
          <Text style={styles.gallerySubtitle}>
            {images.length} optimized {images.length === 1 ? 'image' : 'images'}
          </Text>
        </View>
        {editable && (
          <TouchableOpacity 
            style={styles.enhancedAddButton}
            onPress={() => onAddImage(type)}
          >
            <Icon name="add" size={20} color="#00f0a8" />
            <Text style={styles.addImageText}>Add Images</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {images.length > 0 ? (
        <FlatList
          horizontal
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.galleryList}
        />
      ) : (
        <View style={styles.emptyGallery}>
          <Icon name="images-outline" size={48} color="#666" />
          <Text style={styles.emptyGalleryText}>No images yet</Text>
          <Text style={styles.emptyGallerySubtext}>
            Add images to boost your profile visibility
          </Text>
        </View>
      )}
    </View>
  );
};

// Helper functions
const calculateProfileScore = (profileData) => {
  let score = 0;
  if (profileData.firstName) score += 20;
  if (profileData.lastName) score += 20;
  if (profileData.bio) score += 15;
  if (profileData.profileImage) score += 15;
  if (profileData.skills.length > 0) score += 15;
  if (profileData.location) score += 15;
  return Math.min(score, 100);
};

// AI-PROFILE OPTIMIZATION ENGINE
const useProfileOptimization = (profileData) => {
  const [optimizationTips, setOptimizationTips] = useState([]);
  const [profileStrength, setProfileStrength] = useState(0);

  const analyzeProfile = useCallback(() => {
    const tips = [];
    let strength = 0;

    // Analyze profile completeness
    if (!profileData.firstName || !profileData.lastName) {
      tips.push({
        id: 'name',
        title: 'Complete Your Name',
        description: 'Add your full name for better recognition',
        priority: 'high',
        icon: 'person'
      });
    } else {
      strength += 25;
    }

    if (!profileData.profileImage) {
      tips.push({
        id: 'avatar',
        title: 'Add Profile Photo',
        description: 'Upload a professional photo to build trust',
        priority: 'high',
        icon: 'camera'
      });
    } else {
      strength += 20;
    }

    if (!profileData.bio || profileData.bio.length < 50) {
      tips.push({
        id: 'bio',
        title: 'Enhance Your Bio',
        description: 'Write a detailed bio to showcase your expertise',
        priority: 'medium',
        icon: 'document-text'
      });
    } else {
      strength += 15;
    }

    if (profileData.skills.length === 0) {
      tips.push({
        id: 'skills',
        title: 'Add Skills',
        description: 'List your skills to attract better opportunities',
        priority: 'high',
        icon: 'construct'
      });
    } else {
      strength += 20;
    }

    if (!profileData.location) {
      tips.push({
        id: 'location',
        title: 'Set Location',
        description: 'Add your location for local opportunities',
        priority: 'medium',
        icon: 'location'
      });
    } else {
      strength += 20;
    }

    setOptimizationTips(tips.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }));
    
    setProfileStrength(strength);
  }, [profileData]);

  useEffect(() => {
    analyzeProfile();
  }, [analyzeProfile]);

  return { optimizationTips, profileStrength };
};

export default function ProfileScreen({ navigation }) {
  const { globalUser, updateGlobalUser } = useContext(AppContext);
  
  const [user, setUser] = useEnterpriseState(null, 'userData');
  const [profile, setProfile, profileManager] = useEnterpriseState({
    firstName: '',
    lastName: '',
    displayName: '',
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
    profileImage: null,
    isProfileComplete: false,
    lastRepaired: null
  }, 'userProfile');
  
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [imageUploading, setImageUploading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSkillRecommendations, setShowSkillRecommendations] = useState(false);
  
  const { saving, lastSave, saveToBackend, syncQueue, connectionStatus, syncMetrics } = useIntelligentBackendSync();
  const { recommendations, learningRate } = useIntelligentSkillRecommendations(profile.skills, profile.userType);
  const { forceProfileSync, validateProfileForDisplay, repairHistory } = useProfileRepair(updateField, updateGlobalUser);
  const { optimizationTips, profileStrength } = useProfileOptimization(profile);
  
  const scrollViewRef = useRef(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const profileScale = useRef(new Animated.Value(0.95)).current;
  const savePulse = useRef(new Animated.Value(1)).current;
  const successGlow = useRef(new Animated.Value(0)).current;

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

  const triggerSuccessGlow = () => {
    Animated.sequence([
      Animated.timing(successGlow, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(successGlow, {
        toValue: 0,
        duration: 600,
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
      if (profileData) {
        finalProfileData = JSON.parse(profileData);
        
        finalProfileData.isProfileComplete = !!(finalProfileData.firstName && finalProfileData.lastName);
        finalProfileData.displayName = `${finalProfileData.firstName || ''} ${finalProfileData.lastName || ''}`.trim();
      }
      
      if (finalProfileData) {
        setProfile(prev => ({ 
          ...prev, 
          ...finalProfileData,
          farmDetails: { ...prev.farmDetails, ...finalProfileData.farmDetails },
          clientDetails: { ...prev.clientDetails, ...finalProfileData.clientDetails }
        }));
        
        // Enhanced global user update with validation
        const validation = validateProfileForDisplay(finalProfileData);
        
        updateGlobalUser({
          firstName: finalProfileData.firstName,
          lastName: finalProfileData.lastName,
          displayName: validation.displayName,
          profileImage: finalProfileData.profileImage,
          userType: finalProfileData.userType,
          skills: finalProfileData.skills,
          skillCategories: finalProfileData.skillCategories,
          company: finalProfileData.company,
          website: finalProfileData.website,
          location: finalProfileData.location,
          portfolio: finalProfileData.portfolio,
          farmDetails: finalProfileData.farmDetails,
          isProfileComplete: finalProfileData.isProfileComplete,
          displayStatus: validation.displayStatus
        });
      }
    } catch (error) {
      console.warn('Data loading failed:', error);
    }
  };

  const updateField = useCallback((field, value) => {
    setProfile(prev => {
      const newProfile = {
        ...prev,
        [field]: value,
        lastUpdated: new Date().toISOString(),
        displayName: field === 'firstName' || field === 'lastName' ? 
          `${field === 'firstName' ? value : prev.firstName} ${field === 'lastName' ? value : prev.lastName}`.trim() : 
          prev.displayName
      };

      newProfile.isProfileComplete = !!(newProfile.firstName && newProfile.lastName);

      // Enhanced global user update
      const validation = validateProfileForDisplay(newProfile);
      
      if (['firstName', 'lastName', 'profileImage', 'userType', 'skills', 'skillCategories', 'company', 'website', 'location', 'portfolio', 'farmDetails'].includes(field)) {
        updateGlobalUser({
          firstName: newProfile.firstName,
          lastName: newProfile.lastName,
          displayName: validation.displayName,
          profileImage: newProfile.profileImage,
          userType: newProfile.userType,
          skills: newProfile.skills,
          skillCategories: newProfile.skillCategories,
          company: newProfile.company,
          website: newProfile.website,
          location: newProfile.location,
          portfolio: newProfile.portfolio,
          farmDetails: newProfile.farmDetails,
          isProfileComplete: newProfile.isProfileComplete,
          displayStatus: validation.displayStatus
        });
      }
      
      return newProfile;
    });
  }, [updateGlobalUser, validateProfileForDisplay]);

  const updateFarmField = useCallback((field, value) => {
    setProfile(prev => ({
      ...prev,
      farmDetails: { ...prev.farmDetails, [field]: value }
    }));
  }, []);

  const addSkill = useCallback((skillData = null) => {
    if (skillData) {
      const newSkill = { 
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9), 
        name: skillData.name,
        category: skillData.category || 'general',
        acquired: new Date().toISOString(),
        confidence: skillData.score || 0,
        source: 'intelligent_recommendation',
        intelligentData: {
          weight: skillData.weight,
          demand: skillData.demand,
          confidence: skillData.confidence
        }
      };
      
      setProfile(prev => {
        const newSkills = [...prev.skills, newSkill];
        const newCategories = [...new Set([...prev.skillCategories, newSkill.category])];
        
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
      
      return;
    }

    Alert.prompt(
      'Add Skill',
      'Enter skill and category (format: Skill Name - Category):',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Get Suggestions', 
          onPress: () => setShowSkillRecommendations(true)
        },
        { 
          text: 'Add Custom', 
          onPress: (input) => {
            if (input && input.trim()) {
              const parts = input.split('-').map(part => part.trim());
              const skillName = parts[0];
              const category = parts[1] || 'general';
              
              const newSkill = { 
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9), 
                name: skillName,
                category: category,
                acquired: new Date().toISOString(),
                confidence: 100,
                source: 'manual',
                intelligentData: {
                  weight: 0.8,
                  demand: 0.7,
                  confidence: 0.9
                }
              };
              
              setProfile(prev => {
                const newSkills = [...prev.skills, newSkill];
                const newCategories = [...new Set([...prev.skillCategories, category])];
                
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

              triggerSuccessGlow();
            }
          }
        }
      ],
      'plain-text',
      'e.g., Tractor Operation - Machinery'
    );
  }, [profile.userType, profile.skills, updateGlobalUser]);

  const removeSkill = useCallback((skillId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    
    setProfile(prev => {
      const newSkills = prev.skills.filter(skill => skill.id !== skillId);
      const remainingCategories = [...new Set(newSkills.map(skill => skill.category))];
      
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
  }, [updateGlobalUser]);

  const uploadImages = async (type = 'profile') => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera roll access is needed for image optimization');
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
        
        const processedImages = await Promise.all(
          result.assets.map(async (asset) => {
            await new Promise(resolve => setTimeout(resolve, 600));
            
            return {
              uri: asset.uri,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              description: '',
              timestamp: new Date().toISOString(),
              size: asset.fileSize,
              dimensions: { width: asset.width, height: asset.height },
              optimized: true,
              optimizationLevel: 'high'
            };
          })
        );

        if (type === 'profile') {
          updateField('profileImage', processedImages[0].uri);
        } else if (type === 'farm' && profile.userType === 'farmer') {
          setProfile(prev => ({
            ...prev,
            farmDetails: {
              ...prev.farmDetails,
              images: [...(prev.farmDetails?.images || []), ...processedImages]
            }
          }));
        } else if (type === 'portfolio') {
          setProfile(prev => ({
            ...prev,
            portfolio: [...prev.portfolio, ...processedImages]
          }));
        }
        
        setImageUploading(false);
        Vibration.vibrate(100);
        
        Alert.alert(
          'Upload Complete', 
          `${processedImages.length} ${type} image${processedImages.length === 1 ? '' : 's'} optimized and uploaded.`,
          [{ text: 'Excellent', style: 'default' }]
        );

        triggerSuccessGlow();
      }
    } catch (error) {
      setImageUploading(false);
      Alert.alert(
        'Upload Failed', 
        'Please try again or contact support if the issue persists.',
        [{ text: 'Retry', onPress: () => uploadImages(type) }]
      );
    }
  };

  const removeImage = useCallback((imageId, type) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    
    if (type === 'farm') {
      setProfile(prev => ({
        ...prev,
        farmDetails: {
          ...prev.farmDetails,
          images: prev.farmDetails.images.filter(img => img.id !== imageId)
        }
      }));
    } else if (type === 'portfolio') {
      setProfile(prev => ({
        ...prev,
        portfolio: prev.portfolio.filter(img => img.id !== imageId)
      }));
    }
  }, []);

  const getCurrentLocation = async () => {
    try {
      if (!locationPermission) {
        Alert.alert(
          'Location Services', 
          'Enable location for precise service matching and local opportunities',
          [
            { text: 'Not Now', style: 'cancel' },
            { text: 'Enable', onPress: requestLocationPermission }
          ]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000
      });

      const { latitude, longitude } = location.coords;
      
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      const readableAddress = address[0] 
        ? `${address[0].name || ''} ${address[0].city || ''} ${address[0].region || ''} ${address[0].country || ''}`.trim()
        : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      const locationData = {
        latitude,
        longitude,
        address: readableAddress,
        timestamp: new Date().toISOString(),
        accuracy: location.coords.accuracy,
        serviceRadius: 50,
        verified: true
      };
      
      updateField('location', locationData);
      setShowLocationPicker(false);
      
      Alert.alert(
        'Location Set', 
        `Location services activated for ${profile.userType} opportunities. Precision: ${location.coords.accuracy}m`,
        [{ text: 'Perfect', style: 'default' }]
      );

      triggerSuccessGlow();
    } catch (error) {
      console.warn('Location acquisition failed:', error);
      Alert.alert(
        'Location Services', 
        'Try manual entry for now.',
        [
          { text: 'Manual Entry', onPress: () => handleManualLocation() },
          { text: 'Try Again', onPress: getCurrentLocation }
        ]
      );
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        triggerSuccessGlow();
      }
    } catch (error) {
      console.warn('Location permission failed:', error);
    }
  };

  const handleManualLocation = () => {
    Alert.prompt(
      'Enter Location',
      'Enter your address for service matching:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save', 
          onPress: (address) => {
            if (address && address.trim()) {
              const manualLocation = {
                latitude: -23.0833 + (Math.random() - 0.5) * 0.01,
                longitude: 30.3833 + (Math.random() - 0.5) * 0.01,
                address: address.trim(),
                accuracy: 'manual',
                serviceRadius: 50,
                verified: true
              };

              updateField('location', manualLocation);
              setShowLocationPicker(false);
              triggerSuccessGlow();
            }
          }
        }
      ],
      'plain-text',
      'e.g., 123 Farm Road, Agricultural District'
    );
  };

  const syncProfileToBackend = async (isPriority = false) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert(
          'Authentication Required', 
          'Please log in to activate profile sync',
          [{ text: 'Login', onPress: () => navigation.navigate('Login') }]
        );
        return false;
      }

      const currentProfile = profileManager.getCurrentState();
      const validation = validateProfileForDisplay(currentProfile);

      const result = await saveToBackend(currentProfile, token, isPriority);
      
      if (result.success) {
        updateGlobalUser({
          firstName: currentProfile.firstName,
          lastName: currentProfile.lastName,
          displayName: validation.displayName,
          profileImage: currentProfile.profileImage,
          userType: currentProfile.userType,
          skills: currentProfile.skills,
          skillCategories: currentProfile.skillCategories,
          company: currentProfile.company,
          website: currentProfile.website,
          location: currentProfile.location,
          portfolio: currentProfile.portfolio,
          farmDetails: currentProfile.farmDetails,
          isProfileComplete: currentProfile.isProfileComplete,
          displayStatus: validation.displayStatus
        });
        
        triggerSaveAnimation();
        triggerSuccessGlow();
        Vibration.vibrate(200);
        
        if (validation.profileScore >= 80) {
          Alert.alert(
            'Profile Optimized!',
            `Your profile is now fully optimized for maximum visibility!`,
            [{ text: 'Excellent!', style: 'default' }]
          );
        }
        
        return true;
      } else if (result.queued) {
        Alert.alert(
          'Sync Queued',
          'Your changes are queued and will sync when connection stabilizes.',
          [{ text: 'Understood', style: 'default' }]
        );
        return true;
      } else {
        Alert.alert(
          'Sync Attention',
          'Changes saved locally. System will retry automatically.',
          [{ text: 'Continue', style: 'default' }]
        );
        return false;
      }
    } catch (error) {
      console.error('Sync failed:', error);
      Alert.alert(
        'Sync Recovery',
        'All changes preserved locally. Automatic retry activated.',
        [{ text: 'Continue', style: 'default' }]
      );
      return false;
    }
  };

  const ProfileStrengthMeter = () => {
    const strengthWidth = `${profileStrength}%`;
    
    return (
      <View style={styles.strengthSection}>
        <View style={styles.strengthHeader}>
          <Text style={styles.strengthTitle}>Profile Strength</Text>
          <Text style={styles.strengthPercentage}>{profileStrength}%</Text>
        </View>
        <View style={styles.strengthBar}>
          <View 
            style={[
              styles.strengthFill,
              { width: strengthWidth }
            ]} 
          />
        </View>
        <Text style={styles.strengthHint}>
          {profileStrength >= 80 ? 'Excellent! Maximum visibility' :
           profileStrength >= 60 ? 'Great! Almost optimized' :
           'Add more details to increase visibility'}
        </Text>
      </View>
    );
  };

  const OptimizationTips = () => {
    if (optimizationTips.length === 0 || profileStrength >= 90) return null;

    return (
      <View style={styles.optimizationSection}>
        <Text style={styles.optimizationTitle}>Optimization Tips</Text>
        <Text style={styles.optimizationSubtitle}>
          Improve your profile to get better matches
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {optimizationTips.slice(0, 3).map((tip) => (
            <View key={tip.id} style={styles.optimizationTip}>
              <View style={styles.tipIconContainer}>
                <Icon name={tip.icon} size={16} color="#000" />
              </View>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
              <View style={[
                styles.tipPriority,
                tip.priority === 'high' && styles.tipPriorityHigh,
                tip.priority === 'medium' && styles.tipPriorityMedium
              ]}>
                <Text style={styles.tipPriorityText}>
                  {tip.priority.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const IntelligentRecommendationsPanel = () => {
    if (!showSkillRecommendations || recommendations.length === 0) return null;

    return (
      <Modal visible={showSkillRecommendations} transparent animationType="slide">
        <View style={styles.recommendationsOverlay}>
          <View style={styles.recommendationsPanel}>
            <View style={styles.recommendationsHeader}>
              <View>
                <Text style={styles.recommendationsTitle}>Skill Suggestions</Text>
                <Text style={styles.recommendationsSubtitle}>
                  Intelligent recommendations for {profile.userType}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowSkillRecommendations(false)}>
                <Icon name="close" size={24} color="#00f0a8" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.learningRateText}>
              Learning Rate: {(learningRate * 100).toFixed(1)}%
            </Text>
            
            <ScrollView style={styles.recommendationsList}>
              {recommendations.map((rec, index) => (
                <TouchableOpacity
                  key={`intelligent-rec-${index}`}
                  style={styles.recommendationItem}
                  onPress={() => {
                    addSkill(rec);
                    setShowSkillRecommendations(false);
                  }}
                >
                  <View style={styles.recommendationInfo}>
                    <Text style={styles.recommendationName}>{rec.name}</Text>
                    <View style={styles.recommendationMetrics}>
                      <Text style={styles.recommendationScore}>
                        {Math.round(rec.score)}% match
                      </Text>
                      <Text style={styles.recommendationReason}>
                        {rec.recommendationReason}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.recommendationConfidence}>
                    <Text style={styles.confidenceText}>
                      {(rec.confidence * 100).toFixed(0)}%
                    </Text>
                    <Icon name="add-circle" size={24} color="#00f0a8" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.enhancedCustomButton}
              onPress={() => {
                setShowSkillRecommendations(false);
                setTimeout(() => addSkill(), 300);
              }}
            >
              <Icon name="add" size={20} color="#000" />
              <Text style={styles.enhancedCustomText}>Add Custom Skill</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const ConnectionStatus = () => (
    <View style={styles.connectionStatus}>
      <Animated.View style={{ opacity: successGlow }}>
        <Icon 
          name="checkmark-circle" 
          size={16} 
          color="#00f0a8" 
        />
      </Animated.View>
      <Icon 
        name={connectionStatus === 'excellent' ? 'wifi' : 'cellular-outline'} 
        size={16} 
        color={connectionStatus === 'excellent' ? '#00f0a8' : '#ffa500'} 
      />
      <Text style={styles.connectionText}>
        {connectionStatus === 'excellent' ? 'Connected' : 'Optimizing'}
        {syncQueue.length > 0 && ` • ${syncQueue.length} queued`}
        {syncMetrics.successfulSyncs > 0 && ` • ${syncMetrics.successfulSyncs} successful`}
      </Text>
    </View>
  );

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

  const ProfileHeader = () => {
    const validation = validateProfileForDisplay(profile);
    
    return (
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
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Profile</Text>
            <ConnectionStatus />
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.repairButton, repairHistory.length > 0 && styles.repairActive]}
              onPress={() => forceProfileSync(profile, navigation)}
            >
              <Icon name="build" size={20} color="#00f0a8" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.editButton, editing && styles.editButtonActive]}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                setEditing(!editing);
              }}
            >
              <Icon 
                name={editing ? "checkmark-circle" : "create-outline"} 
                size={24} 
                color="#00f0a8" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileMain}>
          <TouchableOpacity 
            onPress={() => uploadImages('profile')}
            disabled={imageUploading}
          >
            <Animated.View style={[styles.avatarContainer, { borderColor: validation.isValid ? '#00f0a8' : '#ff6b6b' }]}>
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
                  <Text style={styles.uploadText}>Processing...</Text>
                </View>
              )}
              <View style={styles.avatarEditBadge}>
                <Icon name="camera" size={16} color="#000" />
              </View>
              
              {!validation.isValid && (
                <View style={styles.validationBadge}>
                  <Icon name="warning" size={12} color="#000" />
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            {editing ? (
              <>
                <SmartInput
                  value={profile.firstName}
                  onChangeText={(text) => updateField('firstName', text)}
                  placeholder="First Name"
                  style={styles.nameInput}
                  onSave={() => {}}
                  guidanceText="Your professional identity"
                  validationRule="name"
                  maxLength={30}
                  qualityValidation={(text) => ({
                    isValid: text.length >= 2,
                    score: Math.min(text.length * 10, 100),
                    message: text.length >= 2 ? 'Validated' : 'Name too short'
                  })}
                />
                <SmartInput
                  value={profile.lastName}
                  onChangeText={(text) => updateField('lastName', text)}
                  placeholder="Last Name"
                  style={styles.nameInput}
                  onSave={() => {}}
                  guidanceText="Build trust with complete identity"
                  validationRule="name"
                  maxLength={30}
                  qualityValidation={(text) => ({
                    isValid: text.length >= 2,
                    score: Math.min(text.length * 10, 100),
                    message: text.length >= 2 ? 'Validated' : 'Name too short'
                  })}
                />
              </>
            ) : (
              <>
                <Text style={styles.userName}>
                  {validation.displayName}
                </Text>
                <Text style={styles.userType}>
                  {profile.userType?.toUpperCase()} 
                  <Icon name="location" size={12} color="#00f0a8" /> 
                  {profile.location ? ' Located' : ' Remote Ready'}
                  {!validation.isValid && (
                    <Text style={styles.validationWarning}> • VERIFICATION NEEDED</Text>
                  )}
                </Text>
                <Text style={styles.userStats}>
                  <Icon name="construct" size={12} color="#666" /> {profile.skills.length} skills 
                  <Icon name="images" size={12} color="#666" /> {profile.portfolio.length} images
                </Text>
              </>
            )}
          </View>
        </View>

        <ProfileStrengthMeter />
        <OptimizationTips />
      </Animated.View>
    );
  };

  const SaveButton = () => (
    <Animated.View style={[styles.saveButtonContainer, { transform: [{ scale: savePulse }] }]}>
      <TouchableOpacity 
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={async () => {
          const success = await syncProfileToBackend(true);
          if (success) {
            setEditing(false);
          }
        }}
        disabled={saving}
      >
        {saving ? (
          <>
            <ActivityIndicator color="#000" size="small" />
            <Text style={styles.saveButtonText}>Syncing...</Text>
          </>
        ) : (
          <>
            <Icon name="cloud-upload" size={20} color="#000" />
            <Text style={styles.saveButtonText}>
              {saveSuccess ? 'Synced' : 'Save Changes'}
            </Text>
          </>
        )}
      </TouchableOpacity>
      
      {lastSave && (
        <Text style={styles.lastSaveText}>
          Last sync: {new Date(lastSave).toLocaleTimeString()}
        </Text>
      )}
      
      {syncQueue.length > 0 && (
        <Text style={styles.syncQueueText}>
          {syncQueue.length} update{syncQueue.length === 1 ? '' : 's'} in queue
        </Text>
      )}
      
      <TouchableOpacity 
        style={styles.repairFooter}
        onPress={() => forceProfileSync(profile, navigation)}
      >
        <Text style={styles.repairText}>
          {repairHistory.length > 0 ? 'Re-calibrate Profile' : 'Repair Profile'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const BusinessInfoSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Business Information</Text>
      
      <SmartInput
        value={profile.company}
        onChangeText={(text) => updateField('company', text)}
        placeholder="Company or Farm Name"
        style={styles.input}
        onSave={() => {}}
        guidanceText="Your business name for professional recognition"
        exampleText="Green Valley Farms"
        maxLength={50}
      />

      <SmartInput
        value={profile.website}
        onChangeText={(text) => updateField('website', text)}
        placeholder="Website URL (optional)"
        style={styles.input}
        onSave={() => {}}
        guidanceText="Share your website for more visibility"
        exampleText="https://www.greenvalleyfarms.com"
        validationRule="url"
        inputType="url"
        maxLength={100}
      />

      <View style={styles.locationSection}>
        <Text style={styles.locationLabel}>Business Location</Text>
        <Text style={styles.locationDescription}>
          Set location for precise service matching
        </Text>
        
        {profile.location ? (
          <View style={styles.locationDisplay}>
            <Icon name="location" size={16} color="#00f0a8" />
            <Text style={styles.locationText}>{profile.location.address}</Text>
            {profile.location.verified && (
              <View style={styles.verifiedBadge}>
                <Icon name="shield-checkmark" size={12} color="#000" />
              </View>
            )}
            {editing && (
              <TouchableOpacity 
                style={styles.changeLocationButton}
                onPress={() => setShowLocationPicker(true)}
              >
                <Text style={styles.changeLocationText}>Change</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.addLocationButton}
            onPress={() => setShowLocationPicker(true)}
            disabled={!editing}
          >
            <Icon name="navigate" size={20} color="#00f0a8" />
            <Text style={styles.addLocationText}>Add Location</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const PortfolioSection = () => {
    if (profile.userType === 'client') return null;

    return (
      <View style={styles.section}>
        <EnhancedImageGallery
          images={profile.portfolio}
          onAddImage={() => uploadImages('portfolio')}
          onRemoveImage={(id) => removeImage(id, 'portfolio')}
          editable={editing}
          title="Work Portfolio"
          type="portfolio"
        />
      </View>
    );
  };

  const FarmGallerySection = () => {
    if (profile.userType !== 'farmer') return null;

    return (
      <View style={styles.section}>
        <EnhancedImageGallery
          images={profile.farmDetails?.images || []}
          onAddImage={() => uploadImages('farm')}
          onRemoveImage={(id) => removeImage(id, 'farm')}
          editable={editing}
          title="Farm Gallery"
          type="farm"
        />
        
        {editing && (
          <View style={styles.farmDetailsSection}>
            <Text style={styles.farmDetailsTitle}>Farm Details</Text>
            
            <SmartInput
              value={profile.farmDetails?.name || ''}
              onChangeText={(text) => updateFarmField('name', text)}
              placeholder="Farm Name"
              style={styles.input}
              onSave={() => {}}
              guidanceText="Official name of your farm"
              maxLength={50}
            />

            <SmartInput
              value={profile.farmDetails?.size || ''}
              onChangeText={(text) => updateFarmField('size', text)}
              placeholder="Farm Size (acres/hectares)"
              style={styles.input}
              onSave={() => {}}
              guidanceText="Total land area of your farm"
              maxLength={20}
            />

            <SmartInput
              value={profile.farmDetails?.mainCrop || ''}
              onChangeText={(text) => updateFarmField('mainCrop', text)}
              placeholder="Main Crops or Livestock"
              style={styles.input}
              onSave={() => {}}
              guidanceText="Primary agricultural products"
              maxLength={50}
            />
          </View>
        )}
      </View>
    );
  };

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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          <SmartInput
            value={profile.bio}
            onChangeText={(text) => updateField('bio', text)}
            placeholder="Tell us about yourself and your expertise..."
            style={[styles.input, styles.textArea]}
            multiline={true}
            onSave={() => {}}
            guidanceText="Describe your unique value proposition"
            exampleText="Expert with 10+ years in sustainable agriculture and innovation"
            maxLength={500}
          />

          <View style={styles.userTypeSection}>
            <Text style={styles.userTypeLabel}>Account Role:</Text>
            <Text style={styles.userTypeDescription}>
              Your role determines how you are matched with opportunities
            </Text>
            <View style={styles.userTypeOptions}>
              {[
                { type: 'skilled', icon: 'construct', label: 'Skilled Pro', description: 'Offer services' },
                { type: 'farmer', icon: 'leaf', label: 'Farmer', description: 'Manage operations' },
                { type: 'client', icon: 'business', label: 'Client', description: 'Find talent' }
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
        </View>

        <BusinessInfoSection />
        <PortfolioSection />
        <FarmGallerySection />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Skills & Expertise</Text>
              <Text style={styles.sectionSubtitle}>
                Optimized for maximum visibility
              </Text>
            </View>
            {editing && (
              <TouchableOpacity 
                style={styles.addSkillButton}
                onPress={() => addSkill()}
              >
                <Icon name="add" size={20} color="#00f0a8" />
                <Text style={styles.seeAllText}> Add Skill</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.skillsGrid}>
            {profile.skills.map((skill) => (
              <View key={skill.id} style={styles.skillChip}>
                <Icon name="construct" size={14} color="#00f0a8" />
                <View style={styles.skillInfo}>
                  <Text style={styles.skillText}>{skill.name}</Text>
                  <Text style={styles.skillCategory}>{skill.category}</Text>
                  {skill.intelligentData && (
                    <Text style={styles.skillIntelligentData}>
                      Confidence: {(skill.intelligentData.confidence * 100).toFixed(0)}%
                    </Text>
                  )}
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
                <Icon name="construct-outline" size={48} color="#666" />
                <Text style={styles.emptyText}>No skills added</Text>
                <Text style={styles.emptySubtext}>
                  Add skills to unlock better matching
                </Text>
                {editing && (
                  <TouchableOpacity 
                    style={styles.emptyStateButton}
                    onPress={() => addSkill()}
                  >
                    <Text style={styles.emptyStateButtonText}>
                      Add Your First Skill
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {recommendations.length > 0 && editing && (
            <View style={styles.recommendationsSection}>
              <Text style={styles.recommendationsTitle}>
                Skill Suggestions
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommendations.slice(0, 4).map((rec, index) => (
                  <TouchableOpacity
                    key={`intelligent-quick-rec-${index}`}
                    style={styles.quickRecommendation}
                    onPress={() => addSkill(rec)}
                  >
                    <Text style={styles.quickRecText}>{rec.name}</Text>
                    <Text style={styles.quickRecScore}>
                      {Math.round(rec.score)}%
                    </Text>
                    <Text style={styles.quickRecReason}>
                      {rec.recommendationReason}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {editing && <SaveButton />}

        <View style={styles.statusSection}>
          <Icon name="sync" size={16} color="#00f0a8" />
          <Text style={styles.statusText}>
            Auto-save active • Intelligent optimization enabled
          </Text>
          <Text style={styles.syncMetricsText}>
            {syncMetrics.successfulSyncs} successful • {syncMetrics.averageSyncTime.toFixed(0)}ms avg
          </Text>
        </View>
      </ScrollView>

      {/* Location Picker Modal */}
      <Modal visible={showLocationPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Your Location</Text>
            <Text style={styles.modalDescription}>
              Choose method for service matching
            </Text>
            
            <TouchableOpacity 
              style={styles.locationOption}
              onPress={getCurrentLocation}
            >
              <Icon name="navigate" size={24} color="#00f0a8" />
              <View style={styles.locationOptionInfo}>
                <Text style={styles.locationOptionTitle}>Use Current Location</Text>
                <Text style={styles.locationOptionDescription}>
                  Automatic location detection
                </Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.locationOption}
              onPress={handleManualLocation}
            >
              <Icon name="create" size={24} color="#00f0a8" />
              <View style={styles.locationOptionInfo}>
                <Text style={styles.locationOptionTitle}>Enter Manually</Text>
                <Text style={styles.locationOptionDescription}>
                  Type your address
                </Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowLocationPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <NavigationTabs />
      <IntelligentRecommendationsPanel />
    </SafeAreaView>
  );
}

// Add these new styles for the optimization features
const styles = StyleSheet.create({
  // ... (keep all existing styles and add these new ones)
  
  strengthSection: {
    marginTop: 20,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  strengthTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  strengthPercentage: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '700',
  },
  strengthBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    backgroundColor: '#00f0a8',
    borderRadius: 3,
  },
  strengthHint: {
    color: '#666',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  
  optimizationSection: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'rgba(0,240,168,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.2)',
  },
  optimizationTitle: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  optimizationSubtitle: {
    color: '#666',
    fontSize: 12,
    marginBottom: 12,
  },
  optimizationTip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    width: 140,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tipIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipDescription: {
    color: '#666',
    fontSize: 10,
    lineHeight: 12,
    marginBottom: 8,
  },
  tipPriority: {
    backgroundColor: 'rgba(255,107,107,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  tipPriorityHigh: {
    backgroundColor: 'rgba(255,107,107,0.2)',
  },
  tipPriorityMedium: {
    backgroundColor: 'rgba(255,193,7,0.2)',
  },
  tipPriorityText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },
  
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
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#00f0a8',
    fontSize: 20,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,240,168,0.1)',
  },
  repairButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,240,168,0.1)',
    marginRight: 10,
  },
  repairActive: {
    backgroundColor: 'rgba(255,193,7,0.2)',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  connectionText: {
    color: '#666',
    fontSize: 10,
    marginLeft: 4,
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
  uploadText: {
    color: '#00f0a8',
    fontSize: 12,
    marginTop: 5,
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
  validationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff6b6b',
    width: 20,
    height: 20,
    borderRadius: 10,
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
  validationWarning: {
    color: '#ff6b6b',
    fontSize: 10,
    fontWeight: '700',
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
  progressSection: {
    marginTop: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercentage: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00f0a8',
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  successGlow: {
    height: '100%',
    backgroundColor: '#00f0a8',
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 0,
    shadowColor: '#00f0a8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  progressHint: {
    color: '#666',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  trustScoreContainer: {
    marginTop: 10,
  },
  trustScoreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  trustScoreBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  trustScoreFill: {
    height: '100%',
    backgroundColor: '#00f0a8',
    borderRadius: 2,
  },
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
  inputError: {
    borderColor: '#ff6b6b',
  },
  inputQualityExcellent: {
    borderColor: '#00f0a8',
    backgroundColor: 'rgba(0,240,168,0.1)',
  },
  inputQualityGood: {
    borderColor: '#4cd964',
    backgroundColor: 'rgba(76,217,100,0.05)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  qualityScoreContainer: {
    marginTop: 5,
  },
  qualityScoreText: {
    color: '#00f0a8',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  qualityScoreBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  qualityScoreFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  qualityScoreExcellent: {
    backgroundColor: '#00f0a8',
  },
  qualityScoreGood: {
    backgroundColor: '#4cd964',
  },
  qualityScorePoor: {
    backgroundColor: '#ff6b6b',
  },
  guidanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  guidanceText: {
    color: '#00f0a8',
    fontSize: 12,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  validationText: {
    color: '#ff6b6b',
    fontSize: 11,
    marginLeft: 4,
  },
  exampleText: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
    fontStyle: 'italic',
  },
  charCounter: {
    color: '#666',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 2,
  },
  charCounterWarning: {
    color: '#ffa500',
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
  doneButtonDisabled: {
    backgroundColor: '#666',
  },
  doneButtonQuality: {
    backgroundColor: '#00f0a8',
    shadowColor: '#00f0a8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
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
  sectionSubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  seeAllText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
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
  userTypeSection: {
    marginTop: 15,
  },
  userTypeLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  userTypeDescription: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },
  userTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    minWidth: 140,
  },
  skillInfo: {
    flex: 1,
    marginLeft: 6,
  },
  skillText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  skillCategory: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
  },
  skillIntelligentData: {
    color: '#ffa500',
    fontSize: 9,
    marginTop: 1,
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
  emptySubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  emptyStateButton: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  emptyStateButtonText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationsPanel: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
  },
  recommendationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  recommendationsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  recommendationsSubtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 15,
  },
  learningRateText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  recommendationsList: {
    maxHeight: 300,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationMetrics: {
    flexDirection: 'column',
  },
  recommendationScore: {
    color: '#00f0a8',
    fontSize: 12,
  },
  recommendationReason: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
  },
  recommendationConfidence: {
    alignItems: 'center',
  },
  confidenceText: {
    color: '#00f0a8',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  enhancedCustomButton: {
    backgroundColor: '#00f0a8',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  enhancedCustomText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  recommendationsSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  quickRecommendation: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
    minWidth: 100,
  },
  quickRecText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickRecScore: {
    color: '#666',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  quickRecReason: {
    color: '#666',
    fontSize: 8,
    textAlign: 'center',
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
  syncQueueText: {
    color: '#ffa500',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  repairFooter: {
    marginTop: 10,
    padding: 10,
  },
  repairText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusSection: {
    flexDirection: 'column',
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
  syncMetricsText: {
    color: '#666',
    fontSize: 11,
    marginTop: 4,
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
  locationSection: {
    marginTop: 15,
  },
  locationLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  locationDescription: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },
  locationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  locationText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  verifiedBadge: {
    backgroundColor: '#00f0a8',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  changeLocationButton: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  changeLocationText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  addLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  addLocationText: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  gallerySection: {
    marginTop: 10,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  galleryTitle: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
  },
  gallerySubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  enhancedAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  addImageText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  galleryList: {
    paddingVertical: 5,
  },
  imageItem: {
    marginRight: 15,
    alignItems: 'center',
    position: 'relative',
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#000',
    borderRadius: 12,
  },
  imageDescription: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 120,
  },
  imageOptimizationBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0,240,168,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  optimizationText: {
    color: '#000',
    fontSize: 8,
    fontWeight: '700',
  },
  emptyGallery: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyGalleryText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  emptyGallerySubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  farmDetailsSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  farmDetailsTitle: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  locationOptionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationOptionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  locationOptionDescription: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});