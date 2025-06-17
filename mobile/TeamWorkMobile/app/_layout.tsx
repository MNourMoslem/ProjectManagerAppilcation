import { useEffect, useState } from 'react';
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image } from 'react-native';
import { useColorScheme } from 'nativewind';
import { AuthProvider } from '../contexts/AuthContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    // Initialize any resources or data needed for the app
    async function prepare() {
      try {
        // Artificial delay to simulate loading resources
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <Image
          source={require('../assets/images/react-logo.png')}
          className="w-24 h-24 mb-4"
          resizeMode="contain"
        />
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          TeamWork
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Loading resources...
        </Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Slot />
    </AuthProvider>
  );
}
