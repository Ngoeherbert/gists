/* eslint-disable react/no-unescaped-entities */
import { useRef, useState } from 'react';
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

export default function ResetOtpScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (value, index) => {
    const digit = value.replace(/\D/g, '').slice(-1);

    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (
      event.nativeEvent.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    router.push('/(auth)/new-password');
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    inputs.current[0]?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter reset code</Text>

        <Text style={styles.subtitle}>
          Enter the 6-digit verification code we sent to
          your email or phone.
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(value) =>
                handleChange(value, index)
              }
              onKeyPress={(event) =>
                handleKeyPress(event, index)
              }
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              style={styles.otpInput}
            />
          ))}
        </View>

        <Pressable
          style={styles.button}
          onPress={handleVerify}
        >
          <Text style={styles.buttonText}>Verify Code</Text>
        </Pressable>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive the code?
          </Text>

          <Pressable onPress={handleResend}>
            <Text style={styles.resendLink}> Resend</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={styles.back}
        >
          <Text style={styles.backText}>
            Change email or phone
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
    marginBottom: 32,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 14,
    fontSize: 22,
    fontWeight: '600',
    color: '#111111',
  },

  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  resendText: {
    color: '#777777',
    fontSize: 14,
  },

  resendLink: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '600',
  },

  back: {
    alignItems: 'center',
    marginTop: 20,
  },

  backText: {
    color: '#777777',
    fontSize: 14,
  },
});