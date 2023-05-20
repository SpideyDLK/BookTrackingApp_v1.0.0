import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  NativeModules,
} from "react-native";
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
  Pressable,
  Icon,
} from "native-base";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { auth } from "../config/firebase.js";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import GoogleLogo from "../assets/googleLogo.js";
import colors from "../config/colors.js";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const DisplayingErrorMessagesSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("E-mail cannot be empty"),
  password: Yup.string().required("Password cannot be empty"),
});

const screenHeight = Dimensions.get("window").height;

const LoginScreen = ({ navigation, route }) => {
  GoogleSignin.configure({
    webClientId:
      "382108518213-kkf5hbtj8b49qduemdveghqh227qdu9d.apps.googleusercontent.com",
  });

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential =
      firebase.auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth.signInWithCredential(googleCredential);
  }

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);

    if (result.isCancelled) {
      throw "User cancelled the login process";
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw "Something went wrong obtaining access token";
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
      data.accessToken
    );

    // Sign-in the user with the credential
    return auth.signInWithCredential(facebookCredential);
  }

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
  const [show, setShow] = useState(false);

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
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  variant="rounded"
                  placeholder="Enter password"
                  secureTextEntry={!show}
                  InputRightElement={
                    <Pressable onPress={() => setShow(!show)}>
                      <Icon
                        as={<FontAwesome name={show ? "eye-slash" : "eye"} />}
                        size={5}
                        mr="2"
                        color="muted.400"
                      />
                    </Pressable>
                  }
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
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />

                <Text style={styles.dividerText}> OR </Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.socialButtons}>
                <Button
                  _text={{ fontSize: "18", fontWeight: "bold" }}
                  style={styles.googleButton}
                  onPress={() =>
                    onGoogleButtonPress().then(() =>
                      console.log("Signed in with Google!")
                    )
                  }
                >
                  <GoogleLogo />
                </Button>
                <Button
                  _text={{ fontSize: "18", fontWeight: "bold" }}
                  style={styles.fbButton}
                  onPress={() =>
                    onFacebookButtonPress().then(() =>
                      console.log("Signed in with Facebook!")
                    )
                  }
                >
                  <FontAwesome name="facebook" size={25} color={Colors.white} />
                </Button>
                <Button
                  _text={{ fontSize: "18", fontWeight: "bold" }}
                  style={styles.twitterButton}
                  onPress={() =>
                    onTwitterButtonPress().then(() =>
                      console.log("Signed in with Twitter!")
                    )
                  }
                >
                  <FontAwesome name="twitter" size={25} color={Colors.white} />
                </Button>
              </View>
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
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </NativeBaseProvider>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: "100%",
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
  fbButton: {
    width: 50,
    backgroundColor: Colors.fbColor,
    borderRadius: 25,
    height: 50,

    marginLeft: 10,
    marginRight: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    // width: "80%",
  },
  divider: {
    width: "36%",
    height: 1,
    backgroundColor: colors.disbledColor,
  },
  dividerText: {
    color: colors.disbledColor,
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 10,
  },
  googleButton: {
    width: 50,
    backgroundColor: Colors.white,
    borderRadius: 25,
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  twitterButton: {
    width: 50,
    backgroundColor: Colors.twitterColor,
    borderRadius: 25,
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 15,
  },
  labels: {
    marginLeft: 10,
  },
  bottomText: {
    fontSize: 16,
  },
});
