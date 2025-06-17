import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useAuth } from '../../contexts/AuthContext';
import { FormField, Input } from '../../components/forms';
import { PrimaryButton } from '../../components/buttons';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ 
    name?: string;
    email?: string; 
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { signup, error: authError } = useAuth();

  const validate = () => {
    const newErrors: { 
      name?: string;
      email?: string; 
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!name) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
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

  const handleSignup = async () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      await signup(name, email, password);
      // Navigate to verification-sent screen
      router.push("/(auth)/verification-sent" as any);
    } catch (error) {
      Alert.alert('Signup Failed', authError || 'An error occurred during signup. Please try again.');
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
        {/* Header with back button */}
        <View className="px-6 pt-12 pb-4">
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
              Create account
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-300 max-w-xs leading-relaxed">
              Join TeamWork and start collaborating today
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View className="px-6 flex-1">
          <View className="space-y-4">
            <FormField
              label="Full name"
              error={errors.name}
              required
            >
              <Input
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                error={!!errors.name}
                leftIcon="person-outline"
                fullWidth
              />
            </FormField>

            <FormField
              label="Email address"
              error={errors.email}
              required
            >
              <Input
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={!!errors.email}
                leftIcon="mail-outline"
                fullWidth
              />
            </FormField>

            <FormField
              label="Password"
              error={errors.password}
              required
              hint="Must be at least 6 characters"
            >
              <Input
                placeholder="Create a password"
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
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                error={!!errors.confirmPassword}
                leftIcon="shield-checkmark-outline"
                fullWidth
              />
            </FormField>
          </View>

          <View className="mt-8 space-y-4">
            <PrimaryButton
              text="Create account"
              onPress={handleSignup}
              loading={isSubmitting}
              disabled={isSubmitting}
              size="lg"
              fullWidth
            />

            <View className="flex-row justify-center items-center">
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
              </Text>
              <TouchableOpacity 
                onPress={() => router.push("/(auth)/login" as any)}
                activeOpacity={0.7}
              >
                <Text className="text-sm font-medium text-black dark:text-white">
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
