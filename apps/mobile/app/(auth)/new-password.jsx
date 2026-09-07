import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';

const logo = require('../../assets/icons/logo_light.png');

export default function NewPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordValid = password.length >= 8;
  const passwordsMatch =
    password.length > 0 &&
    password === confirmPassword;

  const handleReset = () => {
    if (!passwordValid || !passwordsMatch) return;

    router.replace('/(auth)/success');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Create new password</Text>

        <Text style={styles.subtitle}>
          Choose a new password for your Gists account.
        </Text>

        <Text style={styles.label}>New password</Text>

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password"
          placeholderTextColor="#999999"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.requirement}>
          Use at least 8 characters.
        </Text>

        <Text style={styles.label}>Confirm password</Text>

        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          placeholderTextColor="#999999"
          secureTextEntry
          style={styles.input}
        />

        {confirmPassword.length > 0 && !passwordsMatch && (
          <Text style={styles.error}>
            Passwords do not match.
          </Text>
        )}

        <Pressable
          onPress={handleReset}
          disabled={!passwordValid || !passwordsMatch}
          style={({ pressed }) => [
            styles.button,
            (!passwordValid || !passwordsMatch) &&
              styles.disabledButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.buttonText}>
            Reset Password
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    height: 180,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  logo: {
    width: 90,
    height: 90,
  },

  content: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: 24,
    paddingTop: 36,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111111',
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: '#777777',
    marginTop: 8,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 8,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111111',
    marginBottom: 8,
  },

  requirement: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 22,
  },

  error: {
    fontSize: 13,
    color: '#D33',
    marginBottom: 18,
  },

  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  disabledButton: {
    opacity: 0.4,
  },

  pressed: {
    opacity: 0.8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});