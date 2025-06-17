import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useAuth } from '../../contexts/AuthContext';
import { FormField, Input } from '../../components/forms';
import { PrimaryButton } from '../../components/buttons';
import { Ionicons } from '@expo/vector-icons';

export default function SetNewPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ 
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { token } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { resetPassword } = useAuth();

  const validate = () => {
    const newErrors: { 
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;
    if (!token) {
      Alert.alert('Error', 'Invalid or expired reset token');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(token as string, password);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/(auth)/login" as any);
      }, 2000);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-gray-900"
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-12 pb-8">
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
              Set new password
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-300 max-w-xs leading-relaxed">
              {isSuccess 
                ? "Your password has been reset successfully! Redirecting to sign in..."
                : 'Create a new password for your account'}
            </Text>
          </View>
        </View>

        {!isSuccess && (
          <View className="px-6 flex-1">
            <View className="space-y-4">
              <FormField
                label="New password"
                error={errors.password}
                required
                hint="Must be at least 6 characters"
              >
                <Input
                  placeholder="Enter new password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  error={!!errors.password}
                  leftIcon="lock-closed-outline"
                  fullWidth
                />
              </FormField>

              <FormField
                label="Confirm password"
                error={errors.confirmPassword}
                required
              >
                <Input
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  error={!!errors.confirmPassword}
                  leftIcon="shield-checkmark-outline"
                  fullWidth
                />
              </FormField>
            </View>

            <View className="mt-8">
              <PrimaryButton
                text="Reset password"
                onPress={handleResetPassword}
                loading={isSubmitting}
                disabled={isSubmitting}
                size="lg"
                fullWidth
              />
            </View>
          </View>
        )}

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
