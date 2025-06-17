import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function AuthLayout() {
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
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="verification-sent" options={{ title: 'Verification', headerBackVisible: false }} />
      <Stack.Screen name="email-verification" options={{ title: 'Verify Email', headerBackVisible: false }} />
      <Stack.Screen name="reset-password" options={{ title: 'Reset Password' }} />
      <Stack.Screen name="set-new-password" options={{ title: 'Set New Password' }} />
    </Stack>
  );
}
