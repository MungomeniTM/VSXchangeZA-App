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
  Platform,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { register } from "../api";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Registration Handler
  const submit = async () => {
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword || !role)
      return Alert.alert("Missing Info", "Please fill in all required fields.");

    if (password !== confirmPassword)
      return Alert.alert("Error", "Passwords do not match.");

    // 🧠 Split full name into first + last
    const [first_name, ...rest] = fullName.trim().split(" ");
    const last_name = rest.join(" ") || "";

    const payload = { first_name, last_name, email, password, role };

    try {
      setLoading(true);
      const res = await register(payload);
      setLoading(false);
      console.log("✅ Registered successfully:", res.data);

      Alert.alert("Success", "Registration successful! Please log in.");
      navigation.replace("Login");
    } catch (err) {
      setLoading(false);
      console.error("❌ Registration failed:", err?.response?.data || err?.message);
      Alert.alert(
        "Registration Failed",
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Server error — please try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Join VSXchangeZA</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#9aa"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9aa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9aa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#9aa"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Text style={styles.label}>Role</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={role}
            dropdownIconColor="#00C851"
            onValueChange={(v) => setRole(v)}
          >
            <Picker.Item label="Select Role" value="" />
            <Picker.Item label="Client" value="client" />
            <Picker.Item label="Farmer" value="farmer" />
            <Picker.Item label="Skilled Person" value="skilled" />
          </Picker>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.switch}>
            Already a client? <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =====================
// 💎 STYLES (Inspired by auth.css)
// =====================
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#0d1117",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    backgroundColor: "#161b22",
    color: "#fff",
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222",
    fontSize: 16,
  },
  label: {
    alignSelf: "flex-start",
    color: "#9aa",
    marginBottom: 6,
    fontWeight: "600",
  },
  pickerWrap: {
    width: "100%",
    backgroundColor: "#161b22",
    borderRadius: 10,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#222",
  },
  button: {
    width: "100%",
    backgroundColor: "#00C851",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
    shadowColor: "#00C851",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
  switch: {
    color: "#9aa",
    marginTop: 16,
    fontSize: 15,
  },
  link: {
    color: "#00C851",
    fontWeight: "700",
  },
});