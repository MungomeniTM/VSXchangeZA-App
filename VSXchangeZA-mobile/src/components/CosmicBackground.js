import React from "react";
import { View } from "react-native";
import { Canvas, Skia, Paint, vec, Circle } from "@shopify/react-native-skia";

export default function CosmicBackground() {
  // Simple decorative canvas; keep light footprint for Expo Go
  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
      <Canvas style={{ flex: 1 }}>
        <Circle cx={30} cy={40} r={80} color="#001020" />
        <Circle cx={360} cy={120} r={60} color="#002033" />
      </Canvas>
    </View>
  );
}