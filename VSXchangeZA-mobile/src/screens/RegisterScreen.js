// src/screens/RegisterScreen.js
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
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { register } from "../api";

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password || !firstName || !role || !confirmPassword) {
      return Alert.alert("Error", "Please fill all required fields.");
    }
    if (password !== confirmPassword) return Alert.alert("Error", "Passwords do not match.");

    try {
      setLoading(true);
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role
      };
      const res = await register(payload);
      setLoading(false);
      Alert.alert("Success", "Registered. Please login.");
      navigation.replace("Login");
    } catch (err) {
      setLoading(false);
      console.warn("Register error:", err?.response?.data || err?.message);
      Alert.alert("Registration failed", err?.response?.data?.detail || err?.response?.data?.message || "Server error");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Join VSXchangeZA</Text>

        <View style={{ width: "100%", flexDirection: "row", gap: 8 }}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="First name" placeholderTextColor="#9aa" value={firstName} onChangeText={setFirstName} />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Last name" placeholderTextColor="#9aa" value={lastName} onChangeText={setLastName} />
        </View>

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#9aa" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#9aa" secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#9aa" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

        <Text style={styles.label}>Role</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={role} onValueChange={(v) => setRole(v)}>
            <Picker.Item label="Select Role" value="" />
            <Picker.Item label="Client" value="client" />
            <Picker.Item label="Farmer" value="farmer" />
            <Picker.Item label="Skilled Person" value="skilled" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Registering..." : "Register"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.switch}>Already a client? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#0d1117", alignItems: "center", justifyContent: "center" },
  title: { color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 20 },
  input: { width: "100%", backgroundColor: "#161b22", color: "#fff", padding: 12, marginBottom: 12, borderRadius: 8, borderWidth: 1, borderColor: "#222" },
  label: { alignSelf: "flex-start", color: "#9aa", marginBottom: 6 },
  pickerWrap: { width: "100%", backgroundColor: "#161b22", borderRadius: 8, marginBottom: 18, borderWidth: 1, borderColor: "#222" },
  button: { width: "100%", backgroundColor: "#00C851", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 6 },
  buttonText: { color: "#fff", fontWeight: "700" },
  switch: { color: "#9aa", marginTop: 14 }
});