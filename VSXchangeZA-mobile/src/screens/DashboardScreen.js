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
import VectorIconsShared from '../components/VectorIcons';

const { width, height } = Dimensions.get('window');

// Use centralized vector icons
const VectorIcons = VectorIconsShared;

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
  avatarText: { color: '#000', fontSize: 22, fontWeight: '800' },
  userInfo: { flex: 1 },
  welcomeText: { color: '#666', fontSize: 13, marginBottom: 2 },
  userName: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 2 },
  userRole: { color: '#00f0a8', fontSize: 13, fontWeight: '600' },

  statsCard: { margin: 18, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0, 240, 168, 0.16)' },
  statsTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 10, textAlign: 'center', paddingTop: 16 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 12 },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { color: '#00f0a8', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  statLabel: { color: '#666', fontSize: 12, fontWeight: '600' },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.06)' },
  sparklineContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 12, marginBottom: 10 },
  sparklineText: { color: '#00f0a8', fontSize: 13, fontWeight: '600' },

  section: { marginHorizontal: 18, marginBottom: 22 },
  sectionHeader: { marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 8 },
  sectionSubtitle: { color: '#666', fontSize: 14 },
  refreshButton: { flexDirection: 'row', alignItems: 'center' },
  seeAllText: { color: '#00f0a8', fontSize: 14, fontWeight: '600' },

  recommendationCard: { width: 200, marginRight: 12, borderRadius: 12, overflow: 'hidden' },
  recommendationHeader: { padding: 12 },
  recommendationTitle: { color: '#fff', fontSize: 14, fontWeight: '600', lineHeight: 18 },
  relevanceBadge: { backgroundColor: 'rgba(0,240,168,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 8, alignSelf: 'flex-start' },
  relevanceText: { color: '#00f0a8', fontSize: 10, fontWeight: '700' },
  recommendationType: { color: '#666', fontSize: 12, padding: 12, paddingTop: 0 },

  quickActions: { marginBottom: 16 },
  quickActionItem: { alignItems: 'center', marginRight: 16 },
  actionIcon: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionLabel: { color: '#fff', fontSize: 12, fontWeight: '600', textAlign: 'center' },

  activeFilters: { marginHorizontal: 18, marginBottom: 12 },
  filtersTitle: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  activeFilterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,240,168,0.18)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginRight: 8 },
  activeFilterText: { color: '#00f0a8', fontSize: 12, fontWeight: '600', marginRight: 6 },

  feed: {},

  postCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 12 },
  postHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, padding: 16, paddingBottom: 6 },
  postAvatar: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#00f0a8', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  postAvatarImage: { width: '100%', height: '100%', borderRadius: 12 },
  postAvatarText: { color: '#000', fontSize: 18, fontWeight: '800' },
  postUserInfo: { flex: 1 },
  postUserName: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 2 },
  postTime: { color: '#666', fontSize: 12, marginBottom: 4 },
  postSkills: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  skillTag: { backgroundColor: 'rgba(0,240,168,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginRight: 6, marginTop: 4 },
  skillTagText: { color: '#00f0a8', fontSize: 10, fontWeight: '600' },
  moreSkills: { color: '#666', fontSize: 10, marginTop: 4 },
  postMenu: { padding: 5 },
  postContent: { color: '#fff', fontSize: 15, lineHeight: 20, marginBottom: 12, paddingHorizontal: 16 },
  postMedia: { width: '100%', height: 200, marginBottom: 12 },
  postActions: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12, paddingHorizontal: 12, paddingBottom: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  postAction: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10 },
  postActionText: { color: '#666', fontSize: 14, fontWeight: '600' },
  likedText: { color: '#ff375f' },

  navTabs: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 10, paddingVertical: 10 },
  navTab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 15, position: 'relative' },
  navTabActive: { backgroundColor: 'rgba(0,240,168,0.14)' },
  navTabText: { color: '#666', fontSize: 10, fontWeight: '600', marginTop: 4 },
  navTabTextActive: { color: '#00f0a8' },
  messageBadge: {
    position: 'absolute',
    top: 4,
    right: 20,
    backgroundColor: '#ff375f',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
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