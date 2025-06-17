import { useEffect } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import "./global.css";

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Index effect running:', { isAuthenticated, isLoading, user });
    
    if (!isLoading) {
      // No delay needed - immediately redirect based on auth state
      if (isAuthenticated) {
        console.log('Redirecting to dashboard');
        router.replace("/(dashboard)/home");
      } else {
        console.log('Redirecting to login');
        router.replace("/(auth)/login");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading indicator while checking authentication
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={{ marginTop: 20, color: '#3b82f6' }}>
        {isLoading ? 'Checking login status...' : 'Redirecting...'}
      </Text>
    </View>
  );
}
