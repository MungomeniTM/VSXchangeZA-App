// src/screens/CreatePostScreen.js
import React, { useState, useRef } from "react";
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
  ActivityIndicator
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAPI } from "../api";

const CreatePostScreen = ({ navigation }) => {
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [user, setUser] = useState(null);

  // Load user data
  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.warn('Failed to load user data');
      }
    };
    loadUser();
  }, []);

  const handleCreatePost = async () => {
    if (!postText.trim()) {
      Alert.alert("Error", "Please write something to post.");
      return;
    }

    setLoading(true);
    try {
      const api = await createAPI();
      const payload = {
        text: postText.trim(),
        // Add any other required fields your backend expects
      };

      const response = await api.post('/posts', payload);
      
      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", "Post created successfully!", [
          { 
            text: "OK", 
            onPress: () => navigation.goBack() 
          }
        ]);
        setPostText("");
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('Create post error:', error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = () => {
    // For now, we'll just show an alert since image picking requires additional setup
    Alert.alert(
      "Coming Soon",
      "Image upload feature will be available in the next update!",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#00f0a8" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Create Post</Text>
        
        <TouchableOpacity 
          style={[styles.postButton, (!postText.trim() || loading) && styles.postButtonDisabled]}
          onPress={handleCreatePost}
          disabled={!postText.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.firstName || user?.username || 'User'}
            </Text>
            <Text style={styles.userRole}>
              {user?.role || 'Member'} • Public
            </Text>
          </View>
        </View>

        {/* Post Input */}
        <TextInput
          style={styles.textInput}
          placeholder="What's happening in your world? Share your skills, projects, or opportunities..."
          placeholderTextColor="#666"
          value={postText}
          onChangeText={setPostText}
          multiline
          textAlignVertical="top"
          maxLength={1000}
        />

        {/* Character Count */}
        <Text style={styles.charCount}>
          {postText.length}/1000
        </Text>

        {/* Image Preview */}
        {selectedImage && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Icon name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleImageSelect}
          >
            <Icon name="image-outline" size={24} color="#00f0a8" />
            <Text style={styles.actionButtonText}>Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="videocam-outline" size={24} color="#00f0a8" />
            <Text style={styles.actionButtonText}>Video</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="location-outline" size={24} color="#00f0a8" />
            <Text style={styles.actionButtonText}>Location</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="people-outline" size={24} color="#00f0a8" />
            <Text style={styles.actionButtonText}>Tag People</Text>
          </TouchableOpacity>
        </View>

        {/* Post Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Posting Tips</Text>
          <Text style={styles.tip}>• Be clear about what you're offering or looking for</Text>
          <Text style={styles.tip}>• Mention your skills and experience level</Text>
          <Text style={styles.tip}>• Include your location if relevant</Text>
          <Text style={styles.tip}>• Use relevant hashtags to reach more people</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  postButton: {
    backgroundColor: '#00f0a8',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  postButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  userRole: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    minHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  charCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 20,
  },
  imagePreview: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionButtonText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  tipsSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.2)',
  },
  tipsTitle: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  tip: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
});

export default CreatePostScreen;