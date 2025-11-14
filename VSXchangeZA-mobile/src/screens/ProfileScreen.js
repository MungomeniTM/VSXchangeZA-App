// src/screens/ProfessionalProfileScreen.js - ENTERPRISE-GRADE PROFESSIONAL PROFILE
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
  Share
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { AppContext } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// ENTERPRISE PROFILE STATE MANAGEMENT
const useProfessionalProfile = (initialState) => {
  const [profile, setProfile] = useState(initialState);
  const [activeTab, setActiveTab] = useState('about');
  const [editing, setEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const updateProfile = useCallback((updates) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const updateService = useCallback((serviceId, updates) => {
    setProfile(prev => ({
      ...prev,
      services: prev.services.map(service => 
        service.id === serviceId ? { ...service, ...updates } : service
      )
    }));
  }, []);

  return {
    profile,
    activeTab,
    setActiveTab,
    editing,
    setEditing,
    imageUploading,
    setImageUploading,
    updateProfile,
    updateService
  };
};

// INTELLIGENT PRICING ENGINE
const usePricingEngine = (userType, experience, rating) => {
  const calculateIntelligentPricing = useCallback((basePrice) => {
    const experienceMultiplier = 1 + (experience * 0.05); // 5% per year
    const ratingMultiplier = 1 + ((rating - 4) * 0.1); // 10% per rating point above 4
    const typeMultiplier = userType === 'skilled' ? 1.2 : 1.0;
    
    return Math.round(basePrice * experienceMultiplier * ratingMultiplier * typeMultiplier);
  }, [userType, experience, rating]);

  const getServiceTiers = useCallback((serviceType) => {
    const basePrices = {
      electrician: { hourly: 45, project: 300 },
      plumbing: { hourly: 40, project: 250 },
      carpentry: { hourly: 35, project: 200 },
      farming: { hourly: 30, project: 150 }
    };

    const base = basePrices[serviceType] || basePrices.electrician;
    
    return {
      hourly: calculateIntelligentPricing(base.hourly),
      halfDay: calculateIntelligentPricing(base.hourly * 4),
      fullDay: calculateIntelligentPricing(base.hourly * 8),
      project: calculateIntelligentPricing(base.project)
    };
  }, [calculateIntelligentPricing]);

  return { getServiceTiers, calculateIntelligentPricing };
};

// AI PROFILE OPTIMIZATION ENGINE
const useProfileOptimization = (profileData) => {
  const [optimizationScore, setOptimizationScore] = useState(0);
  const [improvementTips, setImprovementTips] = useState([]);

  const analyzeProfile = useCallback(() => {
    let score = 0;
    const tips = [];

    // Profile completeness (40 points)
    if (profileData.firstName && profileData.lastName) score += 10;
    if (profileData.profileImage) score += 10;
    if (profileData.bio && profileData.bio.length > 100) score += 10;
    if (profileData.skills.length >= 3) score += 10;

    // Professional metrics (30 points)
    if (profileData.experienceYears >= 3) score += 10;
    if (profileData.rating >= 4.5) score += 10;
    if (profileData.completedProjects >= 50) score += 10;

    // Content quality (30 points)
    if (profileData.portfolio.length >= 5) score += 10;
    if (profileData.services.length >= 2) score += 10;
    if (profileData.certifications.length >= 1) score += 10;

    // Generate improvement tips
    if (!profileData.profileImage) {
      tips.push({
        id: 'add-photo',
        title: 'Add Professional Photo',
        description: 'Increase trust with a professional profile picture',
        priority: 'high',
        impact: 10
      });
    }

    if (profileData.bio?.length < 100) {
      tips.push({
        id: 'enhance-bio',
        title: 'Enhance Your Bio',
        description: 'Write a detailed bio to showcase your expertise',
        priority: 'medium',
        impact: 8
      });
    }

    if (profileData.portfolio.length < 3) {
      tips.push({
        id: 'add-portfolio',
        title: 'Add Portfolio Items',
        description: 'Showcase your work with photos and descriptions',
        priority: 'medium',
        impact: 7
      });
    }

    setOptimizationScore(score);
    setImprovementTips(tips.sort((a, b) => b.impact - a.impact));
  }, [profileData]);

  useEffect(() => {
    analyzeProfile();
  }, [analyzeProfile]);

  return { optimizationScore, improvementTips };
};

// PROFESSIONAL HEADER COMPONENT
const ProfessionalHeader = ({ 
  profile, 
  onEditPress, 
  onSharePress, 
  onMessagePress,
  optimizationScore 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      style={styles.headerGradient}
    >
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Profile Image and Basic Info */}
        <View style={styles.profileMain}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: profile.profileImage || 'https://via.placeholder.com/120' }} 
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
              {optimizationScore >= 80 && (
                <View style={styles.verifiedBadge}>
                  <Icon name="shield-checkmark" size={16} color="#000" />
                </View>
              )}
            </View>
            
            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.experienceYears || 0}</Text>
                <Text style={styles.statLabel}>Years</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.rating || 4.9}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.completedProjects || 0}+</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameSection}>
              <Text style={styles.userName}>
                {profile.firstName} {profile.lastName}
              </Text>
              <Text style={styles.profession}>
                {profile.profession || 'Professional Service Provider'}
              </Text>
              <View style={styles.locationSection}>
                <Icon name="location" size={14} color="#00f0a8" />
                <Text style={styles.locationText}>
                  {profile.location?.address || 'Location not set'}
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={onEditPress}
              >
                <Icon name="create-outline" size={18} color="#00f0a8" />
                <Text style={styles.secondaryButtonText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={onMessagePress}
              >
                <Icon name="chatbubble" size={18} color="#000" />
                <Text style={styles.primaryButtonText}>Message</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.iconButton}
                onPress={onSharePress}
              >
                <Icon name="share-social" size={18} color="#00f0a8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Optimization Score */}
        {optimizationScore < 90 && (
          <View style={styles.optimizationBanner}>
            <Icon name="trending-up" size={16} color="#00f0a8" />
            <Text style={styles.optimizationText}>
              Profile Strength: {optimizationScore}% - Complete your profile for better visibility
            </Text>
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
};

// SERVICE PRICING TIER COMPONENT
const ServiceTier = ({ title, duration, price, description, isPopular, onSelect }) => {
  return (
    <TouchableOpacity 
      style={[styles.tierCard, isPopular && styles.popularTier]}
      onPress={onSelect}
    >
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
        </View>
      )}
      
      <Text style={styles.tierTitle}>{title}</Text>
      <Text style={styles.tierDuration}>{duration}</Text>
      
      <View style={styles.priceSection}>
        <Text style={styles.price}>${price}</Text>
        {duration.includes('Hour') && (
          <Text style={styles.priceUnit}>/hour</Text>
        )}
      </View>
      
      <Text style={styles.tierDescription}>{description}</Text>
      
      <TouchableOpacity style={styles.selectButton}>
        <Text style={styles.selectButtonText}>Select</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// PORTFOLIO GALLERY COMPONENT
const PortfolioGallery = ({ images, onAddImage, onRemoveImage, editable }) => {
  const renderPortfolioItem = ({ item, index }) => (
    <View style={styles.portfolioItem}>
      <Image source={{ uri: item.uri }} style={styles.portfolioImage} />
      {editable && (
        <TouchableOpacity 
          style={styles.removePortfolioButton}
          onPress={() => onRemoveImage(item.id)}
        >
          <Icon name="close-circle" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      )}
      {item.description && (
        <Text style={styles.portfolioDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.portfolioSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Portfolio Gallery</Text>
        {editable && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={onAddImage}
          >
            <Icon name="add" size={20} color="#00f0a8" />
            <Text style={styles.addButtonText}>Add Work</Text>
          </TouchableOpacity>
        )}
      </View>

      {images.length > 0 ? (
        <FlatList
          horizontal
          data={images}
          renderItem={renderPortfolioItem}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.portfolioList}
        />
      ) : (
        <View style={styles.emptyPortfolio}>
          <Icon name="images-outline" size={48} color="#666" />
          <Text style={styles.emptyPortfolioText}>No portfolio items yet</Text>
          <Text style={styles.emptyPortfolioSubtext}>
            Showcase your best work to attract more clients
          </Text>
        </View>
      )}
    </View>
  );
};

// TAB NAVIGATION COMPONENT
const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'about', label: 'About', icon: 'person' },
    { id: 'availability', label: 'Availability', icon: 'calendar' },
    { id: 'experience', label: 'Experience', icon: 'briefcase' },
    { id: 'reviews', label: 'Reviews', icon: 'star' },
    { id: 'portfolio', label: 'Portfolio', icon: 'images' }
  ];

  return (
    <View style={styles.tabsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScrollContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => onTabChange(tab.id)}
          >
            <Icon 
              name={activeTab === tab.id ? tab.icon : `${tab.icon}-outline`} 
              size={16} 
              color={activeTab === tab.id ? '#00f0a8' : '#666'} 
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// MAIN PROFESSIONAL PROFILE SCREEN
export default function ProfessionalProfileScreen({ navigation, route }) {
  const { globalUser, updateGlobalUser } = useContext(AppContext);
  
  // Initialize professional profile state
  const {
    profile,
    activeTab,
    setActiveTab,
    editing,
    setEditing,
    imageUploading,
    setImageUploading,
    updateProfile,
    updateService
  } = useProfessionalProfile({
    firstName: 'James',
    lastName: 'Carter',
    profession: 'Best Electrician',
    profileImage: null,
    bio: 'James Carter is a certified electrician with 8 years of experience. He specializes in residential and commercial wiring, completing numerous projects from home rewiring to large-scale commercial installations.',
    experienceYears: 8,
    rating: 4.9,
    completedProjects: 150,
    location: null,
    skills: ['Electrical Wiring', 'Commercial Installation', 'Residential Repair', 'Safety Inspection'],
    services: [
      {
        id: '1',
        type: 'electrician',
        title: 'Electrical Services',
        description: 'Professional electrical wiring and repair services'
      }
    ],
    portfolio: [],
    certifications: ['Certified Electrician', 'Safety Certified'],
    hourlyRate: 159,
    availability: {
      monday: { available: true, hours: '9:00 AM - 6:00 PM' },
      tuesday: { available: true, hours: '9:00 AM - 6:00 PM' },
      wednesday: { available: true, hours: '9:00 AM - 6:00 PM' },
      thursday: { available: true, hours: '9:00 AM - 6:00 PM' },
      friday: { available: true, hours: '9:00 AM - 5:00 PM' },
      saturday: { available: false, hours: 'Not Available' },
      sunday: { available: false, hours: 'Not Available' }
    },
    isAvailable: true
  });

  const { getServiceTiers } = usePricingEngine(
    'skilled', 
    profile.experienceYears, 
    profile.rating
  );
  
  const { optimizationScore, improvementTips } = useProfileOptimization(profile);

  const serviceTiers = getServiceTiers('electrician');

  // Handler functions
  const handleEditProfile = () => {
    setEditing(!editing);
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Check out ${profile.firstName} ${profile.lastName}'s professional profile!`,
        url: 'https://vsxchangeza.com/profile',
        title: `${profile.firstName} ${profile.lastName}'s Profile`
      });
    } catch (error) {
      console.warn('Share failed:', error);
    }
  };

  const handleMessage = () => {
    navigation.navigate('Messages', { 
      recipient: `${profile.firstName} ${profile.lastName}`,
      profileId: profile.id 
    });
  };

  const handleUploadImage = async (type = 'profile') => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Need camera roll access to upload images');
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
        
        const processedImages = await Promise.all(
          result.assets.map(async (asset) => {
            // Simulate image processing
            await new Promise(resolve => setTimeout(resolve, 500));
            
            return {
              uri: asset.uri,
              id: Date.now().toString(),
              description: '',
              timestamp: new Date().toISOString()
            };
          })
        );

        if (type === 'profile') {
          updateProfile({ profileImage: processedImages[0].uri });
        } else {
          updateProfile({ 
            portfolio: [...profile.portfolio, ...processedImages] 
          });
        }
        
        setImageUploading(false);
        Vibration.vibrate(50);
      }
    } catch (error) {
      setImageUploading(false);
      Alert.alert('Upload Failed', 'Please try again');
    }
  };

  const handleRemovePortfolioImage = (imageId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    updateProfile({
      portfolio: profile.portfolio.filter(img => img.id !== imageId)
    });
  };

  const handleLocationUpdate = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location permission required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address[0] ? `${address[0].city}, ${address[0].region}` : 'Location set',
        timestamp: new Date().toISOString()
      };

      updateProfile({ location: locationData });
    } catch (error) {
      console.warn('Location update failed:', error);
    }
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.bioTitle}>About {profile.firstName} {profile.lastName}</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
            
            <View style={styles.skillsSection}>
              <Text style={styles.skillsTitle}>Skills & Expertise</Text>
              <View style={styles.skillsGrid}>
                {profile.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.certificationsSection}>
              <Text style={styles.certificationsTitle}>Certifications</Text>
              {profile.certifications.map((cert, index) => (
                <View key={index} style={styles.certificationItem}>
                  <Icon name="shield-checkmark" size={16} color="#00f0a8" />
                  <Text style={styles.certificationText}>{cert}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'availability':
        return (
          <View style={styles.tabContent}>
            <View style={styles.availabilityHeader}>
              <Text style={styles.availabilityTitle}>Current Availability</Text>
              <View style={styles.availabilityStatus}>
                <View style={[
                  styles.statusIndicator,
                  profile.isAvailable ? styles.statusAvailable : styles.statusBusy
                ]} />
                <Text style={styles.statusText}>
                  {profile.isAvailable ? 'Available for Work' : 'Currently Busy'}
                </Text>
              </View>
            </View>

            <View style={styles.scheduleSection}>
              {Object.entries(profile.availability).map(([day, schedule]) => (
                <View key={day} style={styles.scheduleItem}>
                  <Text style={styles.dayText}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Text>
                  <Text style={[
                    styles.scheduleText,
                    !schedule.available && styles.scheduleUnavailable
                  ]}>
                    {schedule.hours}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'experience':
        return (
          <View style={styles.tabContent}>
            <View style={styles.experienceStats}>
              <View style={styles.experienceStat}>
                <Text style={styles.experienceStatNumber}>{profile.experienceYears}</Text>
                <Text style={styles.experienceStatLabel}>Years Experience</Text>
              </View>
              <View style={styles.experienceStat}>
                <Text style={styles.experienceStatNumber}>{profile.completedProjects}+</Text>
                <Text style={styles.experienceStatLabel}>Projects Completed</Text>
              </View>
              <View style={styles.experienceStat}>
                <Text style={styles.experienceStatNumber}>{profile.rating}</Text>
                <Text style={styles.experienceStatLabel}>Client Rating</Text>
              </View>
            </View>

            <View style={styles.serviceTiers}>
              <Text style={styles.pricingTitle}>Service Pricing</Text>
              <View style={styles.tiersGrid}>
                <ServiceTier
                  title="Hourly Service"
                  duration="1 Hour"
                  price={serviceTiers.hourly}
                  description="Perfect for small repairs and consultations"
                  onSelect={() => console.log('Hourly selected')}
                />
                <ServiceTier
                  title="Half Day"
                  duration="4 Hours"
                  price={serviceTiers.halfDay}
                  description="Ideal for medium-sized projects"
                  isPopular={true}
                  onSelect={() => console.log('Half day selected')}
                />
                <ServiceTier
                  title="Full Day"
                  duration="8 Hours"
                  price={serviceTiers.fullDay}
                  description="Complete project solutions"
                  onSelect={() => console.log('Full day selected')}
                />
              </View>
            </View>
          </View>
        );

      case 'portfolio':
        return (
          <View style={styles.tabContent}>
            <PortfolioGallery
              images={profile.portfolio}
              onAddImage={() => handleUploadImage('portfolio')}
              onRemoveImage={handleRemovePortfolioImage}
              editable={editing}
            />
          </View>
        );

      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <View style={styles.ratingOverview}>
              <Text style={styles.ratingNumber}>{profile.rating}</Text>
              <View style={styles.ratingStars}>
                {[1,2,3,4,5].map((star) => (
                  <Icon 
                    key={star}
                    name={star <= Math.floor(profile.rating) ? "star" : "star-outline"} 
                    size={20} 
                    color="#FFD700" 
                  />
                ))}
              </View>
              <Text style={styles.ratingCount}>Based on {profile.completedProjects} projects</Text>
            </View>
            
            <View style={styles.reviewsPlaceholder}>
              <Icon name="chatbubble-ellipses" size={48} color="#666" />
              <Text style={styles.reviewsPlaceholderText}>Customer reviews will appear here</Text>
              <Text style={styles.reviewsPlaceholderSubtext}>
                As you complete projects, clients can leave reviews and ratings
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Professional Header */}
      <ProfessionalHeader
        profile={profile}
        onEditPress={handleEditProfile}
        onSharePress={handleShareProfile}
        onMessagePress={handleMessage}
        optimizationScore={optimizationScore}
      />

      {/* Tab Navigation */}
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <ScrollView 
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
        
        {/* Improvement Tips */}
        {improvementTips.length > 0 && optimizationScore < 80 && (
          <View style={styles.improvementSection}>
            <Text style={styles.improvementTitle}>Improve Your Profile</Text>
            {improvementTips.slice(0, 2).map(tip => (
              <View key={tip.id} style={styles.improvementTip}>
                <Icon name="bulb" size={16} color="#00f0a8" />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Loading Overlay */}
      {imageUploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00f0a8" />
          <Text style={styles.loadingText}>Processing Images...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerGradient: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileMain: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatarSection: {
    alignItems: 'center',
    marginRight: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00f0a8',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00f0a8',
    borderWidth: 2,
    borderColor: '#000',
  },
  verifiedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#00f0a8',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 10,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 5,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'space-between',
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
    marginBottom: 8,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00f0a8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#00f0a8',
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#00f0a8',
  },
  optimizationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  optimizationText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  tabsContainer: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tabsScrollContent: {
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00f0a8',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#00f0a8',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  tabContent: {
    marginBottom: 20,
  },
  bioTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  bioText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  skillsSection: {
    marginBottom: 20,
  },
  skillsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  skillText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
  },
  certificationsSection: {
    marginBottom: 20,
  },
  certificationsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  certificationText: {
    color: '#ccc',
    fontSize: 14,
    marginLeft: 8,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  availabilityTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  availabilityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusAvailable: {
    backgroundColor: '#00f0a8',
  },
  statusBusy: {
    backgroundColor: '#ff6b6b',
  },
  statusText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '600',
  },
  scheduleSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  dayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  scheduleText: {
    color: '#00f0a8',
    fontSize: 14,
  },
  scheduleUnavailable: {
    color: '#666',
  },
  experienceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  experienceStat: {
    alignItems: 'center',
  },
  experienceStatNumber: {
    color: '#00f0a8',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  experienceStatLabel: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  serviceTiers: {
    marginBottom: 20,
  },
  pricingTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  tiersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tierCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  popularTier: {
    borderColor: '#00f0a8',
    backgroundColor: 'rgba(0,240,168,0.05)',
    transform: [{ scale: 1.05 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#00f0a8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularBadgeText: {
    color: '#000',
    fontSize: 8,
    fontWeight: '900',
  },
  tierTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },
  tierDuration: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  price: {
    color: '#00f0a8',
    fontSize: 24,
    fontWeight: '800',
    marginRight: 4,
  },
  priceUnit: {
    color: '#666',
    fontSize: 12,
  },
  tierDescription: {
    color: '#ccc',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 12,
  },
  selectButton: {
    backgroundColor: '#00f0a8',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  portfolioSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  addButtonText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  portfolioList: {
    paddingVertical: 5,
  },
  portfolioItem: {
    marginRight: 15,
    width: 120,
  },
  portfolioImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  removePortfolioButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  portfolioDescription: {
    color: '#ccc',
    fontSize: 10,
    lineHeight: 12,
  },
  emptyPortfolio: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPortfolioText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyPortfolioSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  ratingOverview: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  ratingNumber: {
    color: '#00f0a8',
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 10,
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ratingCount: {
    color: '#666',
    fontSize: 14,
  },
  reviewsPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  reviewsPlaceholderText: {
    color: '#666',
    fontSize: 16,
    marginTop: 12,
    fontStyle: 'italic',
  },
  reviewsPlaceholderSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  improvementSection: {
    backgroundColor: 'rgba(0,240,168,0.05)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.2)',
  },
  improvementTitle: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  improvementTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tipContent: {
    flex: 1,
    marginLeft: 10,
  },
  tipTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  tipDescription: {
    color: '#ccc',
    fontSize: 12,
    lineHeight: 14,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#00f0a8',
    fontSize: 16,
    marginTop: 10,
  },
});

