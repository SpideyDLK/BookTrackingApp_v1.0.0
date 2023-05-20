import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import React, { useState, useRef } from "react";
import Colors from "../config/colors.js";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  NativeBaseProvider,
  Input,
  FormControl,
  WarningOutlineIcon,
  Button,
  Spinner,
  Toast,
  Box,
  Flex,
} from "native-base";
import { auth } from "../config/firebase.js";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const screenHeight = Dimensions.get("window").height;

const DisplayingErrorMessagesSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("E-mail cannot be empty"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password cannot be empty"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords don't match.")
    .required("Confirm password cannot be empty"),
});

const SignUpScreen = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confPwdErrMsg, setConfPwdErrMsg] = useState("Passwords don't match.");
  const [emailErrMsg, setEmailErrMsg] = useState("Invalid E-mail");
  const [pwdErrMsg, setPwdErrMsg] = useState("Must be at least 8 characters");
  const [email, setEmail] = useState("");
  const passwordRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  // const toast = useToast();

  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return !emailRegex.test(email);
  // };

  // const validatePassword = (password) => {
  //   return password.length >= 8;
  // };
  // const validateConfPassword = () => {
  //   return password === confirmPassword;
  // };

  function handleSignUp(values) {
    setIsLoading(true);
    auth
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(() => {
        setIsLoading(false);
        navigation.navigate("LoginScreen", {
          showToast: true,
        });
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.code === "auth/email-already-in-use") {
          Toast.show({
            render: () => {
              return (
                <View
                  style={{
                    backgroundColor: Colors.errorBack,
                    paddingHorizontal: 2,
                    paddingVertical: 1,
                    borderRadius: 4,
                    marginBottom: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    height: 50,
                    width: 200,
                    borderRadius: 20,
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome
                    name="exclamation-circle"
                    size={16}
                    color={Colors.errorIcon}
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      color: Colors.errorFont,
                      fontWeight: "bold",
                    }}
                  >
                    E-mail already in use!
                  </Text>
                </View>
              );
            },
            duration: 3000,
          });
        }
      });
  }
  return (
    <NativeBaseProvider>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        contentContainerStyle={styles.container}
        scrollEnabled={true}
      >
        <Image style={styles.image} source={require("../assets/signup.png")} />

        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={DisplayingErrorMessagesSchema}
          validateOnMount={true}
          onSubmit={(values) => {
            handleSignUp(values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched,
            values,
          }) => (
            <View style={styles.formContainer}>
              <FormControl
                isInvalid={touched.email && errors.email}
                style={styles.input}
                w="90%"
              >
                <FormControl.Label style={styles.labels}>
                  E-mail
                </FormControl.Label>
                <Input
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  variant="rounded"
                  placeholder="Enter e-mail"
                  keyboardType="email-address"
                />
                {touched.email && errors.email && (
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.email}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <FormControl
                isInvalid={touched.password && errors.password}
                style={styles.input}
                w="90%"
                ref={passwordRef}
              >
                <FormControl.Label style={styles.labels}>
                  Password
                </FormControl.Label>
                <Input
                  secureTextEntry={true}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  variant="rounded"
                  placeholder="Enter password"
                />
                {touched.password && errors.password && (
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.password}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <FormControl
                isInvalid={touched.confirmPassword && errors.confirmPassword}
                style={styles.input}
                w="90%"
              >
                <FormControl.Label style={styles.labels}>
                  Confirm Password
                </FormControl.Label>
                <Input
                  secureTextEntry={true}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  variant="rounded"
                  placeholder="Confirm password"
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.confirmPassword}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <Button
                onPress={handleSubmit}
                _text={{ fontSize: "18", fontWeight: "bold" }}
                style={styles.signUpButton}
                isLoading={isLoading}
                isLoadingText=""
              >
                Sign Up
              </Button>
            </View>
          )}
        </Formik>

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Already joined?</Text>
          <Button
            _text={{ color: Colors.linkColor, fontSize: "16" }}
            variant="link"
            onPress={() => navigation.navigate("LoginScreen")}
          >
            Sign In
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </NativeBaseProvider>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: screenHeight,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  formContainer: {
    position: "absolute",
    top: 270,
    width: "100%",
    alignItems: "center",
  },
  signUpButton: {
    width: "90%",
    backgroundColor: Colors.buttonColor,
    borderRadius: 30,
    height: 50,
    marginTop: 20,
  },
  image: {
    flex: 1,
    width: 300,
    height: 300,
    resizeMode: "contain",
    objectFit: "contain",
    alignSelf: "center",
    position: "absolute",
    top: 0,
  },
  input: {
    marginTop: 10,
  },
  bottomTextContainer: {
    // flex: 1,
    fontSize: 18,
    color: Colors.textColor,
    flexDirection: "row",
    alignItems: "center",

    width: "100%",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
  },
  labels: {
    marginLeft: 10,
  },
  bottomText: {
    fontSize: 16,
  },
});
