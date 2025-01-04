import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="Home" options={{headerShown: false}}/>
      <Stack.Screen name="Profile" options={{headerShown: false}}/>
      <Stack.Screen name="Editprofile"/>
      <Stack.Screen name="Settings"/>
    </Stack>
  );
}
