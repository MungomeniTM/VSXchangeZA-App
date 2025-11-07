// src/screens/DashboardScreen.js - ADVANCED PROFESSIONAL VERSION
import React, { useEffect, useState, useRef, useCallback, useMemo, useContext } from "react";
import {
  View,
  Text,
  FlatList,
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
  Share,
  LayoutAnimation
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPosts } from "../api";
import { AppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Professional Gradient Component
const ProfessionalGradient = ({ colors, style, children }) => (
  <View style={[style, { backgroundColor: colors[0], overflow: 'hidden' }]}>
    {children}
  </View>
);

// AI Recommendation Engine
const useAIRecommendations = (user, posts) => {
  const [recommendations, setRecommendations] = useState([]);

  const generateRecommendations = useCallback(() => {
    if (!user || !posts.length) return [];

    const userSkills = user.skills || [];
    const userType = user.userType || 'skilled';
    
    const scoredPosts = posts.map(post => {
      let score = 0;
      
      // Skill-based matching
      if (post.skills && userSkills.length) {
        const matchingSkills = post.skills.filter(skill => 
          userSkills.some(userSkill => 
            userSkill.name?.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.name?.toLowerCase())
          )
        );
        score += matchingSkills.length * 10;
      }

      // Location-based matching
      if (user.location && post.location) {
        score += 5;
      }

      // User type optimization
      if (userType === 'farmer' && post.type === 'service_offer') score += 15;
      if (userType === 'client' && post.type === 'service_request') score += 15;
      if (userType === 'skilled' && post.type === 'job_opportunity') score += 15;

      // Recency bonus
      const postDate = new Date(post.createdAt || post.timestamp);
      const daysAgo = (Date.now() - postDate.getTime()) / (1000 * 3600 * 24);
      if (daysAgo < 7) score += 10 - daysAgo;

      return { ...post, relevanceScore: score };
    });

    return scoredPosts
      .filter(post => post.relevanceScore > 5)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);
  }, [user, posts]);

  useEffect(() => {
    const newRecs = generateRecommendations();
    setRecommendations(newRecs);
  }, [generateRecommendations]);

  return recommendations;
};

export default function DashboardScreen({ navigation }) {
  // Global State Integration
  const { globalUser, posts: contextPosts, addPost, updateGlobalUser } = useContext(AppContext);
  
  // Data + UI state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreOpen, setExploreOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // AI Recommendations
  const aiRecommendations = useAIRecommendations(user, posts);

  // Anim values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const sheetAnim = useRef(new Animated.Value(height)).current;
  const createMenuAnim = useRef(new Animated.Value(0)).current;

  // Enhanced Orb animations
  const orbScale = useRef(new Animated.Value(1)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;

  // Professional Navigation Handler
  const handleNavigation = useCallback((screenName, params = {}) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const navigationPaths = {
      feed: () => setActiveTab('feed'),
      explore: () => setExploreOpen(true),
      create: () => setShowCreateMenu(true),
      messages: () => navigation?.navigate?.('Messages'),
      profile: () => navigation?.navigate?.('Profile', { 
        userId: user?.id
      }),
      analytics: () => navigation?.navigate?.('Analytics'),
      network: () => navigation?.navigate?.('Network'),
      farms: () => navigation?.navigate?.('Farms'),
      services: () => navigation?.navigate?.('Services'),
      notifications: () => navigation?.navigate?.('Notifications'),
    };

    const navigationHandler = navigationPaths[screenName];
    if (navigationHandler) {
      navigationHandler();
    } else if (navigation?.navigate) {
      navigation.navigate(screenName, params);
    }
  }, [navigation, user]);

  // Animation Orchestration
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    const pulsate = Animated.loop(
      Animated.sequence([
        Animated.timing(orbScale, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(orbScale, { toValue: 0.96, duration: 1200, useNativeDriver: true }),
      ]),
      { iterations: -1 }
    );
    pulsate.start();

    return () => {
      [orbScale, rippleScale, rippleOpacity].forEach(anim => anim.stopAnimation());
    };
  }, []);

  // Create Menu Animation
  useEffect(() => {
    Animated.spring(createMenuAnim, {
      toValue: showCreateMenu ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [showCreateMenu]);

  // Sheet Animation
  useEffect(() => {
    Animated.timing(sheetAnim, { 
      toValue: exploreOpen ? 0 : height, 
      duration: 340, 
      useNativeDriver: true 
    }).start();
  }, [exploreOpen]);

  // Enhanced Data Management
  const loadUserData = useCallback(async () => {
    try {
      const [userData, globalData] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('globalUserData')
      ]);
      
      if (userData) {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        updateGlobalUser(userObj);
      }
      
      if (globalData) {
        const globalObj = JSON.parse(globalData);
        setUser(prev => ({ ...prev, ...globalObj }));
      }
    } catch (error) {
      console.warn('Failed to load user data:', error);
    }
  }, [updateGlobalUser]);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPosts();
      const postsData = res?.data?.posts || res?.data || res || [];
      const formattedPosts = Array.isArray(postsData) ? postsData.map(post => ({
        ...post,
        author: post.user || globalUser || {
          firstName: user?.firstName,
          lastName: user?.lastName,
          profileImage: user?.profileImage,
          userType: user?.userType,
          skills: user?.skills || []
        }
      })) : [];
      
      setPosts(formattedPosts);
    } catch (err) {
      console.warn("Fetch posts failed:", err);
      // Fallback to context posts
      if (contextPosts.length > 0) {
        setPosts(contextPosts);
      }
    } finally {
      setLoading(false);
    }
  }, [globalUser, user, contextPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadUserData(), loadPosts()]);
    setRefreshing(false);
  }, [loadUserData, loadPosts]);

  useEffect(() => {
    loadUserData();
    loadPosts();
  }, [loadUserData, loadPosts]);

  // Enhanced Post Card with Global User Data
  const PostCard = React.memo(({ item }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(item.approvals || item.likes || 0);
    const [bookmarked, setBookmarked] = useState(false);
    
    const author = item.author || item.user || globalUser || {};
    const userName = author.firstName ? `${author.firstName} ${author.lastName || ''}`.trim() : 'Community Member';
    const userRole = author.userType || 'Member';
    const userInitial = userName.charAt(0).toUpperCase();
    const postText = item.text || item.content || item.body || '';
    const postTime = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently';
    const comments = item.comments?.length || 0;
    const shares = item.shares || 0;

    const handleLike = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
    };

    const handleBookmark = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setBookmarked(!bookmarked);
    };

    const handleShare = async () => {
      try {
        await Share.share({
          message: `Check out this post from VSXchangeZA: ${postText}`,
          url: 'https://vsxchangeza.com',
        });
      } catch (error) {
        console.warn('Share failed:', error);
      }
    };

    return (
      <Animated.View style={[styles.postCard, { opacity: fadeAnim }]}>
        <ProfessionalGradient colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}>
          <View style={styles.postHeader}>
            <View style={styles.postAvatar}>
              {author.profileImage ? (
                <Image source={{ uri: author.profileImage }} style={styles.postAvatarImage} />
              ) : (
                <Text style={styles.postAvatarText}>{userInitial}</Text>
              )}
            </View>
            <View style={styles.postUserInfo}>
              <Text style={styles.postUserName} numberOfLines={1}>{userName}</Text>
              <Text style={styles.postTime}>{postTime} • {userRole}</Text>
              {author.skills?.length > 0 && (
                <View style={styles.postSkills}>
                  {author.skills.slice(0, 2).map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                      <Text style={styles.skillTagText}>{skill.name || skill}</Text>
                    </View>
                  ))}
                  {author.skills.length > 2 && (
                    <Text style={styles.moreSkills}>+{author.skills.length - 2} more</Text>
                  )}
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.postMenu} onPress={handleBookmark}>
              <Icon 
                name={bookmarked ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={bookmarked ? "#00f0a8" : "#666"} 
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.postContent}>{postText}</Text>

          {item.media && (
            <Image source={{ uri: item.media }} style={styles.postMedia} resizeMode="cover" />
          )}

          <View style={styles.postActions}>
            <TouchableOpacity style={styles.postAction} onPress={handleLike}>
              <Icon 
                name={liked ? "heart" : "heart-outline"} 
                size={20} 
                color={liked ? "#ff375f" : "#666"} 
              />
              <Text style={[styles.postActionText, liked && styles.likedText]}>{likeCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Icon name="chatbubble-outline" size={20} color="#666" />
              <Text style={styles.postActionText}>{comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction} onPress={handleShare}>
              <Icon name="share-social-outline" size={20} color="#666" />
              <Text style={styles.postActionText}>{shares}</Text>
            </TouchableOpacity>
          </View>
        </ProfessionalGradient>
      </Animated.View>
    );
  });

  // Enhanced Header with Global User Data
  const ProfessionalHeader = () => (
    <ProfessionalGradient colors={['#000000', '#0f1116']} style={styles.professionalHeader}>
      <View style={styles.headerTop}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>VSXchangeZA</Text>
          <View style={styles.glowDot} />
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => handleNavigation('notifications')}
          >
            <Icon name="notifications-outline" size={20} color="#00f0a8" />
            {notifications.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={logout}>
            <Icon name="log-out-outline" size={20} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.userWelcome}>
        <View style={styles.avatar}>
          {globalUser?.profileImage ? (
            <Image source={{ uri: globalUser.profileImage }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {globalUser?.firstName?.[0]?.toUpperCase() || user?.firstName?.[0]?.toUpperCase() || 'U'}
            </Text>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>
            {globalUser?.firstName || user?.firstName || user?.username || 'User'}
          </Text>
          <Text style={styles.userRole}>
            {globalUser?.userType || user?.role || 'Member'} • 
            {globalUser?.skills?.length || user?.skills?.length || 0} skills
          </Text>
        </View>
      </View>
    </ProfessionalGradient>
  );

  // Enhanced Stats with Real Data
  const StatsCard = () => (
    <Animated.View style={[styles.statsCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <ProfessionalGradient colors={['rgba(30,144,255,0.12)', 'rgba(0,240,168,0.12)']}>
        <Text style={styles.statsTitle}>Platform Analytics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{posts.length}</Text>
            <Text style={styles.statLabel}>Live Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{globalUser?.skills?.length || 0}</Text>
            <Text style={styles.statLabel}>Your Skills</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{aiRecommendations.length}</Text>
            <Text style={styles.statLabel}>AI Matches</Text>
          </View>
        </View>

        <View style={styles.sparklineContainer}>
          <Icon name="trending-up" size={16} color="#00f0a8" />
          <Text style={styles.sparklineText}>
            {aiRecommendations.length > 0 ? 'Personalized matches available' : 'Building your network...'}
          </Text>
        </View>
      </ProfessionalGradient>
    </Animated.View>
  );

  // AI Recommendations Section
  const AIRecommendationsSection = () => {
    if (aiRecommendations.length === 0) return null;

    return (
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Icon name="sparkles" size={20} color="#00f0a8" />
            <Text style={styles.sectionTitle}>AI Recommendations</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Curated based on your profile</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {aiRecommendations.map((rec, index) => (
            <TouchableOpacity key={rec.id || index} style={styles.recommendationCard}>
              <ProfessionalGradient colors={['rgba(0,240,168,0.1)', 'rgba(30,144,255,0.1)']}>
                <View style={styles.recommendationHeader}>
                  <Text style={styles.recommendationTitle} numberOfLines={2}>
                    {rec.text?.substring(0, 60)}...
                  </Text>
                  <View style={styles.relevanceBadge}>
                    <Text style={styles.relevanceText}>{Math.round(rec.relevanceScore)}% match</Text>
                  </View>
                </View>
                <Text style={styles.recommendationType}>
                  {rec.type === 'service_offer' ? 'Service Offer' : 
                   rec.type === 'service_request' ? 'Service Needed' : 
                   'Opportunity'}
                </Text>
              </ProfessionalGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  // Enhanced Quick Actions
  const QuickActions = () => (
    <Animated.View style={[styles.quickActions, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { 
            icon: 'add-circle', 
            label: 'Create', 
            color: '#00f0a8', 
            onPress: () => setShowCreateMenu(true)
          },
          { icon: 'analytics', label: 'Analytics', color: '#1e90ff', onPress: () => handleNavigation('analytics') },
          { icon: 'people', label: 'Network', color: '#ff6b81', onPress: () => handleNavigation('network') },
          { icon: 'leaf', label: 'My Farm', color: '#a55eea', onPress: () => handleNavigation('farms') },
          { icon: 'construct', label: 'Services', color: '#fed330', onPress: () => handleNavigation('services') },
          { icon: 'chatbubbles', label: 'Messages', color: '#00d2d3', onPress: () => handleNavigation('messages') },
        ].map((action, index) => (
          <TouchableOpacity key={index} style={styles.quickActionItem} onPress={action.onPress}>
            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
              <Icon name={action.icon} size={22} color="#000" />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // Create Post Menu
  const CreatePostMenu = () => (
    <Modal visible={showCreateMenu} transparent animationType="fade">
      <Pressable style={styles.createMenuOverlay} onPress={() => setShowCreateMenu(false)}>
        <Animated.View 
          style={[
            styles.createMenu, 
            { 
              transform: [
                { scale: createMenuAnim },
                { translateY: createMenuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}
              ]
            }
          ]}
        >
          <Text style={styles.createMenuTitle}>Create New</Text>
          
          {[
            { icon: 'document-text', label: 'Post', color: '#00f0a8', action: () => navigation.navigate('CreatePost') },
            { icon: 'camera', label: 'Photo', color: '#1e90ff', action: () => Alert.alert('Coming Soon', 'Photo upload feature') },
            { icon: 'videocam', label: 'Video', color: '#ff6b81', action: () => Alert.alert('Coming Soon', 'Video upload feature') },
            { icon: 'megaphone', label: 'Service Offer', color: '#a55eea', action: () => navigation.navigate('CreateService') },
            { icon: 'help-circle', label: 'Service Request', color: '#fed330', action: () => navigation.navigate('CreateRequest') },
          ].map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.createMenuItem}
              onPress={() => {
                setShowCreateMenu(false);
                setTimeout(item.action, 300);
              }}
            >
              <View style={[styles.createMenuIcon, { backgroundColor: item.color }]}>
                <Icon name={item.icon} size={22} color="#000" />
              </View>
              <Text style={styles.createMenuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </Pressable>
    </Modal>
  );

  // Enhanced Navigation Tabs
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
          onPress={() => handleNavigation(tab.id)}
        >
          <Icon 
            name={activeTab === tab.id ? tab.icon : `${tab.icon}-outline`} 
            size={24} 
            color={activeTab === tab.id ? '#00f0a8' : '#666'} 
          />
          <Text style={[styles.navTabText, activeTab === tab.id && styles.navTabTextActive]}>{tab.label}</Text>
          {tab.id === 'messages' && unreadMessages > 0 && (
            <View style={styles.messageBadge}>
              <Text style={styles.messageBadgeText}>{unreadMessages}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  // Enhanced Explore Sheet
  const ExploreSheet = () => (
    <Modal visible={exploreOpen} transparent animationType="none" onRequestClose={() => setExploreOpen(false)}>
      <View style={styles.sheetOverlay}>
        <Pressable style={styles.overlayTouchable} onPress={() => setExploreOpen(false)} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetAnim }] }]}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Advanced Search</Text>
            <TouchableOpacity onPress={() => setExploreOpen(false)}>
              <Icon name="close" size={24} color="#00f0a8" />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetContent}>
            <Text style={styles.sheetSubtitle}>Find skills and connect with experts</Text>

            <View style={styles.searchContainer}>
              <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
              <TextInput 
                style={styles.searchInput} 
                placeholder="Search skills, services, or users..." 
                placeholderTextColor="#666" 
                value={searchQuery} 
                onChangeText={setSearchQuery} 
              />
            </View>

            <View style={styles.skillsGrid}>
              {['Carpentry', 'Electrical', 'Plumbing', 'Farming', 'Tech', 'Design', 'Marketing', 'Consulting', 'Mechanical', 'Construction'].map((skill) => {
                const active = activeFilters.has(skill);
                return (
                  <TouchableOpacity
                    key={skill}
                    style={[styles.skillChip, active && styles.skillChipActive]}
                    onPress={() => {
                      setActiveFilters(prev => {
                        const next = new Set(prev);
                        if (next.has(skill)) next.delete(skill);
                        else next.add(skill);
                        return next;
                      });
                    }}
                  >
                    <Text style={[styles.skillText, active && styles.skillTextActive]}>{skill}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.exploreButton} onPress={() => setExploreOpen(false)}>
              <Text style={styles.exploreButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  // Enhanced Filtering Logic
  const filteredPosts = useMemo(() => {
    if ((!activeFilters || activeFilters.size === 0) && !searchQuery.trim()) return posts;
    
    const q = searchQuery.toLowerCase().trim();
    return posts.filter((post) => {
      const author = post.author || post.user || {};
      const skills = author.skills || [];
      const skillNames = skills.map(s => s.name || s).map(s => s.toLowerCase());
      
      const matchesQuery = q ? (
        (post.text || '').toLowerCase().includes(q) ||
        skillNames.some(skill => skill.includes(q)) ||
        (author.firstName || '').toLowerCase().includes(q) ||
        (author.lastName || '').toLowerCase().includes(q)
      ) : true;

      if (!activeFilters || activeFilters.size === 0) return matchesQuery;
      
      const matchesFilter = Array.from(activeFilters).some((filter) => {
        const filterLower = filter.toLowerCase();
        return skillNames.includes(filterLower) || 
               (post.text || '').toLowerCase().includes(filterLower) ||
               (post.tags || []).some(tag => tag.toLowerCase().includes(filterLower));
      });

      return matchesQuery && matchesFilter;
    });
  }, [posts, activeFilters, searchQuery]);

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'user', 'globalUserData']);
    navigation.replace("Login");
  };

  const onOrbPress = () => {
    rippleScale.setValue(0.2);
    rippleOpacity.setValue(0.28);
    Animated.parallel([
      Animated.timing(rippleScale, { toValue: 1.6, duration: 360, useNativeDriver: true }),
      Animated.timing(rippleOpacity, { toValue: 0, duration: 360, useNativeDriver: true }),
    ]).start(() => {
      rippleScale.setValue(0);
      rippleOpacity.setValue(0);
      setExploreOpen(true);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Enhanced Floating Orb */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.floatingOrb,
          {
            transform: [{ scale: orbScale }],
          },
        ]}
      >
        <Animated.View style={[
          styles.ripple,
          {
            transform: [{ scale: rippleScale }],
            opacity: rippleOpacity,
          }
        ]} pointerEvents="none" />

        <TouchableOpacity activeOpacity={0.92} onPress={onOrbPress} style={styles.orbTouchable}>
          <View style={styles.orbInner}>
            <Text style={styles.orbLabel}>SEARCH</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <ProfessionalHeader />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00f0a8']}
            tintColor="#00f0a8"
          />
        }
      >
        <StatsCard />
        <AIRecommendationsSection />
        <QuickActions />

        {activeFilters.size > 0 && (
          <View style={styles.activeFilters}>
            <Text style={styles.filtersTitle}>Active Filters:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Array.from(activeFilters).map((filter) => (
                <View key={filter} style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterText}>{filter}</Text>
                  <TouchableOpacity onPress={() => {
                    setActiveFilters(prev => {
                      const next = new Set(prev);
                      next.delete(filter);
                      return next;
                    });
                  }}>
                    <Icon name="close" size={14} color="#00f0a8" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community Feed</Text>
            <TouchableOpacity onPress={loadPosts} style={styles.refreshButton}>
              <Icon name="refresh" size={18} color="#00f0a8" />
              <Text style={styles.seeAllText}> Refresh</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#00f0a8" style={styles.loader} />
          ) : filteredPosts.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="document-text" size={48} color="#666" />
              <Text style={styles.emptyStateText}>No posts found</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery || activeFilters.size > 0 
                  ? 'Try adjusting your search criteria' 
                  : 'Be the first to share something with the community!'}
              </Text>
            </View>
          ) : (
            <View style={styles.feed}>
              {filteredPosts.map((post, index) => (
                <PostCard key={post._id || post.id || `post-${index}`} item={post} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <NavigationTabs />
      <ExploreSheet />
      <CreatePostMenu />

      {/* Enhanced Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowCreateMenu(true)}>
        <View style={styles.fabInner}>
          <Icon name="add" size={28} color="#000" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Enhanced Professional Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },

  professionalHeader: {
    paddingTop: Platform.OS === 'ios' ? 56 : 48,
    paddingHorizontal: 18,
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  brandContainer: { flexDirection: 'row', alignItems: 'center' },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00f0a8',
    textShadowColor: 'rgba(0, 240, 168, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  glowDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00f0a8', marginLeft: 8 },

  headerActions: { flexDirection: 'row' },
  iconButton: { padding: 8, position: 'relative' },

  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ff375f',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  userWelcome: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
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

  quickActions: { marginHorizontal: 18, marginBottom: 16 },
  quickActionItem: { alignItems: 'center', marginRight: 16 },
  actionIcon: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionLabel: { color: '#fff', fontSize: 12, fontWeight: '600', textAlign: 'center' },

  activeFilters: { marginHorizontal: 18, marginBottom: 12 },
  filtersTitle: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  activeFilterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,240,168,0.18)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginRight: 8 },
  activeFilterText: { color: '#00f0a8', fontSize: 12, fontWeight: '600', marginRight: 6 },

  feed: { gap: 12 },

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
  postAction: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 10 },
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
  },
  messageBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  fab: { position: 'absolute', right: 20, bottom: 90 },
  fabInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#00f0a8', alignItems: 'center', justifyContent: 'center', shadowColor: '#00f0a8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },

  floatingOrb: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 8 : 6,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 12,
  },
  ripple: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 140 / 2,
    backgroundColor: '#00f0a8',
    opacity: 0.12,
    zIndex: 0,
  },
  orbTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbInner: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00f0a8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 16,
  },
  orbLabel: {
    color: '#061015',
    fontWeight: '900',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  overlayTouchable: { flex: 1 },
  sheet: { backgroundColor: '#1a1a2e', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, maxHeight: '78%' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  sheetContent: {},
  sheetSubtitle: { color: '#666', fontSize: 14, marginBottom: 12 },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, paddingHorizontal: 12, marginBottom: 14 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', paddingVertical: 10, fontSize: 15 },

  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  skillChip: { backgroundColor: 'rgba(0,240,168,0.08)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(0,240,168,0.22)', marginRight: 8, marginBottom: 8 },
  skillChipActive: { backgroundColor: '#00f0a8' },
  skillText: { color: '#00f0a8', fontSize: 14, fontWeight: '600' },
  skillTextActive: { color: '#061015' },

  exploreButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#00f0a8', paddingVertical: 14, borderRadius: 14 },
  exploreButtonText: { color: '#000', fontSize: 16, fontWeight: '700' },

  createMenuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  createMenu: { backgroundColor: '#1a1a2e', borderRadius: 20, padding: 20, width: '80%' },
  createMenuTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  createMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  createMenuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  createMenuLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },

  scrollView: { flex: 1 },
  loader: { marginVertical: 40 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyStateText: { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  emptyStateSubtext: { color: '#666', fontSize: 14, textAlign: 'center', paddingHorizontal: 20 },
});