import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useAuth } from '../../contexts/AuthContext';
import { PrimaryButton } from '../../components/buttons';
import { Ionicons } from '@expo/vector-icons';

export default function VerificationSentScreen() {
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, resendVerification } = useAuth();
  
  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification();
      Alert.alert('Success', 'A new verification code has been sent to your email.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setResending(false);
    }
  };
  
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 px-6 justify-center">
        {/* Header */}
        <View className="mb-8">
          <View className="items-center">
            <Image
              source={require('../../assets/images/react-logo.png')}
              className="w-12 h-12 mb-4"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-black dark:text-white mb-2 tracking-tight">
              Check your email
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-300 max-w-xs leading-relaxed">
              We've sent a verification code to{' '}
              <Text className="font-medium text-black dark:text-white">
                {user?.email || 'your email address'}
              </Text>
            </Text>
          </View>
        </View>

        {/* Info Box */}
        <View className="mb-8 p-4 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <View className="flex-row items-start">
            <Ionicons 
              name="information-circle-outline" 
              size={20} 
              color={isDark ? '#9ca3af' : '#6b7280'} 
              style={{ marginRight: 8, marginTop: 1 }}
            />
            <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
              Please check your email and click the verification link or enter the code on the next screen to verify your account.
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="space-y-4">
          <PrimaryButton
            text="Enter verification code"
            onPress={() => router.push("/(auth)/email-verification" as any)}
            size="lg"
            fullWidth
          />

          <View className="flex-row justify-center items-center">
            <Text className="text-sm text-gray-600 dark:text-gray-300">
              Didn't receive the email?{' '}
            </Text>
            <TouchableOpacity 
              onPress={handleResend}
              disabled={resending}
              activeOpacity={0.7}
            >
              <Text className={`text-sm font-medium text-black dark:text-white ${resending ? 'opacity-60' : ''}`}>
                {resending ? 'Sending...' : 'Resend'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
