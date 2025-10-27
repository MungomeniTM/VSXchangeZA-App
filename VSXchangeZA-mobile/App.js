// App.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import axios from "axios";

const API_URL = " https://hugo-presurgical-rachelle.ngrok-free.dev/api/auth/register"; // 👈 replace with ngrok URL

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      return Alert.alert("Error", "Passwords do not match!");
    }
    try {
      const res = await axios.post(API_URL, form);
      Alert.alert("Success", "Account created successfully!");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Registration failed.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Join VSXchangeZA</Text>
      <TextInput style={styles.input} placeholder="Full Name" onChangeText={t => handleChange("name", t)} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={t => handleChange("email", t)} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={t => handleChange("password", t)} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry onChangeText={t => handleChange("confirmPassword", t)} />

      <Text style={styles.label}>Role</Text>
      <TextInput
        style={styles.input}
        placeholder="client / farmer / skilled"
        onChangeText={t => handleChange("role", t)}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.switchText}>Already a client? Login</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d1117", padding: 20 },
  title: { fontSize: 26, fontWeight: "700", color: "#fff", marginBottom: 20 },
  label: { color: "#bbb", marginTop: 15 },
  input: { width: "100%", backgroundColor: "#161b22", color: "#fff", padding: 15, borderRadius: 8, marginVertical: 8 },
  button: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 8, marginTop: 20, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  switchText: { color: "#aaa", marginTop: 20 },
});