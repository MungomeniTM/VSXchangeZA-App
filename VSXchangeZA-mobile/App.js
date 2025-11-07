// App.js - UPDATED WITH CONTEXT PROVIDER
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import useInitializeAPI from "./src/config/initAPI";
import { AppProvider } from "./src/context/AppContext"; // 👈 ADD THIS IMPORT

export default function App() {
  useInitializeAPI(); // 👈 runs once when the app loads

  return (
    <NavigationContainer>
      <AppProvider> {/* 👈 WRAP WITH CONTEXT PROVIDER */}
        <StackNavigator />
      </AppProvider>
    </NavigationContainer>
  );
}