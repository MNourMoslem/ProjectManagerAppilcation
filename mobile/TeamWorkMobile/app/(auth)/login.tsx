import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useAuth } from '../../contexts/AuthContext';
import { FormField, Input } from '../../components/forms';
import { PrimaryButton, SecondaryButton } from '../../components/buttons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { login, error: authError } = useAuth();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      console.log('Login successful in component');
      
      // Force navigation to dashboard
      router.replace('/(dashboard)/home');
    } catch (error) {
      console.error('Login error in component:', error);
      Alert.alert('Login Failed', authError || 'An error occurred during login. Please try again.');
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
        {/* Header Section */}
        <View className="px-6 pt-12 pb-8">
          <View className="items-center">
            <Image
              source={require('../../assets/images/react-logo.png')}
              className="w-12 h-12 mb-4"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-black dark:text-white mb-2 tracking-tight">
              Welcome back
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-300 max-w-xs leading-relaxed">
              Sign in to your account to continue
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View className="px-6 flex-1">
          <View className="space-y-4">
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
            >
              <Input
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={!!errors.password}
                leftIcon="lock-closed-outline"
                fullWidth
              />
            </FormField>

            <TouchableOpacity 
              onPress={() => router.push('/(auth)/reset-password')}
              className="self-end"
              activeOpacity={0.7}
            >
              <Text className="text-sm text-black dark:text-white font-medium">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-8 space-y-4">
            <PrimaryButton
              text="Sign in"
              onPress={handleLogin}
              loading={isSubmitting}
              disabled={isSubmitting}
              size="lg"
              fullWidth
            />

            <View className="flex-row justify-center items-center">
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity 
                onPress={() => router.push('/(auth)/signup')}
                activeOpacity={0.7}
              >
                <Text className="text-sm font-medium text-black dark:text-white">
                  Sign up
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
