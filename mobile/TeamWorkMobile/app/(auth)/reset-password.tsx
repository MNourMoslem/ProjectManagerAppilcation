import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useAuth } from '../../contexts/AuthContext';
import { FormField, Input } from '../../components/forms';
import { PrimaryButton } from '../../components/buttons';
import { Ionicons } from '@expo/vector-icons';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { forgotPassword } = useAuth();

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };

  const handleResetRequest = async () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await forgotPassword(email);
      setIsSuccess(true);
      Alert.alert(
        'Reset Link Sent',
        'A password reset link has been sent to your email address.'
      );
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-gray-900"
    >
      <View className="flex-1 px-6 justify-center">
        {/* Header */}
        <View className="mb-8">
          <TouchableOpacity 
            className="mb-6"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDark ? 'white' : 'black'} 
            />
          </TouchableOpacity>
          
          <View className="items-center">
            <Image
              source={require('../../assets/images/react-logo.png')}
              className="w-12 h-12 mb-4"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-black dark:text-white mb-2 tracking-tight">
              Reset password
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-300 max-w-xs leading-relaxed">
              {isSuccess 
                ? "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."
                : 'Enter your email address and we will send you a link to reset your password.'}
            </Text>
          </View>
        </View>

        {!isSuccess && (
          <View className="space-y-6">
            <FormField
              label="Email address"
              error={error || undefined}
              required
            >
              <Input
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={!!error}
                leftIcon="mail-outline"
                fullWidth
              />
            </FormField>

            <PrimaryButton
              text="Send reset link"
              onPress={handleResetRequest}
              loading={isSubmitting}
              disabled={isSubmitting}
              size="lg"
              fullWidth
            />
          </View>
        )}

        <View className="mt-8">
          <TouchableOpacity 
            onPress={() => router.push("/(auth)/login" as any)}
            activeOpacity={0.7}
          >
            <Text className="text-sm text-center text-gray-600 dark:text-gray-300">
              Remember your password?{' '}
              <Text className="font-medium text-black dark:text-white">
                Back to sign in
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
