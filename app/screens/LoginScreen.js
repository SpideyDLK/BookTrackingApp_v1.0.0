import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../config/colors.js";
// import { Button } from "react-native-elements";
import {
  NativeBaseProvider,
  Input,
  FormControl,
  WarningOutlineIcon,
  Button,
  Toast,
} from "native-base";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { auth } from "../config/firebase.js";

const DisplayingErrorMessagesSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("E-mail cannot be empty"),
  password: Yup.string().required("Password cannot be empty"),
});

const screenHeight = Dimensions.get("window").height;

const LoginScreen = ({ navigation, route }) => {
  useEffect(() => {
    if (route.params && route.params.showToast) {
      Toast.show({
        render: () => {
          return (
            <View
              style={{
                backgroundColor: Colors.backgroundColorLight,
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
                name="check-circle"
                size={16}
                color={Colors.primary}
              />
              <Text
                style={{
                  marginLeft: 8,
                  color: Colors.primary,
                  fontWeight: "bold",
                }}
              >
                Successfully Signed Up!
              </Text>
            </View>
          );
        },
        duration: 3000,
      });
    }
  }, [route.params]);
  const [isLoading, setIsLoading] = useState(false);

  function handleSignIn(values) {
    setIsLoading(true);
    auth
      .signInWithEmailAndPassword(values.email, values.password)
      .then((userCredentials) => {
        setIsLoading(false);
        const user = userCredentials.user;
        console.log("Logged in with: ", user.email);
        // navigation.navigate("LoginScreen", {
        //   showToast: true,
        // });
      })
      .catch((error) => {
        setIsLoading(false);
        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
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
                    {error.code === "auth/user-not-found"
                      ? "User not found!"
                      : "Invalid credentials!"}
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
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        scrollEnabled={true}
      >
        <Image style={styles.image} source={require("../assets/login.png")} />

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={DisplayingErrorMessagesSchema}
          validateOnMount={true}
          onSubmit={(values) => {
            handleSignIn(values);
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
                  variant="rounded"
                  placeholder="Enter e-mail"
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
              >
                <FormControl.Label style={styles.labels}>
                  Password
                </FormControl.Label>
                <Input
                  secureTextEntry
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
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

              <Button
                _text={{ fontSize: "18", fontWeight: "bold" }}
                style={styles.signInButton}
                isLoading={isLoading}
                isLoadingText=""
                onPress={handleSubmit}
              >
                Sign In
              </Button>
            </View>
          )}
        </Formik>
        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>New to booktrackingapp?</Text>
          <Button
            _text={{ color: Colors.linkColor, fontSize: "16" }}
            variant="link"
            onPress={() => navigation.navigate("SignUpScreen")}
          >
            Sign Up
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </NativeBaseProvider>
  );
};

export default LoginScreen;

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
  signInButton: {
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
    fontSize: 18,
    color: Colors.textColor,
    flexDirection: "row",
    alignItems: "center",
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
