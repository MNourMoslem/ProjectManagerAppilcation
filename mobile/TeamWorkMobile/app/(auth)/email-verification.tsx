import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useAuth } from '../../contexts/AuthContext';
import { FormField, Input } from '../../components/forms';
import { PrimaryButton } from '../../components/buttons';
import { Ionicons } from '@expo/vector-icons';

export default function EmailVerificationScreen() {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { verifyEmail, resendVerification, user } = useAuth();

  const handleVerify = async () => {
    if (!verificationCode) {
      setError('Verification code is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await verifyEmail(verificationCode);
      Alert.alert('Success', 'Your email has been verified successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to home screen (index)
            router.replace('/');
          }
        }
      ]);
    } catch (error: any) {
      setError(error.message || 'Invalid or expired verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Verify your email
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-300 max-w-xs leading-relaxed">
              A verification code has been sent to {user?.email || 'your email address'}.
              Please enter the code below to verify your account.
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View className="space-y-6">
          <FormField
            label="Verification code"
            error={error || undefined}
            required
          >
            <Input
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChangeText={(text) => {
                setVerificationCode(text);
                setError(null);
              }}
              keyboardType="number-pad"
              maxLength={6}
              error={!!error}
              leftIcon="key-outline"
              fullWidth
            />
          </FormField>

          <PrimaryButton
            text="Verify email"
            onPress={handleVerify}
            loading={isSubmitting}
            disabled={isSubmitting}
            size="lg"
            fullWidth
          />

          <TouchableOpacity 
            onPress={handleResend}
            disabled={resending}
            activeOpacity={0.7}
          >
            <Text className="text-sm text-center text-gray-600 dark:text-gray-300">
              Didn't receive a code?{' '}
              <Text className={`font-medium text-black dark:text-white ${resending ? 'opacity-60' : ''}`}>
                {resending ? 'Sending...' : 'Resend'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
