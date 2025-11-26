// src/screens/DashboardScreen.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
  Image,
  Alert,
  RefreshControl,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import Svg, { Path, Circle, Rect, G, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// PERFECTLY MATCHING VECTOR ICONS - SAME AS PROFILE SCREEN
const VectorIcons = {
  // Bottom Navigation Icons - Exactly matching ProfileScreen
  home: (color = '#00f0a8', size = 28) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  
  search: (color = '#666', size = 28) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2"/>
      <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),
  
  marketplace: (color = '#666', size = 28) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.1 15.9 4.5 17 5.4 17H17M17 17C16.4696 17 15.9609 17.2107 15.5858 17.5858C15.2107 17.9609 15 18.4696 15 19C15 19.5304 15.2107 20.0391 15.5858 20.4142C15.9609 20.7893 16.4696 21 17 21C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19C19 18.4696 18.7893 17.9609 18.4142 17.5858C17.9609 17.2107 17.5304 17 17 17ZM9 19C9 19.5304 8.78929 20.0391 8.41421 20.4142C8.03914 20.7893 7.53043 21 7 21C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19C5 18.4696 5.21071 17.9609 5.58579 17.5858C5.96086 17.2107 6.46957 17 7 17C7.53043 17 8.03914 17.2107 8.41421 17.5858C8.78929 17.9609 9 18.4696 9 19Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  
  profile: (color = '#666', size = 28) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  // Dashboard Specific Icons
  calendar: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16 2V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  message: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  earnings: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 1V23" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" 
        stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  projects: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M16 13H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M10 9H9H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  // Professional Category Icons - Matching ProfileScreen
  electrician: (color = '#00f0a8', size = 40) => (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M13 22L20 13L27 22L24 24L25 28L15 28L16 24L13 22Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M20 13V7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M20 31V28" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  farmer: (color = '#4CD964', size = 40) => (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M12 28L15 25L18 28L22 24L25 27L28 24" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M8 16C8 16 10 14 12 16C14 18 16 16 16 16C16 16 18 14 20 16C22 18 24 16 24 16C24 16 26 14 28 16C30 18 32 16 32 16V28C32 28.5304 31.7893 29.0391 31.4142 29.4142C31.0391 29.7893 30.5304 30 30 30H10C9.46957 30 8.96086 29.7893 8.58579 29.4142C8.21071 29.0391 8 28.5304 8 28V16Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M8 20H32" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  client: (color = '#007AFF', size = 40) => (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M28 12H12C10.8954 12 10 12.8954 10 14V26C10 27.1046 10.8954 28 12 28H28C29.1046 28 30 27.1046 30 26V14C30 12.8954 29.1046 12 28 12Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M22 12V10C22 8.89543 21.1046 8 20 8C18.8954 8 18 8.89543 18 10V12" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M15 18H25" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M15 22H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  )
};

// ENHANCED DASHBOARD COMPONENTS
const StatCard = ({ icon, title, value, subtitle, color = '#00f0a8', onPress }) => (
  <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={0.7}>
    <LinearGradient
      colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
      style={[styles.statGradient, { borderLeftColor: color }]}
    >
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          {icon}
        </View>
        <View style={styles.statTexts}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const QuickAction = ({ icon, title, description, color = '#00f0a8', onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.actionIcon, { backgroundColor: color }]}>
      {icon}
    </View>
    <View style={styles.actionTexts}>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionDescription}>{description}</Text>
    </View>
    <Icon name="chevron-forward" size={20} color="#666" />
  </TouchableOpacity>
);

const ProjectCard = ({ title, status, budget, timeline, client, onPress }) => (
  <TouchableOpacity style={styles.projectCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.projectHeader}>
      <Text style={styles.projectTitle}>{title}</Text>
      <View style={[styles.statusBadge, styles[`status${status}`]]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
    <View style={styles.projectDetails}>
      <View style={styles.projectDetail}>
        <Icon name="cash-outline" size={16} color="#00f0a8" />
        <Text style={styles.projectDetailText}>${budget}</Text>
      </View>
      <View style={styles.projectDetail}>
        <Icon name="calendar-outline" size={16} color="#00f0a8" />
        <Text style={styles.projectDetailText}>{timeline}</Text>
      </View>
    </View>
    <View style={styles.projectFooter}>
      <Text style={styles.clientText}>{client}</Text>
      <Text style={styles.viewDetailsText}>View Details →</Text>
    </View>
  </TouchableOpacity>
);

const ServiceCard = ({ icon, title, description, price, rating, onPress }) => (
  <TouchableOpacity style={styles.serviceCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.serviceHeader}>
      {icon}
      <View style={styles.serviceTexts}>
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceDescription}>{description}</Text>
      </View>
    </View>
    <View style={styles.serviceFooter}>
      <View style={styles.priceRating}>
        <Text style={styles.servicePrice}>${price}/hr</Text>
        <View style={styles.rating}>
          <Icon name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookButton} activeOpacity={0.7}>
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

// MAIN DASHBOARD SCREEN
const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Mock data - In real app, this would come from your backend
  const dashboardData = {
    stats: {
      completedProjects: 24,
      ongoingProjects: 3,
      totalEarnings: 12540,
      clientReviews: 18
    },
    quickActions: [
      {
        id: 1,
        title: 'Update Profile',
        description: 'Complete your professional profile',
        icon: <Icon name="person" size={24} color="#000" />,
        color: '#00f0a8',
        screen: 'AdvancedEnterprisePlatform'
      },
      {
        id: 2,
        title: 'Post Service',
        description: 'List your services',
        icon: <Icon name="add-circle" size={24} color="#000" />,
        color: '#007AFF',
        screen: 'Services'
      },
      {
        id: 3,
        title: 'View Messages',
        description: 'Check your conversations',
        icon: VectorIcons.message('#000', 24),
        color: '#4CD964',
        screen: 'Messages'
      },
      {
        id: 4,
        title: 'Schedule',
        description: 'Manage your calendar',
        icon: VectorIcons.calendar('#000', 24),
        color: '#FF6B6B',
        screen: 'Schedule'
      }
    ],
    recentProjects: [
      {
        id: 1,
        title: 'Home Electrical Wiring',
        status: 'Active',
        budget: '2,500',
        timeline: '2 weeks',
        client: 'Sarah Johnson'
      },
      {
        id: 2,
        title: 'Office Renovation',
        status: 'Completed',
        budget: '15,000',
        timeline: '6 weeks',
        client: 'TechCorp Inc.'
      },
      {
        id: 3,
        title: 'Emergency Repair',
        status: 'Pending',
        budget: '850',
        timeline: '2 days',
        client: 'Mike Wilson'
      }
    ],
    recommendedServices: [
      {
        id: 1,
        title: 'Electrical Installation',
        description: 'Professional wiring and installation',
        price: 85,
        rating: 4.8,
        icon: VectorIcons.electrician('#00f0a8', 32)
      },
      {
        id: 2,
        title: 'Farm Equipment Repair',
        description: 'Agricultural machinery maintenance',
        price: 65,
        rating: 4.6,
        icon: VectorIcons.farmer('#4CD964', 32)
      },
      {
        id: 3,
        title: 'Project Consultation',
        description: 'Professional project planning',
        price: 120,
        rating: 4.9,
        icon: VectorIcons.client('#007AFF', 32)
      }
    ]
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleStatPress = (stat) => {
    Alert.alert('Stat Details', `Viewing details for: ${stat}`);
  };

  const handleQuickAction = (action) => {
    if (action.screen) {
      navigation.navigate(action.screen);
    }
  };

  const handleProjectPress = (project) => {
    Alert.alert('Project Details', `Opening: ${project.title}`);
  };

  const handleServicePress = (service) => {
    Alert.alert('Service Booking', `Booking: ${service.title}`);
  };

  const navigateToProfile = () => {
    navigation.navigate('AdvancedEnterprisePlatform');
  };

  // Header animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp'
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp'
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }]
          }
        ]}
      >
        <LinearGradient
          colors={['#000000', '#1a1a1a']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <View>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.userName}>
                  {user?.displayName || 'James Carter'}
                </Text>
                <Text style={styles.userRole}>
                  {user?.userType === 'skilled' ? 'Professional Electrician' : 
                   user?.userType === 'farmer' ? 'Agricultural Expert' : 
                   'Project Client'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={navigateToProfile}
                activeOpacity={0.7}
              >
                {user?.profileImage ? (
                  <Image 
                    source={{ uri: user.profileImage }} 
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <Icon name="person" size={20} color="#666" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Stats Overview */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.statsScroll}
              contentContainerStyle={styles.statsScrollContent}
            >
              <StatCard
                icon={VectorIcons.projects('#000', 20)}
                title="Completed Projects"
                value={dashboardData.stats.completedProjects}
                subtitle="This month"
                color="#00f0a8"
                onPress={() => handleStatPress('Completed Projects')}
              />
              <StatCard
                icon={VectorIcons.calendar('#000', 20)}
                title="Ongoing Projects"
                value={dashboardData.stats.ongoingProjects}
                subtitle="Active now"
                color="#007AFF"
                onPress={() => handleStatPress('Ongoing Projects')}
              />
              <StatCard
                icon={VectorIcons.earnings('#000', 20)}
                title="Total Earnings"
                value={`$${dashboardData.stats.totalEarnings.toLocaleString()}`}
                subtitle="Lifetime"
                color="#4CD964"
                onPress={() => handleStatPress('Total Earnings')}
              />
              <StatCard
                icon={VectorIcons.message('#000', 20)}
                title="Client Reviews"
                value={dashboardData.stats.clientReviews}
                subtitle="4.9★ average"
                color="#FF6B6B"
                onPress={() => handleStatPress('Client Reviews')}
              />
            </ScrollView>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00f0a8']}
            tintColor="#00f0a8"
          />
        }
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionSubtitle}>Manage your account</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            {dashboardData.quickActions.map((action) => (
              <QuickAction
                key={action.id}
                icon={action.icon}
                title={action.title}
                description={action.description}
                color={action.color}
                onPress={() => handleQuickAction(action)}
              />
            ))}
          </View>
        </View>

        {/* Recent Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Projects</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.projectsScroll}
            contentContainerStyle={styles.projectsScrollContent}
          >
            {dashboardData.recentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                status={project.status}
                budget={project.budget}
                timeline={project.timeline}
                client={project.client}
                onPress={() => handleProjectPress(project)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recommended Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Services</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>Browse All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.servicesGrid}>
            {dashboardData.recommendedServices.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                description={service.description}
                price={service.price}
                rating={service.rating}
                onPress={() => handleServicePress(service)}
              />
            ))}
          </View>
        </View>

        {/* Empty space for bottom navigation */}
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        {[
          { id: 'home', label: 'Home', icon: VectorIcons.home },
          { id: 'search', label: 'Discover', icon: VectorIcons.search },
          { id: 'marketplace', label: 'Market', icon: VectorIcons.marketplace },
          { id: 'profile', label: 'Profile', icon: VectorIcons.profile }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.navItem,
              activeTab === tab.id && styles.navItemActive
            ]}
            onPress={() => {
              if (tab.id === 'profile') {
                navigation.navigate('AdvancedEnterprisePlatform');
              } else {
                setActiveTab(tab.id);
              }
            }}
            activeOpacity={0.7}
          >
            {tab.icon(
              activeTab === tab.id ? '#00f0a8' : '#666',
              24
            )}
            <Text style={[
              styles.navLabel,
              activeTab === tab.id && styles.navLabelActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  welcomeText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  userRole: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00f0a8',
  },
  statsScroll: {
    marginHorizontal: -20,
  },
  statsScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    width: 160,
    marginRight: 12,
  },
  statGradient: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statTexts: {
    flex: 1,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  statTitle: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  statSubtitle: {
    color: '#666',
    fontSize: 10,
  },
  content: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 180 : 160,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#666',
    fontSize: 12,
  },
  seeAllText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionTexts: {
    flex: 1,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionDescription: {
    color: '#666',
    fontSize: 12,
  },
  projectsScroll: {
    marginHorizontal: -20,
  },
  projectsScrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  projectCard: {
    width: 280,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: 'rgba(0,240,168,0.2)',
  },
  statusCompleted: {
    backgroundColor: 'rgba(0,122,255,0.2)',
  },
  statusPending: {
    backgroundColor: 'rgba(255,214,0,0.2)',
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  projectDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  projectDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  projectDetailText: {
    color: '#fff',
    fontSize: 12,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientText: {
    color: '#666',
    fontSize: 12,
  },
  viewDetailsText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
  },
  servicesGrid: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceTexts: {
    flex: 1,
    marginLeft: 12,
  },
  serviceTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  serviceDescription: {
    color: '#666',
    fontSize: 12,
    lineHeight: 16,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  servicePrice: {
    color: '#00f0a8',
    fontSize: 18,
    fontWeight: '800',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#00f0a8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 80,
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: 'rgba(0,240,168,0.2)',
  },
  navLabel: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
  },
  navLabelActive: {
    color: '#00f0a8',
  },
});

export default DashboardScreen;