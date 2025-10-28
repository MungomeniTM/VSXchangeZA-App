// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import useInitializeAPI from "./src/config/initAPI";

export default function App() {
  useInitializeAPI(); // 👈 runs once when the app loads

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}