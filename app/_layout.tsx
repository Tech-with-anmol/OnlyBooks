import React from "react";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  return (
    <>
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="Home" options={{headerShown: false}}/>
      <Stack.Screen name="Profile" options={{headerShown: false}}/>
      <Stack.Screen name="Editprofile"/>
      <Stack.Screen name="Settings"/>
      <Stack.Screen name="Post"/>
      <Stack.Screen name='library'/>
      <Stack.Screen name='profileView/[id]'/>
      <Stack.Screen name='followers/[id]'/>
      <Stack.Screen name='following/[id]'/>
      <Stack.Screen name='DM/[id]'/>
      <Stack.Screen name='search'/>
      <Stack.Screen name='ai'/>
      <Stack.Screen name='bookclub'/>
      <Stack.Screen name='addClub'/>
      <Stack.Screen name='clubs'/>
    </Stack>
    <Toast/>
    </>
  );
}
