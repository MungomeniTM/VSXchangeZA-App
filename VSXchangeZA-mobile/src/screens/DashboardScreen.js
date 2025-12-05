// src/screens/DashboardScreen.js - ADVANCED ENTERPRISE VERSION
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  Pressable,
  Platform,
  RefreshControl,
  Share
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPosts } from "../api";
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// PROFESSIONAL VECTOR ICONS SYSTEM - MATCHING PROFILE SCREEN
const VectorIcons = {
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

  // Additional Professional Icons
  analytics: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 3V19H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M7 14L10 10L14 16L19 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),

  network: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
      <Path d="M19.4 15C17.2 17.2 14.8 19 12 19C9.2 19 6.8 17.2 4.6 15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M19.4 9C17.2 6.8 14.8 5 12 5C9.2 5 6.8 6.8 4.6 9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  skills: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" 
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16 13H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M10 9H9H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  ),

  trending: (color = '#00f0a8', size = 24) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M17 6H23V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )
};

// ADVANCED DATA MANAGEMENT HOOK
const useAdvancedDashboardData = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    profileCompletion: 65,
    networkScore: 240,
    reputation: 85,
    opportunities: 12,
    engagement: 156
  });

  const loadUserData = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('globalUserData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Calculate advanced stats
        const profileScore = calculateProfileScore(parsedUser);
        const networkScore = calculateNetworkScore(parsedUser);
        
        setStats(prev => ({
          ...prev,
          profileCompletion: profileScore,
          networkScore: networkScore
        }));
      }
    } catch (error) {
      console.warn('User data load failed:', error);
    }
  }, []);

  const calculateProfileScore = (userData) => {
    let score = 0;
    const fields = [
      userData.firstName,
      userData.lastName,
      userData.profileImage,
      userData.bio,
      userData.skills?.length > 0,
      userData.location,
      userData.contactInfo?.phone,
      userData.contactInfo?.email
    ];
    
    score = (fields.filter(Boolean).length / fields.length) * 100;
    return Math.min(Math.round(score), 100);
  };

  const calculateNetworkScore = (userData) => {
    const baseScore = (userData.connections || 0) * 10;
    const postScore = (userData.posts || 0) * 5;
    const skillScore = (userData.skills?.length || 0) * 15;
    return baseScore + postScore + skillScore;
  };

  const loadPosts = useCallback(async () => {
    try {
      const response = await fetchPosts();
      const postsData = response?.data?.posts || response?.data || response || [];
      setPosts(Array.isArray(postsData) ? postsData.slice(0, 20) : []);
    } catch (error) {
      console.warn('Posts load failed:', error);
      setPosts([]);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadUserData(), loadPosts()]);
    setLoading(false);
  }, [loadUserData, loadPosts]);

  useEffect(() => {
    refreshAllData();
  }, []);

  return {
    user,
    posts,
    loading,
    stats,
    refreshData: refreshAllData,
    setStats
  };
};

// ADVANCED POST CARD COMPONENT WITH MEMOIZATION
const AdvancedPostCard = React.memo(({ item, onPress, userType }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes || 0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const author = item.author || item.user || {};
  const userName = author.firstName ? `${author.firstName} ${author.lastName || ''}`.trim() : 'Community Member';
  const userRole = author.userType || author.role || 'Member';
  const postText = item.text || item.content || item.body || '';
  const postTime = item.createdAt ? formatTimeAgo(item.createdAt) : 'Recently';

  const handleLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();

    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 100,
      useNativeDriver: true
    }).start(() => {
      setBookmarked(!bookmarked);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      }).start();
    });
  };

  return (
    <Animated.View style={[styles.postCard, { opacity: fadeAnim }]}>
      <View style={styles.postHeader}>
        <View style={styles.postAuthor}>
          {author.profileImage ? (
            <Image source={{ uri: author.profileImage }} style={styles.postAvatar} />
          ) : (
            <View style={styles.postAvatarFallback}>
              <Text style={styles.postAvatarText}>{userName.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.postAuthorInfo}>
            <Text style={styles.postAuthorName}>{userName}</Text>
            <View style={styles.postMeta}>
              <Text style={styles.postTime}>{postTime}</Text>
              <Text style={styles.postRole}>{userRole}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity onPress={handleBookmark} style={styles.bookmarkButton}>
          {bookmarked ? (
            <Icon name="bookmark" size={20} color="#00f0a8" />
          ) : (
            <Icon name="bookmark-outline" size={20} color="#666" />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Text style={styles.postContent} numberOfLines={3}>
          {postText}
        </Text>
        
        {item.media && (
          <Image source={{ uri: item.media }} style={styles.postMedia} resizeMode="cover" />
        )}
      </TouchableOpacity>

      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.postAction}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Icon 
              name={liked ? "heart" : "heart-outline"} 
              size={20} 
              color={liked ? "#ff375f" : "#666"} 
            />
          </Animated.View>
          <Text style={[styles.postActionText, liked && styles.likedText]}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.postAction} activeOpacity={0.7}>
          <Icon name="chatbubble-outline" size={20} color="#666" />
          <Text style={styles.postActionText}>{item.comments || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.postAction} activeOpacity={0.7}>
          <Icon name="share-social-outline" size={20} color="#666" />
          <Text style={styles.postActionText}>{item.shares || 0}</Text>
        </TouchableOpacity>

        {item.category && (
          <View style={styles.postCategory}>
            <Text style={styles.postCategoryText}>{item.category}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
});

// ADVANCED STATS CARD WITH ANIMATIONS
const AdvancedStatsCard = ({ stats, onRefresh }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [animatedStats, setAnimatedStats] = useState(stats);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: stats.profileCompletion,
      duration: 1000,
      useNativeDriver: false
    }).start();
    
    setAnimatedStats(stats);
  }, [stats]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.statsCard}>
      <LinearGradient
        colors={['rgba(0, 240, 168, 0.08)', 'rgba(0, 240, 168, 0.02)']}
        style={styles.statsGradient}
      >
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Performance Metrics</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Icon name="refresh" size={18} color="#00f0a8" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              {VectorIcons.trending('#00f0a8', 20)}
            </View>
            <Text style={styles.statNumber}>{animatedStats.profileCompletion}%</Text>
            <Text style={styles.statLabel}>Profile Complete</Text>
            <View style={styles.progressContainer}>
              <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, styles.networkIcon]}>
              {VectorIcons.network('#1e90ff', 20)}
            </View>
            <Text style={styles.statNumber}>{animatedStats.networkScore}</Text>
            <Text style={styles.statLabel}>Network Score</Text>
            <Text style={styles.statSubtext}>Growing</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, styles.reputationIcon]}>
              <Icon name="star" size={20} color="#FFD700" />
            </View>
            <Text style={styles.statNumber}>{animatedStats.reputation}</Text>
            <Text style={styles.statLabel}>Reputation</Text>
            <View style={styles.ratingContainer}>
              {[1,2,3,4,5].map((star) => (
                <Icon 
                  key={star}
                  name={star <= Math.floor(animatedStats.reputation/20) ? "star" : "star-outline"} 
                  size={12} 
                  color="#FFD700" 
                />
              ))}
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, styles.opportunityIcon]}>
              {VectorIcons.skills('#4CD964', 20)}
            </View>
            <Text style={styles.statNumber}>{animatedStats.opportunities}</Text>
            <Text style={styles.statLabel}>Opportunities</Text>
            <Text style={styles.statSubtext}>Available</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

// ADVANCED QUICK ACTIONS GRID
const AdvancedQuickActions = ({ userType, navigation }) => {
  const actions = useMemo(() => {
    const baseActions = [
      { 
        id: 'create', 
        label: 'Create Post', 
        icon: 'add-circle',
        color: '#00f0a8',
        action: () => navigation.navigate('CreatePost')
      },
      { 
        id: 'discover', 
        label: 'Discover', 
        icon: (color, size) => VectorIcons.search(color, size),
        color: '#1e90ff',
        action: () => navigation.navigate('Discover')
      },
      { 
        id: 'market', 
        label: 'Marketplace', 
        icon: (color, size) => VectorIcons.marketplace(color, size),
        color: '#FF9500',
        action: () => navigation.navigate('Marketplace')
      },
      { 
        id: 'messages', 
        label: 'Messages', 
        icon: 'chatbubbles',
        color: '#FF6B81',
        action: () => navigation.navigate('Messages')
      }
    ];

    // Add role-specific actions
    if (userType === 'skilled') {
      baseActions.push(
        { 
          id: 'skills', 
          label: 'My Skills', 
          icon: (color, size) => VectorIcons.skills(color, size),
          color: '#FFD700',
          action: () => navigation.navigate('Profile', { screen: 'Skills' })
        }
      );
    } else if (userType === 'farmer') {
      baseActions.push(
        { 
          id: 'farm', 
          label: 'Farm Dashboard', 
          icon: 'leaf',
          color: '#4CD964',
          action: () => navigation.navigate('FarmDashboard')
        }
      );
    } else if (userType === 'client') {
      baseActions.push(
        { 
          id: 'projects', 
          label: 'My Projects', 
          icon: 'briefcase',
          color: '#5856D6',
          action: () => navigation.navigate('Projects')
        }
      );
    }

    return baseActions;
  }, [userType, navigation]);

  return (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickAction}
            onPress={action.action}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: `${action.color}20` }]}>
              {typeof action.icon === 'function' ? 
                action.icon(action.color, 24) : 
                <Icon name={action.icon} size={24} color={action.color} />
              }
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// MAIN DASHBOARD COMPONENT
export default function DashboardScreen({ navigation }) {
  const { user, posts, loading, stats, refreshData } = useAdvancedDashboardData();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp'
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  const handlePostPress = useCallback((post) => {
    navigation.navigate('PostDetail', { postId: post.id });
  }, [navigation]);

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
    setUnreadNotifications(0);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('SearchResults', { query: searchQuery });
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
      <LinearGradient
        colors={['#000000', '#0a0a0a']}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>VSXchangeZA</Text>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Connected</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={handleNotificationPress}
            >
              <Icon name="notifications-outline" size={22} color="#00f0a8" />
              {unreadNotifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>{unreadNotifications}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              {user?.profileImage ? (
                <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileInitials}>
                  <Text style={styles.profileInitialsText}>
                    {user?.firstName?.[0]?.toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Welcome back, {user?.firstName || 'Professional'}
          </Text>
          <Text style={styles.welcomeSubtext}>
            {user?.userType === 'skilled' && 'Your vocational expertise is in demand'}
            {user?.userType === 'farmer' && 'Agricultural opportunities await'}
            {user?.userType === 'client' && 'Find skilled professionals for your projects'}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.searchContainer}
          onPress={() => setShowSearch(true)}
          activeOpacity={0.8}
        >
          <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>
            Search skills, services, projects...
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  const renderNavigationTabs = () => (
    <View style={styles.navigationTabs}>
      {[
        { id: 'home', label: 'Home', icon: (color, size) => VectorIcons.home(color, size) },
        { id: 'discover', label: 'Discover', icon: (color, size) => VectorIcons.search(color, size) },
        { id: 'market', label: 'Market', icon: (color, size) => VectorIcons.marketplace(color, size) },
        { id: 'profile', label: 'Profile', icon: (color, size) => VectorIcons.profile(color, size) },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.navTab, activeTab === tab.id && styles.navTabActive]}
          onPress={() => {
            setActiveTab(tab.id);
            if (tab.id === 'profile') navigation.navigate('Profile');
          }}
          activeOpacity={0.7}
        >
          {tab.icon(
            activeTab === tab.id ? '#00f0a8' : '#666',
            24
          )}
          <Text style={[
            styles.navTabText,
            activeTab === tab.id && styles.navTabTextActive
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00f0a8" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#00f0a8']}
            tintColor="#00f0a8"
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <AdvancedStatsCard stats={stats} onRefresh={handleRefresh} />
        
        <AdvancedQuickActions userType={user?.userType} navigation={navigation} />

        <View style={styles.postsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community Feed</Text>
            <TouchableOpacity onPress={handleRefresh}>
              <Icon name="refresh" size={18} color="#00f0a8" />
            </TouchableOpacity>
          </View>

          {posts.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="document-text" size={48} color="#666" />
              <Text style={styles.emptyStateText}>No posts yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Be the first to share in the community
              </Text>
            </View>
          ) : (
            posts.map((post, index) => (
              <AdvancedPostCard
                key={post.id || `post-${index}`}
                item={post}
                onPress={() => handlePostPress(post)}
                userType={user?.userType}
              />
            ))
          )}
        </View>
      </ScrollView>

      {renderNavigationTabs()}

      {/* Search Modal */}
      <Modal
        visible={showSearch}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSearch(false)}
      >
        <View style={styles.searchModal}>
          <View style={styles.searchModalContent}>
            <View style={styles.searchModalHeader}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search skills, services, projects..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity 
                style={styles.searchClose}
                onPress={() => setShowSearch(false)}
              >
                <Icon name="close" size={24} color="#00f0a8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Helper function
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// ADVANCED STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    color: '#00f0a8',
    fontSize: 16,
    marginTop: 16
  },
  header: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  brandText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#00f0a8',
    marginRight: 10
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 240, 168, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00f0a8',
    marginRight: 4
  },
  statusText: {
    color: '#00f0a8',
    fontSize: 10,
    fontWeight: '600'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    marginRight: 12
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ff375f',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700'
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden'
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20
  },
  profileInitials: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileInitialsText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800'
  },
  welcomeSection: {
    marginBottom: 15
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4
  },
  welcomeSubtext: {
    color: '#666',
    fontSize: 14
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  searchIcon: {
    marginRight: 10
  },
  searchPlaceholder: {
    color: '#666',
    fontSize: 16,
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  statsCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 168, 0.1)'
  },
  statsGradient: {
    padding: 20
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  statsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700'
  },
  refreshButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 240, 168, 0.1)'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  statItem: {
    width: '48%',
    marginBottom: 20
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 240, 168, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  networkIcon: {
    backgroundColor: 'rgba(30, 144, 255, 0.1)'
  },
  reputationIcon: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)'
  },
  opportunityIcon: {
    backgroundColor: 'rgba(76, 217, 100, 0.1)'
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4
  },
  statSubtext: {
    color: '#00f0a8',
    fontSize: 10,
    fontWeight: '600'
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00f0a8',
    borderRadius: 2
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 4
  },
  quickActionsContainer: {
    marginHorizontal: 20,
    marginBottom: 20
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  quickAction: {
    width: '48%',
    marginBottom: 12
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  actionLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  postsSection: {
    marginHorizontal: 20,
    marginBottom: 100
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  postCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12
  },
  postAvatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  postAvatarText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800'
  },
  postAuthorInfo: {
    flex: 1
  },
  postAuthorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  postTime: {
    color: '#666',
    fontSize: 12,
    marginRight: 8
  },
  postRole: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600'
  },
  bookmarkButton: {
    padding: 4
  },
  postContent: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12
  },
  postMedia: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)'
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  postActionText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 6
  },
  likedText: {
    color: '#ff375f'
  },
  postCategory: {
    backgroundColor: 'rgba(0, 240, 168, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  postCategoryText: {
    color: '#00f0a8',
    fontSize: 10,
    fontWeight: '600'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8
  },
  emptyStateSubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center'
  },
  navigationTabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 12
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8
  },
  navTabActive: {
    backgroundColor: 'rgba(0, 240, 168, 0.1)',
    borderRadius: 12
  },
  navTabText: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4
  },
  navTabTextActive: {
    color: '#00f0a8'
  },
  searchModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 60 : 40
  },
  searchModalContent: {
    backgroundColor: '#000'
  },
  searchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12
  },
  searchClose: {
    padding: 8,
    marginLeft: 10
  }
});