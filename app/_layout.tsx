import React from "react";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="Home" options={{headerShown: false}}/>
      <Stack.Screen name="Profile" options={{headerShown: false}}/>
      <Stack.Screen name="Editprofile"/>
      <Stack.Screen name="Settings"/>
      
    </Stack>
    <Toast/>
    </>
  );
}
