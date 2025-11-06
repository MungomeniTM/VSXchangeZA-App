// src/screens/ProfileScreen.js
import React, { useState, useEffect, useRef } from "react";
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
  FlatList,
  Vibration
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAPI } from "../api";
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

// 🌟 QUANTUM STATE ENTANGLEMENT SYSTEM
const useQuantumState = (initialState, entanglementKey = null) => {
  const [state, setState] = useState(initialState);
  const quantumField = useRef(new Map());
  const temporalEcho = useRef([]);

  const setQuantumState = (updater, causalityPreservation = true) => {
    if (causalityPreservation) {
      temporalEcho.current.push(JSON.parse(JSON.stringify(state)));
      if (temporalEcho.current.length > 10) temporalEcho.current.shift();
    }

    if (typeof updater === 'function') {
      setState(prevState => {
        const newState = updater(prevState);
        
        // Quantum entanglement across dimensions
        if (entanglementKey && quantumField.current.has(entanglementKey)) {
          quantumField.current.get(entanglementKey).forEach(callback => {
            callback(newState);
          });
        }
        
        return newState;
      });
    } else {
      setState(updater);
    }
  };

  const entangle = (otherStateSetter, dimension = 'alpha') => {
    if (!quantumField.current.has(entanglementKey)) {
      quantumField.current.set(entanglementKey, new Map());
    }
    quantumField.current.get(entanglementKey).set(dimension, otherStateSetter);
  };

  const collapseWaveFunction = () => {
    if (temporalEcho.current.length > 0) {
      const previousState = temporalEcho.current.pop();
      setQuantumState(previousState, false);
      return true;
    }
    return false;
  };

  return [state, setQuantumState, { entangle, collapseWaveFunction, quantumField }];
};

// 🕰️ TEMPORAL COORDINATE SYSTEM
const useTemporalCoordinates = () => {
  const [present, setPresent] = useState(new Date());
  const futureEcho = useRef(null);
  const pastResonance = useRef([]);

  useEffect(() => {
    const temporalFlow = setInterval(() => {
      const now = new Date();
      setPresent(now);
      
      // Store temporal resonance patterns
      pastResonance.current.push(now.getTime());
      if (pastResonance.current.length > 1000) pastResonance.current.shift();
    }, 1000);

    return () => clearInterval(temporalFlow);
  }, []);

  const projectFuture = (milliseconds) => {
    futureEcho.current = new Date(present.getTime() + milliseconds);
    return futureEcho.current;
  };

  const accessPast = (indexFromEnd = 0) => {
    const pastIndex = pastResonance.current.length - 1 - indexFromEnd;
    return pastIndex >= 0 ? new Date(pastResonance.current[pastIndex]) : present;
  };

  return { present, projectFuture, accessPast, futureEcho: futureEcho.current };
};

// 🔮 QUANTUM PREDICTION ENGINE
const useQuantumPrediction = (userPatterns, temporalContext) => {
  const predictionMatrix = useRef(new Map());
  const certaintyField = useRef(0.42);

  const predictNextAction = (currentContext) => {
    const contextHash = JSON.stringify(currentContext);
    
    if (predictionMatrix.current.has(contextHash)) {
      const predictions = predictionMatrix.current.get(contextHash);
      const totalWeight = predictions.reduce((sum, p) => sum + p.weight, 0);
      const random = Math.random() * totalWeight;
      
      let weightSum = 0;
      for (const prediction of predictions) {
        weightSum += prediction.weight;
        if (random <= weightSum) {
          certaintyField.current = prediction.confidence;
          return prediction.action;
        }
      }
    }
    
    const actions = ['editProfile', 'addSkill', 'uploadPortfolio', 'setLocation', 'verifyIdentity'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    certaintyField.current = 0.13;
    
    return randomAction;
  };

  const learnFromOutcome = (context, action, success) => {
    const contextHash = JSON.stringify(context);
    if (!predictionMatrix.current.has(contextHash)) {
      predictionMatrix.current.set(contextHash, []);
    }
    
    const predictions = predictionMatrix.current.get(contextHash);
    const existingPrediction = predictions.find(p => p.action === action);
    
    if (existingPrediction) {
      existingPrediction.weight += success ? 0.1 : -0.05;
      existingPrediction.confidence = (existingPrediction.confidence + certaintyField.current) / 2;
    } else {
      predictions.push({
        action,
        weight: success ? 0.5 : 0.1,
        confidence: certaintyField.current,
        timestamp: temporalContext.present
      });
    }
  };

  return { predictNextAction, learnFromOutcome, certainty: () => certaintyField.current };
};

// 🌐 MULTI-DIMENSIONAL INTERFACE RENDERER
const QuantumInterface = ({ children, dimension = 'prime', intensity = 1 }) => {
  const phaseShift = useRef(new Animated.Value(0)).current;
  const dimensionalOverlay = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(phaseShift, {
            toValue: 1,
            duration: 3000 / intensity,
            useNativeDriver: true,
          }),
          Animated.timing(phaseShift, {
            toValue: 0,
            duration: 3000 / intensity,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.timing(dimensionalOverlay, {
        toValue: 0.03 * intensity,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [intensity]);

  const phaseStyle = {
    transform: [
      {
        translateX: phaseShift.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 2],
        }),
      },
      {
        translateY: phaseShift.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -1],
        }),
      },
    ],
  };

  const overlayStyle = {
    opacity: dimensionalOverlay,
  };

  return (
    <Animated.View style={[{ flex: 1 }, phaseStyle]}>
      {children}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          overlayStyle,
          styles[`dimension${dimension}`],
        ]}
        pointerEvents="none"
      />
    </Animated.View>
  );
};

// 🎯 MAIN QUANTUM PROFILE SCREEN
export default function QuantumProfileScreen({ navigation }) {
  // 🌌 QUANTUM STATE ENTANGLEMENT
  const [user, setUser, userQuantum] = useQuantumState(null, 'userConsciousness');
  const [profileData, setProfileData, profileQuantum] = useQuantumState({}, 'profileMatrix');
  const [quantumMode, setQuantumMode, modeQuantum] = useQuantumState('collapsed', 'realityInterface');
  
  // 🕰️ TEMPORAL AWARENESS
  const temporal = useTemporalCoordinates();
  
  // 🔮 PREDICTION ENGINE
  const quantumPredictor = useQuantumPrediction(profileData, temporal);
  
  // 🌟 INTERFACE STATES
  const [editing, setEditing] = useQuantumState(false);
  const [skills, setSkills] = useQuantumState([]);
  const [portfolio, setPortfolio] = useQuantumState([]);
  const [activeDimension, setActiveDimension] = useQuantumState('prime');
  
  // 🎨 QUANTUM VISUALS
  const realityDistortion = useRef(new Animated.Value(0)).current;
  const quantumGlow = useRef(new Animated.Value(0.3)).current;

  // Entangle quantum states
  useEffect(() => {
    userQuantum.entangle(setProfileData, 'consciousnessTransfer');
    profileQuantum.entangle((newData) => {
      quantumPredictor.learnFromOutcome(profileData, 'dataUpdate', true);
    }, 'predictiveLearning');
  }, []);

  // Initialize Quantum Reality
  useEffect(() => {
    initializeQuantumReality();
    commenceTemporalSynchronization();
  }, []);

  const initializeQuantumReality = async () => {
    try {
      const [userData, profileData] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('quantumProfile')
      ]);

      if (userData) {
        const userConsciousness = JSON.parse(userData);
        setUser(userConsciousness);
        
        const predictedAction = quantumPredictor.predictNextAction({
          user: userConsciousness,
          time: temporal.present,
          location: 'Thohoyandou'
        });
        
        console.log(`🔮 Quantum prediction: User likely to ${predictedAction}`);
      }

      // Begin reality distortion sequence
      Animated.sequence([
        Animated.timing(quantumGlow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(realityDistortion, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(realityDistortion, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();

    } catch (quantumError) {
      console.warn('🌌 Quantum initialization failed:', quantumError);
      setQuantumMode('classical');
    }
  };

  const commenceTemporalSynchronization = () => {
    const africanTimeCycles = setInterval(() => {
      const now = temporal.present;
      const hour = now.getHours();
      
      const intensity = hour >= 6 && hour <= 18 ? 0.8 : 1.2;
      setActiveDimension(intensity > 1 ? 'nocturnal' : 'solar');
    }, 60000);

    return () => clearInterval(africanTimeCycles);
  };

  // 🌍 QUANTUM SKILL ACQUISITION
  const acquireQuantumSkill = (skill, method = 'neuralUpload') => {
    Vibration.vibrate(100);
    
    setSkills(prev => {
      const newSkills = [...prev, {
        skill,
        method,
        timestamp: temporal.present,
        quantumSignature: Math.random().toString(36).substr(2, 9),
        proficiency: method === 'neuralUpload' ? 0.95 : 0.75
      }];
      
      quantumPredictor.learnFromOutcome(
        { skills: prev.length, time: temporal.present },
        'acquireSkill',
        true
      );
      
      return newSkills;
    });
  };

  // 📸 MULTI-DIMENSIONAL PORTFOLIO CAPTURE - FIXED VERSION
  const captureQuantumPortfolio = async (dimension = 'prime') => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
        allowsMultipleSelection: false, // Single selection for stability
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // QUANTUM FIX: Process assets without async/await in map
        const quantumAssets = result.assets.map(asset => ({
          id: `${asset.uri}-${temporal.present.getTime()}-${Math.random()}`,
          uri: asset.uri,
          type: asset.type || 'image',
          dimension,
          temporalCoordinates: temporal.present,
          quantumState: 'superposition',
          // Removed async thumbnail generation - using URI directly
          thumbnail: asset.uri 
        }));

        setPortfolio(prev => [...prev, ...quantumAssets]);
        
        // Quantum feedback
        Vibration.vibrate([0, 50, 100, 50]);
        
        // Learn from successful capture
        quantumPredictor.learnFromOutcome(
          { portfolioSize: portfolio.length, dimension },
          'capturePortfolio',
          true
        );
      }
    } catch (dimensionalError) {
      console.warn('🚫 Dimensional capture failed:', dimensionalError);
      quantumPredictor.learnFromOutcome(
        { portfolioSize: portfolio.length, dimension },
        'capturePortfolio',
        false
      );
    }
  };

  // 🗺️ QUANTUM LOCATION ENTANGLEMENT
  const entangleWithLocation = (locationData) => {
    const quantumLocation = {
      ...locationData,
      coordinates: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        quantumVariance: 0.0001,
        temporalDrift: 0.000001
      },
      serviceRadius: 5,
      availability: calculateQuantumAvailability(),
      dimensionalAnchor: activeDimension
    };

    setProfileData(prev => ({
      ...prev,
      location: quantumLocation
    }));
  };

  const calculateQuantumAvailability = () => {
    const now = temporal.present;
    const hour = now.getHours();
    
    return {
      prime: hour >= 6 && hour <= 22,
      nocturnal: hour >= 18 || hour <= 6,
      emergency: true,
      quantum: Math.random() > 0.3
    };
  };

  // 🎨 RENDER QUANTUM INTERFACE
  const QuantumHeader = () => (
    <Animated.View style={[styles.quantumHeader, { opacity: quantumGlow }]}>
      <TouchableOpacity 
        style={styles.quantumButton}
        onPress={() => userQuantum.collapseWaveFunction() || navigation.goBack()}
      >
        <Icon name="chevron-back" size={28} color="#00f0a8" />
      </TouchableOpacity>
      
      <View style={styles.quantumTitleContainer}>
        <Animated.Text style={[styles.quantumTitle, {
          transform: [{
            translateX: realityDistortion.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 3]
            })
          }]
        }]}>
          Quantum Profile
        </Animated.Text>
        <Text style={styles.temporalCoordinates}>
          {temporal.present.toLocaleTimeString()} • {activeDimension.toUpperCase()}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.quantumButton}
        onPress={() => setQuantumMode(quantumMode === 'collapsed' ? 'superposition' : 'collapsed')}
      >
        <Icon 
          name={quantumMode === 'collapsed' ? "infinite" : "cube"} 
          size={28} 
          color="#00f0a8" 
        />
      </TouchableOpacity>
    </Animated.View>
  );

  const QuantumAvatar = () => (
    <Animated.View style={[styles.quantumAvatarContainer, {
      transform: [{
        scale: quantumGlow.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05]
        })
      }]
    }]}>
      <View style={styles.quantumAvatar}>
        <Text style={styles.quantumAvatarText}>
          {user?.firstName?.[0]?.toUpperCase() || 'Ψ'}
        </Text>
      </View>
      <Animated.View style={[styles.quantumOrbital, {
        transform: [{
          rotate: realityDistortion.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
          })
        }]
      }]} />
    </Animated.View>
  );

  const SkillQuantumField = () => (
    <QuantumInterface dimension={activeDimension} intensity={1.2}>
      <View style={styles.quantumField}>
        <Text style={styles.quantumFieldTitle}>Quantum Skills Matrix</Text>
        <Text style={styles.quantumFieldSubtitle}>
          Skills exist in superposition until observed
        </Text>
        
        <View style={styles.skillsUniverse}>
          {skills.map((skill, index) => (
            <Animated.View 
              key={skill.quantumSignature}
              style={[styles.quantumSkill, {
                opacity: realityDistortion.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.7, 1]
                })
              }]}
            >
              <Text style={styles.quantumSkillText}>{skill.skill}</Text>
              <View style={styles.skillProficiency}>
                <View style={[styles.proficiencyBar, { width: `${skill.proficiency * 100}%` }]} />
              </View>
            </Animated.View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.quantumAcquisitionButton}
          onPress={() => acquireQuantumSkill('Quantum Computing', 'neuralUpload')}
        >
          <Icon name="add-circle" size={24} color="#00f0a8" />
          <Text style={styles.quantumButtonText}>Acquire Quantum Skill</Text>
        </TouchableOpacity>
      </View>
    </QuantumInterface>
  );

  // 🎯 MAIN RENDER - QUANTUM REALITY INTERFACE
  return (
    <QuantumInterface dimension={activeDimension} intensity={quantumMode === 'superposition' ? 1.5 : 1}>
      <SafeAreaView style={styles.quantumContainer}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor="transparent" 
          translucent 
        />
        
        {/* Quantum Background Field */}
        <Animated.View style={[styles.quantumBackground, {
          opacity: quantumGlow.interpolate({
            inputRange: [0, 1],
            outputRange: [0.1, 0.3]
          })
        }]} />
        
        <QuantumHeader />
        
        <ScrollView 
          style={styles.quantumScrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Quantum Identity Section */}
          <View style={styles.quantumIdentity}>
            <QuantumAvatar />
            
            <View style={styles.quantumIdentityInfo}>
              <Text style={styles.quantumName}>
                {user?.firstName || 'Quantum'} {user?.lastName || 'Entity'}
              </Text>
              <Text style={styles.quantumRole}>
                {user?.role || 'Multi-Dimensional Being'}
              </Text>
              <Text style={styles.quantumBio}>
                {profileData.bio || "Existing across multiple realities. Specialized in African quantum development."}
              </Text>
            </View>
          </View>

          {/* Skills Universe */}
          <SkillQuantumField />

          {/* Quantum Portfolio */}
          <View style={styles.quantumField}>
            <Text style={styles.quantumFieldTitle}>Multi-Dimensional Portfolio</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.quantumPortfolio}>
                {portfolio.map((asset) => (
                  <View key={asset.id} style={styles.quantumAsset}>
                    <Image source={{ uri: asset.uri }} style={styles.assetImage} />
                    <View style={styles.assetDimension}>
                      <Text style={styles.dimensionText}>{asset.dimension}</Text>
                    </View>
                  </View>
                ))}
                
                <TouchableOpacity 
                  style={styles.addQuantumAsset}
                  onPress={() => captureQuantumPortfolio(activeDimension)}
                >
                  <Icon name="add" size={40} color="#00f0a8" />
                  <Text style={styles.addAssetText}>Capture Quantum Asset</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Quantum Location Entanglement */}
          <View style={styles.quantumField}>
            <Text style={styles.quantumFieldTitle}>Service Quantum Field</Text>
            
            {profileData.location ? (
              <View style={styles.quantumLocation}>
                <Icon name="location" size={20} color="#00f0a8" />
                <Text style={styles.locationText}>
                  {profileData.location.coordinates.latitude.toFixed(4)}, 
                  {profileData.location.coordinates.longitude.toFixed(4)}
                </Text>
                <Text style={styles.quantumVariance}>
                  ±{profileData.location.coordinates.quantumVariance} quantum variance
                </Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.entangleLocationButton}
                onPress={() => entangleWithLocation({
                  latitude: -23.0833,
                  longitude: 30.3833,
                  address: "Thohoyandou Quantum Hub"
                })}
              >
                <Text style={styles.entangleText}>Entangle with Location</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Quantum Reality Controls */}
          <View style={styles.quantumControls}>
            <Text style={styles.controlsTitle}>Reality Interface</Text>
            
            <View style={styles.dimensionControls}>
              {['prime', 'solar', 'nocturnal', 'quantum'].map(dimension => (
                <TouchableOpacity
                  key={dimension}
                  style={[
                    styles.dimensionButton,
                    activeDimension === dimension && styles.activeDimension
                  ]}
                  onPress={() => setActiveDimension(dimension)}
                >
                  <Text style={styles.dimensionText}>{dimension}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Quantum Floating Action */}
        <TouchableOpacity 
          style={styles.quantumFAB}
          onPress={() => {
            const nextAction = quantumPredictor.predictNextAction(profileData);
            console.log(`🎯 Executing quantum-predicted action: ${nextAction}`);
            // Execute predicted action based on prediction
            if (nextAction === 'addSkill') {
              acquireQuantumSkill('Predicted Skill', 'quantumIntuition');
            } else if (nextAction === 'uploadPortfolio') {
              captureQuantumPortfolio(activeDimension);
            }
          }}
        >
          <Animated.View style={[styles.fabGlow, {
            transform: [{
              scale: realityDistortion.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.2]
              })
            }]
          }]} />
          <Icon name="flash" size={28} color="#000" />
        </TouchableOpacity>
      </SafeAreaView>
    </QuantumInterface>
  );
}

// 🌌 QUANTUM STYLES (Transcending CSS)
const styles = StyleSheet.create({
  quantumContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  quantumBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00f0a8',
  },
  quantumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  quantumButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,240,168,0.1)',
  },
  quantumTitleContainer: {
    alignItems: 'center',
  },
  quantumTitle: {
    color: '#00f0a8',
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'rgba(0,240,168,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  temporalCoordinates: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
  },
  quantumAvatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  quantumAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00f0a8',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  quantumAvatarText: {
    color: '#000',
    fontSize: 36,
    fontWeight: '900',
  },
  quantumOrbital: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderWidth: 2,
    borderColor: '#00f0a8',
    borderRadius: 60,
    borderStyle: 'dashed',
  },
  quantumScrollView: {
    flex: 1,
  },
  quantumIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  quantumIdentityInfo: {
    flex: 1,
  },
  quantumName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  quantumRole: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  quantumBio: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 18,
  },
  quantumField: {
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,240,168,0.1)',
  },
  quantumFieldTitle: {
    color: '#00f0a8',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 5,
  },
  quantumFieldSubtitle: {
    color: '#666',
    fontSize: 12,
    marginBottom: 15,
  },
  skillsUniverse: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quantumSkill: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  quantumSkillText: {
    color: '#00f0a8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  skillProficiency: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  proficiencyBar: {
    height: '100%',
    backgroundColor: '#00f0a8',
  },
  quantumAcquisitionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,240,168,0.1)',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  quantumButtonText: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  quantumPortfolio: {
    flexDirection: 'row',
  },
  quantumAsset: {
    position: 'relative',
    width: 120,
    height: 120,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  assetImage: {
    width: '100%',
    height: '100%',
  },
  assetDimension: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dimensionText: {
    color: '#00f0a8',
    fontSize: 10,
    fontWeight: '600',
  },
  addQuantumAsset: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,240,168,0.3)',
    borderStyle: 'dashed',
  },
  addAssetText: {
    color: '#00f0a8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  quantumLocation: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.2)',
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  quantumVariance: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  entangleLocationButton: {
    backgroundColor: 'rgba(0,240,168,0.1)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,240,168,0.3)',
  },
  entangleText: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
  },
  quantumControls: {
    padding: 25,
  },
  controlsTitle: {
    color: '#00f0a8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
  },
  dimensionControls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dimensionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeDimension: {
    backgroundColor: 'rgba(0,240,168,0.2)',
    borderColor: '#00f0a8',
  },
  quantumFAB: {
    position: 'absolute',
    right: 25,
    bottom: 25,
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
  fabGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00f0a8',
    borderRadius: 30,
    opacity: 0.3,
  },
  // Multi-dimensional overlays
  dimensionprime: {
    backgroundColor: 'rgba(0,240,168,0.02)',
  },
  dimensionsolar: {
    backgroundColor: 'rgba(255,200,0,0.02)',
  },
  dimensionnocturnal: {
    backgroundColor: 'rgba(100,100,255,0.02)',
  },
  dimensionquantum: {
    backgroundColor: 'rgba(255,0,255,0.02)',
  },
});