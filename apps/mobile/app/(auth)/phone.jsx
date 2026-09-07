/* eslint-disable react/no-unescaped-entities */
import { useMemo, useState } from "react";
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
import { router } from "expo-router";

const logo = require("../../assets/icons/logo_light.png");

export default function PhoneScreen() {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);

  const cleanPhone = useMemo(() => {
    return phone.replace(/\D/g, "");
  }, [phone]);

  const isValidPhone = cleanPhone.length === 9 && cleanPhone.startsWith("6");

  const handlePhoneChange = (value) => {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 9);
    setPhone(numbersOnly);
  };

  const handleContinue = () => {
    if (!isValidPhone) return;

    router.push({
      pathname: "/(auth)/phone-otp",
      params: {
        phone: `+237${cleanPhone}`,
      },
    });
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
          {/* Logo */}
          <View style={styles.logoView}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>What's your number?</Text>

            <Text style={styles.subtitle}>
              Enter your phone number and we'll send you a verification code.
            </Text>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.label}>Phone number</Text>

              <View style={styles.phoneRow}>
                {/* Country Code */}
                <View style={styles.countryCode}>
                  <Text style={styles.flag}>🇨🇲</Text>

                  <Text style={styles.countryText}>+237</Text>
                </View>

                {/* Phone Input */}
                <View
                  style={[
                    styles.inputWrapper,
                    focused && styles.inputWrapperFocused,
                    isValidPhone && styles.inputWrapperValid,
                  ]}
                >
                  <TextInput
                    value={phone}
                    onChangeText={handlePhoneChange}
                    placeholder="6XX XXX XXX"
                    placeholderTextColor="#A1A1AA"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    maxLength={9}
                    style={styles.phoneInput}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    returnKeyType="done"
                    onSubmitEditing={handleContinue}
                  />

                  {isValidPhone && (
                    <View style={styles.validIcon}>
                      <Text style={styles.validIconText}>✓</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Continue */}
              <Pressable
                onPress={handleContinue}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.buttonText}>Send verification code</Text>
              </Pressable>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />

              <Text style={styles.or}>OR</Text>

              <View style={styles.divider} />
            </View>

            {/* Email Alternative */}
            <Pressable
              onPress={() => router.push("/(auth)/email")}
              style={({ pressed }) => [
                styles.alternativeButton,
                pressed && styles.alternativePressed,
              ]}
            >
              <View style={styles.emailIconContainer}>
                <Text style={styles.emailIcon}>@</Text>
              </View>

              <Text style={styles.alternativeText}>Continue with email</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{" "}
              <Text style={styles.footerLink}>Terms</Text> and{" "}
              <Text style={styles.footerLink}>Privacy Policy</Text>.
            </Text>
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

  /* Logo */
  logoView: {
    width: "100%",
    alignItems: "center",
    marginBottom: 26,
  },

  logo: {
    width: 90,
    height: 90,
  },

  /* Main */
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

  /* Form */
  form: {
    width: "100%",
  },

  label: {
    width: "100%",
    fontSize: 14,
    fontWeight: "600",
    color: "#222222",
    textAlign: "left",
    marginBottom: 9,
  },

  phoneRow: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },

  countryCode: {
    width: 92,
    height: 56,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#FAFAFA",
  },

  flag: {
    fontSize: 17,
  },

  countryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
  },

  inputWrapper: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 12,
  },

  inputWrapperFocused: {
    borderColor: "#111111",
    borderWidth: 1.5,
  },

  inputWrapperValid: {
    borderColor: "#111111",
  },

  phoneInput: {
    flex: 1,
    height: "100%",
    fontSize: 17,
    fontWeight: "500",
    color: "#111111",
    paddingVertical: 0,
    textAlign: "left",
  },

  validIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  validIconText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  /* Main Button */
  button: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 18,
    marginTop: 24,
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


  /* Divider */
  dividerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 26,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },

  or: {
    marginHorizontal: 14,
    color: "#999999",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },

  /* Email */
  alternativeButton: {
    width: "100%",
    height: 54,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },

  alternativePressed: {
    backgroundColor: "#FAFAFA",
    transform: [{ scale: 0.99 }],
  },

  emailIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
    justifyContent: "center",
  },

  emailIcon: {
    color: "#18181B",
    fontSize: 14,
    fontWeight: "800",
  },

  alternativeText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "600",
  },

  /* Footer */
  footer: {
    width: "100%",
    marginTop: 36,
    alignItems: "center",
  },

  footerText: {
    maxWidth: 340,
    textAlign: "center",
    color: "#A1A1AA",
    fontSize: 11.5,
    lineHeight: 18,
  },

  footerLink: {
    color: "#52525B",
    fontWeight: "600",
  },
});
