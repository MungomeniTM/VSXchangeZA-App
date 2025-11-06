// src/navigation/StackNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CreatePostScreen from "../screens/CreatePostScreen"; 
import ProfileScreen from "../screens/ProfileScreen"; 
const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}