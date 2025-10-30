// src/screens/DashboardScreen.js
import React, { useEffect, useState, useRef } from "react";
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
  Image
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPosts, createAPI } from "../api";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Cosmic animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    } catch (error) {
      console.warn('Failed to load user data');
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetchPosts();
      setPosts(res.data || []);
    } catch (err) {
      console.warn("Fetch posts failed:", err?.response?.data || err.message);
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

  const CosmicHeader = () => (
    <LinearGradient
      colors={['#000000', '#0f0f23', '#1a1a2e']}
      style={styles.cosmicHeader}
    >
      <View style={styles.headerTop}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>VSXchangeZA</Text>
          <View style={styles.glowDot} />
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#00f0a8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="#ff4757" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#00f0a8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search skills, farms, people..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>⌕</Text>
        </TouchableOpacity>
      </View>

      {/* User Welcome */}
      <View style={styles.userWelcome}>
        <LinearGradient
          colors={['#00f0a8', '#1e90ff']}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>
            {user?.firstName?.[0]?.toUpperCase() || 'U'}
          </Text>
        </LinearGradient>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>
            {user?.firstName || 'User'} {user?.lastName || ''}
          </Text>
          <Text style={styles.userRole}>{user?.role || 'Member'} • {user?.location || 'Earth'}</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const StatsCard = () => (
    <Animated.View 
      style={[
        styles.statsCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <LinearGradient
        colors={['rgba(30,144,255,0.1)', 'rgba(0,240,168,0.1)']}
        style={styles.statsGradient}
      >
        <Text style={styles.statsTitle}>Community Pulse</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2.1k</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>586</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>324</Text>
            <Text style={styles.statLabel}>Farms</Text>
          </View>
        </View>
        
        {/* Mini Analytics Sparkline */}
        <View style={styles.sparklineContainer}>
          <View style={styles.sparkline}>
            {[30, 45, 35, 60, 50, 70, 65].map((height, index) => (
              <View
                key={index}
                style={[
                  styles.sparkBar,
                  { height: height * 0.6 }
                ]}
              />
            ))}
          </View>
          <Text style={styles.sparklineText}>↑ 42% growth this month</Text>
        </View>
      </LinearGradient>
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
          { icon: 'trending-up', label: 'Analytics', color: '#1e90ff' },
          { icon: 'people', label: 'Network', color: '#ff6b81' },
          { icon: 'business', label: 'My Farm', color: '#a55eea' },
          { icon: 'build', label: 'Services', color: '#fed330' },
        ].map((action, index) => (
          <TouchableOpacity key={index} style={styles.quickActionItem}>
            <LinearGradient
              colors={[action.color, `${action.color}80`]}
              style={styles.actionIcon}
            >
              <Ionicons name={action.icon} size={24} color="#000" />
            </LinearGradient>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const PostCard = ({ item }) => (
    <Animated.View style={[styles.postCard, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.01)']}
        style={styles.postGradient}
      >
        {/* Post Header */}
        <View style={styles.postHeader}>
          <LinearGradient
            colors={['#00f0a8', '#1e90ff']}
            style={styles.postAvatar}
          >
            <Text style={styles.postAvatarText}>
              {item.user?.firstName?.[0]?.toUpperCase() || 'U'}
            </Text>
          </LinearGradient>
          <View style={styles.postUserInfo}>
            <Text style={styles.postUserName}>
              {item.user?.firstName} {item.user?.lastName}
            </Text>
            <Text style={styles.postTime}>2h ago • {item.user?.role}</Text>
          </View>
          <TouchableOpacity style={styles.postMenu}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>
          {item.text || "Shared an amazing opportunity for skill exchange..."}
        </Text>

        {/* Post Media (if any) */}
        {item.media && (
          <Image 
            source={{ uri: item.media }} 
            style={styles.postMedia}
            resizeMode="cover"
          />
        )}

        {/* Post Analytics */}
        <View style={styles.postAnalytics}>
          <View style={styles.analyticsItem}>
            <Ionicons name="heart" size={16} color="#ff4757" />
            <Text style={styles.analyticsText}>{item.approvals || 24}</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Ionicons name="chatbubble" size={16} color="#00f0a8" />
            <Text style={styles.analyticsText}>{item.comments?.length || 8}</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Ionicons name="share-social" size={16} color="#1e90ff" />
            <Text style={styles.analyticsText}>{item.shares || 3}</Text>
          </View>
        </View>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.postAction}>
            <Ionicons name="heart-outline" size={24} color="#666" />
            <Text style={styles.postActionText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction}>
            <Ionicons name="chatbubble-outline" size={24} color="#666" />
            <Text style={styles.postActionText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction}>
            <Ionicons name="share-social-outline" size={24} color="#666" />
            <Text style={styles.postActionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const NavigationTabs = () => (
    <View style={styles.navTabs}>
      {[
        { id: 'feed', icon: 'home', label: 'Feed' },
        { id: 'explore', icon: 'compass', label: 'Explore' },
        { id: 'network', icon: 'people', label: 'Network' },
        { id: 'messages', icon: 'chatbubble', label: 'Messages' },
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
          <Ionicons
            name={tab.icon}
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

  return (
    <View style={styles.container}>
      <CosmicHeader />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <StatsCard />
        <QuickActions />
        
        {/* Trending Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Trending Skills</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['AI Development', 'Organic Farming', 'Solar Tech', 'Blockchain', 'UI/UX Design'].map((skill, index) => (
              <TouchableOpacity key={index} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Feed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🌌 Community Feed</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ActivityIndicator size="large" color="#00f0a8" style={styles.loader} />
          ) : (
            <View style={styles.feed}>
              {posts.slice(0, 5).map((post, index) => (
                <PostCard key={post._id || index} item={post} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <NavigationTabs />
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <LinearGradient
          colors={['#00f0a8', '#1e90ff']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#000" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
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
    overflow: 'hidden',
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
    backgroundGradient: 'linear-gradient(90deg, #00f0a8, #1e90ff)',
    backgroundClip: 'text',
    color: 'transparent',
  },
  glowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00f0a8',
    marginLeft: 8,
    shadowColor: '#00f0a8',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
  },
  searchButtonText: {
    color: '#00f0a8',
    fontSize: 18,
    fontWeight: '600',
  },
  userWelcome: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
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
    shadowColor: '#00f0a8',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 0.3,
    elevation: 10,
  },
  statsGradient: {
    padding: 25,
  },
  statsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    justifyContent: 'space-between',
  },
  sparkline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 30,
    gap: 4,
  },
  sparkBar: {
    width: 6,
    backgroundColor: '#00f0a8',
    borderRadius: 3,
  },
  sparklineText: {
    color: '#00f0a8',
    fontSize: 12,
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
  seeAllText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  skillChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,240,168,0.1)',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  skillText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
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
  postGradient: {
    padding: 20,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  postAvatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
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
  },
  postMedia: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },
  postAnalytics: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  analyticsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  analyticsText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  postActionText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  navTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
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
    backgroundColor: 'rgba(0,240,168,0.1)',
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
    shadowColor: '#00f0a8',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 0.5,
    elevation: 10,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  loader: {
    marginVertical: 40,
  },
});