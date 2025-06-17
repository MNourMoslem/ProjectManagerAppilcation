import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function DashboardLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#1f2937' : 'white',
        },
        headerTintColor: isDark ? 'white' : 'black',
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: isDark ? '#111827' : '#f9fafb',
        },
        // Prevent navigating back to auth screens
        headerBackVisible: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          title: 'Dashboard',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
