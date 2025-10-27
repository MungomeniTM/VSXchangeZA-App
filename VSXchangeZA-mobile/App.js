// App.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";

const API_URL = "https://hugo-presurgical-rachelle.ngrok-free.app/api/auth/register"; 
// 👈 Replace with your own active ngrok HTTPS URL

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    const { name, email, password, confirmPassword, role } = form;

    if (!name || !email || !password || !confirmPassword || !role)
      return Alert.alert("Error", "Please fill in all fields.");

    if (password !== confirmPassword)
      return Alert.alert("Error", "Passwords do not match.");

    try {
      const response = await axios.post(API_URL, { name, email, password, role });
      Alert.alert("Success", "Account created successfully!");
      console.log("✅ Registration Response:", response.data);
    } catch (error) {
      console.log("❌ Registration Error:", error.response?.data || error.message);
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Join VSXchangeZA</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#777"
          onChangeText={text => handleChange("name", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777"
          keyboardType="email-address"
          onChangeText={text => handleChange("email", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry
          onChangeText={text => handleChange("password", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#777"
          secureTextEntry
          onChangeText={text => handleChange("confirmPassword", text)}
        />
        <Text style={styles.label}>Role</Text>
        <TextInput
          style={styles.input}
          placeholder="client / farmer / skilled"
          placeholderTextColor="#777"
          onChangeText={text => handleChange("role", text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Text style={styles.switchText}>Already a client? Login</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d1117",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },
  label: {
    color: "#bbb",
    alignSelf: "flex-start",
    marginTop: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#161b22",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  switchText: {
    color: "#aaa",
    marginTop: 20,
  },
});