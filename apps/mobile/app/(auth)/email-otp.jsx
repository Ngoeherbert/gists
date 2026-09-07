/* eslint-disable react/no-unescaped-entities */
import { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const logo = require("../../assets/icons/logo_light.png");

export default function EmailOtpScreen() {
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputs = useRef([]);

  const otpCode = otp.join("");
  const isComplete = otpCode.length === 6;

  const handleChange = (value, index) => {
    const numbersOnly = value.replace(/\D/g, "");

    // Handle OTP paste
    if (numbersOnly.length > 1) {
      const pastedCode = numbersOnly.slice(0, 6).split("");

      const nextOtp = ["", "", "", "", "", ""];

      pastedCode.forEach((digit, i) => {
        nextOtp[i] = digit;
      });

      setOtp(nextOtp);

      const nextIndex = Math.min(pastedCode.length, 5);
      inputs.current[nextIndex]?.focus();

      return;
    }

    const digit = numbersOnly.slice(-1);

    const nextOtp = [...otp];

    nextOtp[index] = digit;

    setOtp(nextOtp);

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (!isComplete) return;

    router.push({
      pathname: "/(auth)/create-password",
      params: {
        email: email || "",
      },
    });
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);

    setTimeout(() => {
      inputs.current[0]?.focus();
    }, 50);
  };

  const handleChangeEmail = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.content}>
          <View style={styles.logoView}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.mainContent}>
            <Text style={styles.title}>Verify your email</Text>

            <Text style={styles.subtitle}>
              Enter the 6-digit code we sent to your email address.
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) => handleChange(value, index)}
                  onKeyPress={(event) => handleKeyPress(event, index)}
                  keyboardType="number-pad"
                  inputMode="numeric"
                  maxLength={1}
                  textAlign="center"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  textContentType={index === 0 ? "oneTimeCode" : "none"}
                  selectTextOnFocus
                  style={[styles.otpInput, digit && styles.otpInputFilled]}
                />
              ))}
            </View>

            <Pressable
              onPress={handleVerify}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </Pressable>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>

              <Pressable onPress={handleResend} hitSlop={8}>
                <Text style={styles.resendLink}>Resend</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleChangeEmail}
              style={styles.changeContainer}
              hitSlop={8}
            >
              <Text style={styles.changeText}>Change email address</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  content: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  logoView: {
    width: "100%",
    alignItems: "center",
    marginBottom: 26,
  },

  logo: {
    width: 90,
    height: 90,
  },

  mainContent: {
    width: "100%",
    alignItems: "center",
  },

  title: {
    width: "100%",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
    letterSpacing: -0.6,
  },

  subtitle: {
    width: "100%",
    maxWidth: 400,
    fontSize: 15,
    lineHeight: 23,
    color: "#777777",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  otpContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
    color: "#111111",
    textAlign: "center",
  },

  otpInputFilled: {
    borderColor: "#111111",
    backgroundColor: "#FAFAFA",
  },

  button: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 18,
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  resendText: {
    color: "#777777",
    fontSize: 14,
  },

  resendLink: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 5,
  },

  changeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  changeText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
});
