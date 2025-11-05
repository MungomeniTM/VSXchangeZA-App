
// src/screens/DashboardScreen.js
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  Pressable
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPosts, createAPI } from "../api";

const { width, height } = Dimensions.get('window');

// Custom Gradient View
const GradientView = ({ colors, style, children }) => (
  <View style={[style, { overflow: 'hidden' }]}>
    <View 
      style={[
        StyleSheet.absoluteFill, 
        { 
          backgroundColor: colors[0],
          opacity: 0.9 
        }
      ]} 
    />
    {children}
  </View>
);

export default function DashboardScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreOpen, setExploreOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(new Set());
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const sheetAnim = useRef(new Animated.Value(height)).current;

  // Animations
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

  // Sheet Animation
  useEffect(() => {
    if (exploreOpen) {
      Animated.timing(sheetAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(sheetAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [exploreOpen]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        console.log('User loaded:', userObj);
      }
    } catch (error) {
      console.warn('Failed to load user data:', error);
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetchPosts();
      console.log('Posts response:', res);
      
      // Handle different response structures
      const postsData = res?.data?.posts || res?.data || res || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (err) {
      console.warn("Fetch posts failed:", err);
      Alert.alert("Error", "Unable to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
    loadPosts();
  }, []);

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    navigation.replace("Login");
  };

  // Fixed PostCard Component with proper data handling
  const PostCard = ({ item }) => {
    // Safely extract user data with fallbacks
    const userName = item.user?.firstName || item.user?.username || item.author || 'Community Member';
    const userRole = item.user?.role || 'Member';
    const userInitial = userName.charAt(0).toUpperCase();
    const postText = item.text || item.content || item.body || 'Shared an opportunity with the community';
    const postTime = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently';
    const likes = item.approvals || item.likes || 0;
    const comments = item.comments?.length || 0;
    const shares = item.shares || 0;

    return (
      <Animated.View style={[styles.postCard, { opacity: fadeAnim }]}>
        <GradientView colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}>
          {/* Post Header */}
          <View style={styles.postHeader}>
            <View style={styles.postAvatar}>
              <Text style={styles.postAvatarText}>
                {userInitial}
              </Text>
            </View>
            <View style={styles.postUserInfo}>
              <Text style={styles.postUserName} numberOfLines={1}>
                {userName}
              </Text>
              <Text style={styles.postTime}>
                {postTime} • {userRole}
              </Text>
            </View>
            <TouchableOpacity style={styles.postMenu}>
              <Icon name="ellipsis-horizontal" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Post Content */}
          <Text style={styles.postContent}>
            {postText}
          </Text>

          {/* Post Media if available */}
          {item.media && (
            <Image 
              source={{ uri: item.media }} 
              style={styles.postMedia}
              resizeMode="cover"
            />
          )}

          {/* Post Actions */}
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.postAction}>
              <Icon name="heart-outline" size={20} color="#666" />
              <Text style={styles.postActionText}>{likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Icon name="chatbubble-outline" size={20} color="#666" />
              <Text style={styles.postActionText}>{comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Icon name="repeat-outline" size={20} color="#666" />
              <Text style={styles.postActionText}>{shares}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <Icon name="send-outline" size={20} color="#666" />
              <Text style={styles.postActionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </GradientView>
      </Animated.View>
    );
  };

  const CosmicHeader = () => (
    <GradientView 
      colors={['#000000', '#1a1a2e']}
      style={styles.cosmicHeader}
    >
      <View style={styles.headerTop}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>VSXchangeZA</Text>
          <View style={styles.glowDot} />
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setExploreOpen(true)}
          >
            <Icon name="search" size={22} color="#00f0a8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications-outline" size={22} color="#00f0a8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={logout}>
            <Icon name="log-out-outline" size={22} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* User Welcome */}
      <View style={styles.userWelcome}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>
            {user?.firstName || user?.username || 'User'}
          </Text>
          <Text style={styles.userRole}>{user?.role || 'Member'} • {user?.location || 'Location'}</Text>
        </View>
      </View>
    </GradientView>
  );

  const StatsCard = () => (
    <Animated.View 
      style={[
        styles.statsCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <GradientView colors={['rgba(30,144,255,0.15)', 'rgba(0,240,168,0.15)']}>
        <Text style={styles.statsTitle}>Community Pulse</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2.1k</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>324</Text>
            <Text style={styles.statLabel}>Farms</Text>
          </View>
        </View>
        
        <View style={styles.sparklineContainer}>
          <Icon name="trending-up" size={16} color="#00f0a8" />
          <Text style={styles.sparklineText}>42% growth this month</Text>
        </View>
      </GradientView>
    </Animated.View>
  );

  const QuickActions = () => (
    <Animated.View 
      style={[
        styles.quickActions,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { icon: 'add-circle', label: 'Create Post', color: '#00f0a8' },
          { icon: 'analytics', label: 'Analytics', color: '#1e90ff' },
          { icon: 'people', label: 'Network', color: '#ff6b81' },
          { icon: 'leaf', label: 'My Farm', color: '#a55eea' },
          { icon: 'construct', label: 'Services', color: '#fed330' },
        ].map((action, index) => (
          <TouchableOpacity key={index} style={styles.quickActionItem}>
            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
              <Icon name={action.icon} size={22} color="#000" />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
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
          style={[
            styles.navTab,
            activeTab === tab.id && styles.navTabActive
          ]}
          onPress={() => setActiveTab(tab.id)}
        >
          <Icon 
            name={activeTab === tab.id ? tab.icon : `${tab.icon}-outline`}
            size={24}
            color={activeTab === tab.id ? '#00f0a8' : '#666'}
          />
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

  const ExploreSheet = () => (
    <Modal
      visible={exploreOpen}
      transparent
      animationType="none"
      onRequestClose={() => setExploreOpen(false)}
    >
      <View style={styles.sheetOverlay}>
        <Pressable 
          style={styles.overlayTouchable} 
          onPress={() => setExploreOpen(false)}
        />
        <Animated.View 
          style={[
            styles.sheet,
            { transform: [{ translateY: sheetAnim }] }
          ]}
        >
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>VSXplore Skills</Text>
            <TouchableOpacity onPress={() => setExploreOpen(false)}>
              <Icon name="close" size={24} color="#00f0a8" />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetContent}>
            <Text style={styles.sheetSubtitle}>Find skills & connect with experts</Text>
            
            <View style={styles.searchContainer}>
              <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search skills..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <View style={styles.skillsGrid}>
              {['Carpentry', 'Electrical', 'Plumbing', 'Farming', 'Tech', 'Design', 'Marketing', 'Consulting'].map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.skillChip,
                    activeFilters.has(skill) && styles.skillChipActive
                  ]}
                  onPress={() => {
                    setActiveFilters(prev => {
                      const next = new Set(prev);
                      if (next.has(skill)) next.delete(skill);
                      else next.add(skill);
                      return next;
                    });
                    setExploreOpen(false);
                  }}
                >
                  <Text style={[
                    styles.skillText,
                    activeFilters.has(skill) && styles.skillTextActive
                  ]}>
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => setExploreOpen(false)}
            >
              <Icon name="rocket" size={18} color="#000" style={styles.buttonIcon} />
              <Text style={styles.exploreButtonText}>Start Exploring</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <CosmicHeader />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <StatsCard />
        <QuickActions />
        
        {/* Active Filters */}
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

        {/* Feed Section */}
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
          ) : posts.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="document-text" size={48} color="#666" />
              <Text style={styles.emptyStateText}>No posts yet</Text>
              <Text style={styles.emptyStateSubtext}>Be the first to share something with the community!</Text>
            </View>
          ) : (
            <View style={styles.feed}>
              {posts.map((post, index) => (
                <PostCard key={post._id || post.id || `post-${index}`} item={post} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <NavigationTabs />
      <ExploreSheet />
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <View style={styles.fabInner}>
          <Icon name="add" size={28} color="#000" />
        </View>
      </TouchableOpacity>

      {/* VSXplore Orb */}
      <TouchableOpacity 
        style={styles.exploreOrb}
        onPress={() => setExploreOpen(true)}
      >
        <View style={styles.orbInner}>
          <Icon name="search" size={20} color="#000" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cosmicHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#00f0a8',
    textShadowColor: 'rgba(0, 240, 168, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  glowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00f0a8',
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 8,
  },
  userWelcome: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 2,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  userRole: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  statsCard: {
    margin: 20,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 168, 0.2)',
  },
  statsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#00f0a8',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sparklineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    gap: 8,
  },
  sparklineText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  quickActionItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilters: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  filtersTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,240,168,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  activeFilterText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  feed: {
    gap: 15,
  },
  postCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 20,
    paddingBottom: 0,
  },
  postAvatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  postAvatarText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  postTime: {
    color: '#666',
    fontSize: 12,
  },
  postMenu: {
    padding: 5,
  },
  postContent: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  postMedia: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  postActionText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  navTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 15,
  },
  navTabActive: {
    backgroundColor: 'rgba(0,240,168,0.15)',
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
  },
  fabInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00f0a8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  exploreOrb: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    zIndex: 100,
  },
  orbInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00f0a8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  sheetContent: {
    // Content styles
  },
  sheetSubtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    fontSize: 16,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  skillChip: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  skillChipActive: {
    backgroundColor: '#00f0a8',
  },
  skillText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  skillTextActive: {
    color: '#000',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00f0a8',
    paddingVertical: 15,
    borderRadius: 15,
    gap: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  exploreButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  loader: {
    marginVertical: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});